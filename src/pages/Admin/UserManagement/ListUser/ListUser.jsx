import React, { useState, useEffect, useCallback } from "react";
import { Flex, Input, Table, Button, Modal, message, Tag, Space } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";
import "./style.css";

const { confirm } = Modal;

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers();
      const allUsers = response.userList || [];
      setUsers(allUsers);
      setFilteredUsers(allUsers);
      setTotalItems(allUsers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchText(keyword);

    if (!keyword) {
      setFilteredUsers(users);
      setTotalItems(users.length);
      setCurrentPage(1);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(keyword) ||
        user.userInfoDTO?.fullName?.toLowerCase().includes(keyword) ||
        user.role?.name?.toLowerCase().includes(keyword)
    );

    setFilteredUsers(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  }, [users]);

  const handleDeleteUser = useCallback((username) => {
    confirm({
      title: 'Xác nhận xóa người dùng',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await UserService.deleteUser(username);
          message.success('Xóa người dùng thành công');

          setUsers(prev => prev.filter(user => user.username !== username));
          setFilteredUsers(prev => prev.filter(user => user.username !== username));
          setTotalItems(prev => prev - 1);

          // Điều chỉnh lại trang nếu cần
          const newTotal = filteredUsers.length - 1;
          if (newTotal <= (currentPage - 1) * pageSize && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error('Xóa người dùng thất bại');
        }
      },
    });
  }, [currentPage, filteredUsers.length, pageSize]);

  const handleTableChange = useCallback((pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'red';
      case 'STAFF': return 'blue';
      case 'USER': return 'green';
      default: return 'gray';
    }
  };

  const columns = [
    { 
      title: "CCCD", 
      dataIndex: "username", 
      key: "username",
      width: 150,
      render: (text) => <span className="font-mono">{text}</span>
    },
    { 
      title: "Họ tên", 
      key: "fullName",
      render: (_, record) => (
        <div className="font-medium text-gray-800">
          {record.userInfoDTO?.fullName || "Không có thông tin"}
        </div>
      ),
      ellipsis: true
    },
    { 
      title: "Điện thoại", 
      key: "phone",
      render: (_, record) => (
        <div className="font-medium text-gray-800">
          {record?.phone || "Không có thông tin"}
        </div>
      ),
      ellipsis: true
    },
    { 
      title: "Email", 
      key: "email",
      render: (_, record) => (
        <div className="font-medium text-gray-800">
          {record?.email || "Không có thông tin"}
        </div>
      ),
      ellipsis: true
    },
    { 
      title: "Vai trò", 
      key: "role",
      render: (_, record) => (
        <Tag color={getRoleColor(record.role?.name)} className="capitalize">
          {record.role?.name || "Không xác định"}
        </Tag>
      ),
      width: 150,
    
  
    },
    { 
      title: "Hành động", 
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Link to={ROUTE_PATH.EDIT_USER(record.username)}>
            <Button icon={<EditOutlined />} className="action-btn edit-btn" />
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            className="action-btn"
            onClick={() => handleDeleteUser(record.username)}
          />
        </Space>
      ),
      width: 120,
      fixed: 'right'
    },
  ];

  // ✅ Tính toán dữ liệu hiển thị cho pagination
  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="user-management p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="header-section mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
            <Link to={ROUTE_PATH.ADD_USER}>
              <Button type="primary">Thêm người dùng mới</Button>
            </Link>
          </div>
          <div className="search-section mb-4">
            <Input
              allowClear
              size="large"
              placeholder="Tìm kiếm theo CCCD, họ tên hoặc vai trò..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={handleSearch}
              className="custom-search-input"
            />
          </div>
        </div>

        <div className="content-section bg-white rounded-xl shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={paginatedData}
            rowKey="username"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showTotal: (total) => `Tổng ${total} người dùng`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  <img 
                    src="/empty-state.svg" 
                    alt="No data" 
                    className="w-40 mx-auto mb-4 opacity-70"
                  />
                  <p className="text-gray-500 text-lg">
                    {searchText ? 
                      "Không tìm thấy người dùng phù hợp" : 
                      "Không có người dùng nào"}
                  </p>
                </div>
              )
            }}
            className="custom-table"
          />
        </div>
      </div>
    </div>
  );
};

export default ListUser;
