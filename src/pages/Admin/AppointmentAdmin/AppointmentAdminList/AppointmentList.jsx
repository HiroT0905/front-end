import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination, Table, Button, Input, Spin, Modal, message } from "antd";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import UserService from "../../../../service/userService";
import { ROUTE_PATH } from "../../../../constants/routes";
import "./style.css";

const { confirm } = Modal;

const BloodDonationUnitList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  const navigate = useNavigate();

  // Fetch appointments data
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await UserService.getAllAppointments(token);
      const allAppointments = response.appointmentDTOList || [];
      
      // Fetch event details for each appointment
      const appointmentsWithDetails = await Promise.all(
        allAppointments.map(async (appointment) => {
          if (!appointment.eventId) return { ...appointment, eventDetails: null };
          
          try {
            const eventDetails = await UserService.getEventById(appointment.eventId, token);
            return { ...appointment, eventDetails: eventDetails.eventDTO };
          } catch (error) {
            console.error(`Error fetching event ${appointment.eventId}:`, error);
            return { ...appointment, eventDetails: null };
          }
        })
      );

      setAppointments(appointmentsWithDetails);
      setFilteredAppointments(appointmentsWithDetails);
      setTotalItems(appointmentsWithDetails.length);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách cuộc hẹn");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle search functionality
  const handleSearchChange = useCallback((e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (!keyword) {
      setFilteredAppointments(appointments);
      setTotalItems(appointments.length);
      setCurrentPage(1);
      return;
    }

    const filtered = appointments.filter(
      (appointment) =>
        appointment.eventId?.toString().includes(keyword) ||
        appointment.status?.toLowerCase().includes(keyword) ||
        appointment.userId?.toString().includes(keyword) ||
        appointment.eventDetails?.title?.toLowerCase().includes(keyword)
    );
    
    setFilteredAppointments(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  }, [appointments]);

  // Handle delete appointment
  const handleDelete = useCallback(async (id) => {
    confirm({
      title: 'Xác nhận xóa cuộc hẹn',
      icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn xóa cuộc hẹn này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        const token = localStorage.getItem("token");
        try {
          await UserService.deleteAppointment(id, token);
          message.success('Xóa cuộc hẹn thành công');
          
          // Update state without refetching
          setAppointments(prev => prev.filter(app => app.id !== id));
          setFilteredAppointments(prev => prev.filter(app => app.id !== id));
          setTotalItems(prev => prev - 1);
          
          // Reset to first page if current page becomes empty
          if (filteredAppointments.length % pageSize === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } catch (error) {
          console.error("Error deleting appointment:", error);
          message.error('Xóa cuộc hẹn thất bại');
        }
      },
    });
  }, [currentPage, filteredAppointments.length]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((id) => {
    navigate(ROUTE_PATH.APPOINTMENTS_ADMIN_EDIT(id));
  }, [navigate]);

  // Table columns configuration
  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id",
      width: 80,
      align: 'center',
      render: (id) => <span className="font-mono">#{id}</span>
    },
    { 
      title: "Người đăng ký", 
      dataIndex: "userId", 
      key: "userId",
      width: 120,
      align: 'center',
      render: (userId) => <span className="font-medium">U{userId}</span>
    },
    { 
      title: "Sự kiện", 
      key: "event",
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-800">
            {record.eventDetails?.title || "Không xác định"}
          </div>
          {record.eventDetails && (
            <div className="text-gray-500 text-sm">
              ID: {record.eventId}
            </div>
          )}
        </div>
      ),
      ellipsis: true
    },
    { 
      title: "Thời gian", 
      dataIndex: "appointmentDateTime", 
      key: "appointmentDateTime",
      render: (text) => (
        <div className="text-blue-600">
          <div className="font-semibold">
            {new Date(text).toLocaleDateString('vi-VN')}
          </div>
          <div className="text-sm">
            {new Date(text).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      ),
      width: 150,
      align: 'center',
      sorter: (a, b) => new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <span className={`status-pill ${status.toLowerCase()}`}>
          {status}
        </span>
      ),
      width: 120,
      align: 'center',
      filters: [
        { text: 'Đang chờ', value: 'PENDING' },
        { text: 'Đã xác nhận', value: 'CONFIRMED' },
        { text: 'Đã hoàn thành', value: 'COMPLETED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { 
      title: "Hành động", 
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button 
            type="link" 
            className="action-btn view-btn"
            onClick={() => handleViewDetails(record.id)}
          >
            Chỉnh sửa
          </Button>
          <Button 
            type="link" 
            danger
            className="action-btn"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
      width: 180,
      align: 'center',
      fixed: 'right'
    },
  ];

  return (
    <div className="manage-appointments p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="header-section mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Cuộc hẹn Hiến máu</h1>
            {/* <Button 
              type="primary" 
              onClick={() => navigate(ROUTE_PATH.APPOINTMENTS_ADMIN_ADD)}
            >
              Tạo cuộc hẹn mới
            </Button> */}
          </div>
          
          <div className="search-section mb-4">
            <Input
              allowClear
              size="large"
              placeholder="Tìm kiếm cuộc hẹn..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchKeyword}
              onChange={handleSearchChange}
              className="custom-search-input"
            />
          </div>
        </div>

        <div className="content-section bg-white rounded-xl shadow-lg overflow-hidden">
          <Spin spinning={loading} tip="Đang tải dữ liệu..." size="large">
            <Table
              columns={columns}
              dataSource={filteredAppointments.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1000 }}
              locale={{
                emptyText: (
                  <div className="py-12 text-center">
                    <img 
                      src="/empty-state.svg" 
                      alt="No data" 
                      className="w-40 mx-auto mb-4 opacity-70"
                    />
                    <p className="text-gray-500 text-lg">
                      {searchKeyword ? 
                        "Không tìm thấy cuộc hẹn phù hợp" : 
                        "Không có cuộc hẹn nào"}
                    </p>
                  </div>
                )
              }}
              className="custom-table"
            />
          </Spin>

          {!loading && totalItems > 0 && (
            <div className="pagination-section bg-gray-50 px-6 py-4 border-t border-gray-200">
              <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={pageSize}
                onChange={handlePageChange}
                showTotal={(total) => `Tổng ${total} cuộc hẹn`}
                showSizeChanger={false}
                className="text-center"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodDonationUnitList;