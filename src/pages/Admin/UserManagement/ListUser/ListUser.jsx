import { Flex, Input, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";

const ListUser = () => {
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState(""); // State for search text

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getAllUsers();
        const allUsers = response.userList;
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.userInfoDTO.fullName
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình các cột của bảng
  const columns = [
    {
      title: "CCCD",
      key: "username",
      dataIndex: "username", // Truy cập trực tiếp vào `cccd`
    },
    {
      title: "Họ tên",
      key: "fullName",
      render: (record) => record.userInfoDTO.fullName, // Truy cập vào `userInfoDTO.fullName`
    },
    {
      title: "Vai trò",
      key: "role",
      render: (record) => record.role.name, // Lấy tên của `role`
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => {
        return (
          <Flex gap="12px">
            {/* Set role */}
            {/* <p
              className="cursor-pointer text-blue-500"
              onClick={() => handleSetRole(record)}
            >
              Set role
            </p> */}

            {/* Edit user */}
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.EDIT_USER(record.username)} // Sử dụng `record.username` để chuyển đến trang chỉnh sửa
            >
              Chỉnh sửa
            </Link>

            {/* Delete user */}
            <Popconfirm
              title="Xóa người dùng này?"
              description="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.username)} // Gọi hàm xóa khi xác nhận
            >
              <p className="text-red-500 cursor-pointer">Xóa</p>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  // Hàm xử lý thiết lập vai trò
  const handleSetRole = (user) => {
    console.log(`Set role for user: ${user.username}`);
    // Xử lý việc thay đổi vai trò của người dùng ở đây (ví dụ: hiển thị modal để chọn vai trò mới)
  };

  // Hàm xử lý xóa người dùng
  const handleDeleteUser = (username) => {
    console.log(`Delete user with ID: ${username}`);
    // Thực hiện gọi API để xóa người dùng
    UserService.deleteUser(username).then(() => {
      setUsers(users.filter((user) => user.username !== username)); // Cập nhật lại danh sách người dùng sau khi xóa
    });
  };

  // Phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Quản lý người dùng</h1>

        <Input
          placeholder="Tìm kiếm bằng CCCD hoặc họ tên..."
          className="w-64 mb-5"
          suffix={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={handleSearch}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredUsers} // Dữ liệu người dùng sau khi tìm kiếm
        rowKey="id" // Sử dụng `id` làm khóa duy nhất cho mỗi hàng
        // Phân trang
        pagination={{
          current: currentPage,
          pageSize: pageSize,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default ListUser;
