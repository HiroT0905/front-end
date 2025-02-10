import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, Pagination, Spin, message } from "antd";
import userService from "../../service/userService";
import { useLocation, useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;

function BloodDonationSearch() {
  const [filters, setFilters] = useState({
    dateRange: [],
    organization: "Tất cả",
    organizationId: null,
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

  const fetchEvents = async (startDate, endDate, organizationId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await userService.getEventsByDateRange(
        token,
        startDate,
        endDate,
        organizationId
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
      organization: "Tất cả",
      organizationId: null,
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
      const url = `/events?startDate=${formattedStart}&endDate=${formattedEnd}&unitId=${filters.organizationId || ""}`;
      navigate(url);
    } else {
      resetFilters();
    }
  };

  const handleOrganizationChange = (value) => {
    const unitId = value === "Tất cả" ? null : value;
    setFilters({ ...filters, organization: value, organizationId: unitId });
    const { startDate, endDate } = getQueryParams();
    const url = `/events?startDate=${startDate || ""}&endDate=${endDate || ""}&unitId=${unitId || ""}`;
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
          <Button type="default" className="px-6">Gần tôi</Button>
          <Button type="default" className="px-6">Đề xuất</Button>
          <Select
            className="w-60"
            onChange={handleOrganizationChange}
            value={filters.organization}
            options={[
              { value: "Tất cả", label: "Tất cả" },
              ...units.map((unit) => ({ value: unit.id, label: unit.name })),
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
                      <h3 className="text-lg font-bold text-blue-600 mb-1">{event.name}</h3>
                      <p className="text-gray-500 mb-1">{event.donationUnitDTO.location}</p>
                      <p className="text-gray-500">
                        Thời gian: {event.eventDate} ({event.eventStartTime} - {event.eventEndTime})
                      </p>
                      <p className="text-gray-500">
                        {event.currentRegistrations} / {event.maxRegistrations} Người đã đăng ký
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button
                      type="primary"
                      onClick={() => handleBooking(event)}
                      className="px-6"
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
