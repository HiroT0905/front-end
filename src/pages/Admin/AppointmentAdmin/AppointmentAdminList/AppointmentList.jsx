import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import { ROUTE_PATH } from "../../../../constants/routes";
import { Pagination, Table, Button } from "antd";

const BloodDonationUnitList = () => {
  const [appointments, setAppointments] = useState([]); // Toàn bộ danh sách cuộc hẹn
  const [filteredAppointments, setFilteredAppointments] = useState([]); // Danh sách cuộc hẹn sau khi tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await UserService.getAllAppointments(token);
        const allAppointments = response.appointmentDTOList || [];
  
        const appointmentsWithEventDetails = await Promise.all(
          allAppointments.map(async (appointment) => {
            if (appointment.eventId) {
              try {
                const eventDetails = await UserService.getEventById(appointment.eventId, token);
                return { ...appointment, eventDetails: eventDetails.eventDTO }; // Lấy trực tiếp eventDTO
              } catch (error) {
                console.error(`Lỗi khi lấy thông tin sự kiện ID ${appointment.eventId}:`, error.message);
                return { ...appointment, eventDetails: null }; // Nếu lỗi, gán null cho eventDetails
              }
            }
            return { ...appointment, eventDetails: null };
          })
        );
  
        setAppointments(appointmentsWithEventDetails); // Sử dụng danh sách đã thêm thông tin chi tiết
        setFilteredAppointments(appointmentsWithEventDetails);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách cuộc hẹn:", error.message);
      }
    };
  
    fetchAppointments();
  }, []);

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (keyword === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) =>
        appointment.eventId.toString().includes(keyword) || 
        appointment.status.toLowerCase().includes(keyword)
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Bạn chắc chắn muốn xóa cuộc hẹn này?")) {
      try {
      
        await UserService.deleteAppointment(id, token); // Gọi API để xóa cuộc hẹn
        setFilteredAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== id)
        );
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== id)
        );
        alert("Cuộc hẹn đã được xóa thành công.");
      } catch (error) {
        console.error("Xóa cuộc hẹn thất bại:", error.message);
        alert("Đã xảy ra lỗi khi xóa cuộc hẹn.");
      }
    }
  };

  const columns = [
    {
      title: 'Cuộc hẹn ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
        title: 'Người đăng ký',
        dataIndex: 'userId',
        key: 'userId',
      },
      {
        title: "Tên sự kiện",
        key: "name",
        render: (text, record) =>
          record.eventDetails?.name || "Không xác định", // Hiển thị tên sự kiện nếu có
      },
    {
      title: 'Ngày giờ',
      dataIndex: 'appointmentDateTime',
      key: 'appointmentDateTime',
      render: (text) => new Date(text).toLocaleString(), // Hiển thị ngày giờ định dạng chuẩn
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Link
            className="text-blue-500"
            to={ROUTE_PATH.APPOINTMENTS_ADMIN_EDIT(record.id)}
          >
            Chỉnh sửa
          </Link>
          <Button
            type="link"
            className="text-red-500"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-units">
      <h2 className="title">Tất cả các cuộc hẹn hiến máu</h2>

      <div className="filter-container">
        <label htmlFor="search" className="filter-label">
          Tìm kiếm theo ID sự kiện hoặc trạng thái:
        </label>
        <input
          id="search"
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Nhập ID sự kiện hoặc trạng thái"
          className="filter-input"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredAppointments}
        rowKey="id" // Đảm bảo mỗi dòng có khóa duy nhất
        pagination={false} // Tắt phân trang mặc định của Table, chúng ta sẽ tự tạo phân trang dưới
      />

      {/* Phân trang tùy chỉnh */}
      <Pagination
        total={filteredAppointments.length}
        pageSize={5}
        showSizeChanger={false}
        onChange={(page) => {
          console.log(`Chuyển sang trang ${page}`);
        }}
        className=" mt-5 text-center"
      />
    </div>
  );
};

export default BloodDonationUnitList;
