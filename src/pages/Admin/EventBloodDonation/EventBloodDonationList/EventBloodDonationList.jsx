import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Button, Space, Tag, Modal, message, Card } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";
import "./style.css";

const { confirm } = Modal;

const EventBloodDonationList = () => {
  const [searchText, setSearchText] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch events data
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllEvents();
      const allEvents = response.eventDTOList || [];
      setEvents(allEvents);
      setFilteredEvents(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle search functionality
  const handleSearch = useCallback((e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchText(keyword);

    if (!keyword) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      return (
        event?.title?.toLowerCase().includes(keyword) ||
        event.donateDate.includes(keyword) ||
        event?.status?.toLowerCase().includes(keyword)
      );
    });
    
    setFilteredEvents(filtered);
    setCurrentPage(1);
  }, [events]);

  // Handle delete event
  const handleDeleteEvent = useCallback((eventId) => {
    confirm({
      title: 'Xác nhận xóa sự kiện',
      // icon: <ExclamationCircleFilled />,
      content: 'Bạn có chắc chắn muốn xóa sự kiện này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await UserService.deleteEvent(eventId);
          message.success('Xóa sự kiện thành công');
          setEvents(prev => prev.filter(event => event.id !== eventId));
          setFilteredEvents(prev => prev.filter(event => event.id !== eventId));
        } catch (error) {
          console.error("Error deleting event:", error);
          message.error('Xóa sự kiện thất bại');
        }
      },
    });
  }, []);

  // Format date
  const formatDate = useCallback((isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  }, []);

  // Table columns configuration
  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id",
      width: 80,
      render: (id) => <span className="font-mono">#{id}</span>
    },
    { 
      title: "Tên sự kiện", 
      dataIndex: "title", 
      key: "title",
      ellipsis: true,
      render: (text) => <span className="font-medium">{text}</span>
    },
    { 
      title: "Ngày diễn ra", 
      key: "donateDate",
      render: (_, record) => formatDate(record.donateDate),
      width: 120,
      sorter: (a, b) => new Date(a.donateDate) - new Date(b.donateDate)
    },
    { 
      title: "Thời gian", 
      key: "time",
      render: (_, record) => (
        <div className="text-blue-600">
          {record.eventStartTime} - {record.eventEndTime}
        </div>
      ),
      width: 150
    },
    { 
      title: "Số lượng đăng ký", 
      key: "registrations",
      render: (_, record) => (
        <span className="font-semibold">
          {record.currentRegistrations}/{record.maxRegistrations}
        </span>
      ),
      width: 150,
      align: 'center'
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status?.toLowerCase()}
        </Tag>
      ),
      width: 120,
      filters: [
        { text: 'Active', value: 'ACTIVE' },
        { text: 'Inactive', value: 'INACTIVE' },
        { text: 'Completed', value: 'COMPLETED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { 
      title: "Hành động", 
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={ROUTE_PATH.EVENT_BLOOD_DONATION_EDIT(record.id)}>
            <Button 
              icon={<EditOutlined />} 
              className="action-btn edit-btn"
            />
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            className="action-btn"
            onClick={() => handleDeleteEvent(record.id)}
          />
        </Space>
      ),
      width: 120,
      fixed: 'right'
    },
  ];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'INACTIVE': return 'orange';
      case 'COMPLETED': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="event-management">
      <Card className="header-card">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý Sự kiện Hiến máu</h1>
          <Link to={ROUTE_PATH.EVENT_BLOOD_DONATION_CREATE}>
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm sự kiện
            </Button>
          </Link>
        </div>

        <div className="mt-4">
          <Input
            allowClear
            size="large"
            placeholder="Tìm kiếm sự kiện..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </Card>

      <div className="mt-6">
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredEvents.length,
            showTotal: (total) => `Tổng ${total} sự kiện`,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <div className="py-12 text-center">
                <img 
                  src="/empty-events.svg" 
                  alt="No events" 
                  className="w-40 mx-auto mb-4 opacity-70"
                />
                <p className="text-gray-500 text-lg">
                  {searchText ? 
                    "Không tìm thấy sự kiện phù hợp" : 
                    "Chưa có sự kiện nào"}
                </p>
              </div>
            )
          }}
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default EventBloodDonationList;