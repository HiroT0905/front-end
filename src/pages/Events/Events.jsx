import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, Pagination, Spin, message } from "antd";
import userService from "../../service/userService";
import { useLocation, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

function BloodDonationSearch() {
  const [filters, setFilters] = useState({
    dateRange: [],
    unit: "Tất cả",
    unitId: null,
  });
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState([]);

  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      startDate: params.get("startDate"),
      endDate: params.get("endDate"),
      unitId: params.get("unitId"),
    };
  };

  useEffect(() => {
    const { startDate, endDate, unitId } = getQueryParams();
    fetchEvents(startDate, endDate, unitId);
  }, [location.search]);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await userService.getAllUnits(token);
      if (Array.isArray(response.donationUnitList)) {
        setUnits(response.donationUnitList);                   
      } else {
        setUnits([]);
      }
    } catch (err) {
      message.error("Lỗi khi tải danh sách tổ chức.");
      console.error(err);
      setUnits([]);
    }
  };

  const fetchEvents = async (startDate, endDate) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await userService.getEventsByDateRange(
        token,
        startDate,
        endDate,
      );
      setEvents(response || []);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu sự kiện.");
      console.error(err);
      setEvents([]);
      resetFilters();
    } finally {
      setLoading(false);
    }
  };
  

  const resetFilters = () => {
    setFilters({
      dateRange: [],
      unit: "Tất cả",
      unitId: null,
    });
    setCurrentPage(1);
    navigate("/events?startDate=&endDate=&unitId=");
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [start, end] = dates;
      const formattedStart = start.format("YYYY-MM-DD");
      const formattedEnd = end.format("YYYY-MM-DD");
      setFilters({ ...filters, dateRange: dates });
      const url = `/events?startDate=${formattedStart}&endDate=${formattedEnd}&unitId=${filters.unitId || ""}`;
      navigate(url);
    } else {
      resetFilters();
    }
  };

  const handleUnitChange = (value) => {
    console.log("Selected Unit:", value); // Kiểm tra giá trị được chọn
  
    const unitId = value === "Tất cả" ? "" : value; // Đảm bảo không gửi 0 nếu chọn "Tất cả"
    console.log("Unit ID gửi đi:", unitId); // Xem unitId được cập nhật
  
    setFilters({ ...filters, unit: value, unitId });
  
    const { startDate, endDate } = getQueryParams();
    const url = `/events?startDate=${startDate || ""}&endDate=${endDate || ""}&unitId=${unitId}`;
    navigate(url);
  };
  

  const handleBooking = (event) => {
    const username = localStorage.getItem("username");
    const eventId = event.id;
    localStorage.setItem("eventId",eventId);
    // console.log("Username", username);
    navigate(`/appointments/booking`);
    // message.success(`Bạn đã đặt lịch tại: ${event.name}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = events.slice(startIndex, endIndex);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const formatTime = (timeString) => {
  const [hour, minute] = timeString.split(":"); // Tách giờ và phút từ chuỗi
  return `${hour}:${minute}`; // Trả về chuỗi theo format HH:mm
};

const formatSeconds = (seconds) => {
  if (typeof seconds !== "number") return "Invalid time"; // Kiểm tra dữ liệu đầu vào
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
const formatTimeSlots = (timeSlots) => {
  return timeSlots
      .map(slot => `${formatSeconds(slot.donateAcceptTime)} - ${formatSeconds(slot.donateStopTime)}`)
      .join(", ");
};

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4 flex items-center gap-4">
          <label htmlFor="date-range" className="block text-sm text-gray-700 font-medium whitespace-nowrap">
            Bạn cần đặt lịch vào thời gian nào?
          </label>
          <RangePicker
            id="date-range"
            className="w-96"
            onChange={handleDateRangeChange}
            value={filters.dateRange}
          />
        </div>
        <div className="flex flex-wrap gap-4">
         
          <Select
            className="w-60"
            onChange={handleUnitChange}
            value={filters.unitId ?? "Tất cả"}
            options={[
              { value: "Tất cả", label: "Tất cả" },
              ...units.map((unit) => ({ value: unit.id, label: unit.unit })),
            ]}
          />
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-600 text-center">Không có sự kiện nào phù hợp với bộ lọc của bạn.</p>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{events.length} Kết quả</p>
            <div className="space-y-4">
              {currentItems.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                  <div className="flex items-start gap-6">
                    <img
                      src={event.donationUnitDTO.unitPhotoUrl}
                      alt={event.donationUnitDTO.name}
                      className="w-20 h-20 object-contain"
                    />
                    <div>
                      <p className="text-base font-bold text-blue-600 mb-1">{event.title}</p>
                      <p className="text-sm text-gray-500 mb-1">Địa chỉ: <b>{event.donationUnitDTO.location}</b></p>
                      <p className="text-sm text-gray-500">
                        Thời gian hoạt động: <b>{formatDate(event.donateDate)} - Từ ({formatTime(event.eventStartTime)} đến {formatTime(event.eventEndTime)}) </b>
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Thời gian hiến máu: <b>{formatTimeSlots(event.donationTimeSlotDTO)}</b> 
                      </p>                   
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-xs text-gray-500 ">Số lượng đăng ký</p>
                      <p className="text-xl font-bold text-blue-700">
                        {event.currentRegistrations} / {event.maxRegistrations}
                      </p>
                    <Button
                      type="primary"
                      onClick={() => handleBooking(event)}
                      className="px-6 bg-blue-700"
                      disabled={event.currentRegistrations >= event.maxRegistrations}
                    >
                      Đặt lịch
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={events.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BloodDonationSearch;
