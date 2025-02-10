import { Flex, Input, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";

const EventBloodDonationList = () => {
  const [searchText, setSearchText] = useState(""); // State cho text tìm kiếm
  const [events, setEvents] = useState([]); // Dữ liệu các sự kiện

  // Lấy danh sách sự kiện khi component được mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await UserService.getAllEvents();
        const allEvents = response.eventDTOList;
        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };

    fetchEvents();
  }, []);

  // Hàm tìm kiếm
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  // Lọc sự kiện theo tên hoặc ngày
  const filteredEvents = events.filter((event) => {
    const searchLower = searchText.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.eventDate.includes(searchLower)
    );
  });

  // Cấu hình cột bảng
  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id", 
    },
    {
      title: "Tên sự kiện",
      key: "name",
      dataIndex: "name", 
    },
    {
      title: "Ngày diễn ra",
      key: "eventDate",
      dataIndex: "eventDate",
    },
    {
      title: "Thời gian bắt đầu",
      key: "eventStartTime",
      dataIndex: "eventStartTime",
    },
    {
      title: "Thời gian kết thúc",
      key: "eventEndTime",
      dataIndex: "eventEndTime",
    },
    {
      title: "Số lượng đăng ký",
      key: "currentRegistrations",
      render: (record) => `${record.currentRegistrations}/${record.maxRegistrations}`,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status", // Hiển thị trực tiếp status từ dữ liệu trả về
      render: (status) => (
        <span className={status === "ACTIVE" ? "text-green-500" : "text-red-500"}>
          {status}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record) => {
        return (
          <Flex gap="12px">
            {/* Edit event */}
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.EVENT_BLOOD_DONATION_EDIT(record.id)} // Chỉnh sửa sự kiện
            >
              Chỉnh sửa
            </Link>

            {/* Delete event */}
            <Popconfirm
              title="Delete event"
              description="Are you sure you want to delete this event?"
              onConfirm={() => handleDeleteEvent(record.id)} // Xóa sự kiện
            >
              <p className="text-red-500 cursor-pointer">Xóa</p>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  // Hàm xóa sự kiện
  const handleDeleteEvent = (eventId) => {
    console.log(`Delete event with ID: ${eventId}`);
    // Gọi API xóa sự kiện và cập nhật lại danh sách
    UserService.deleteEvent(eventId).then(() => {
      setEvents(events.filter(event => event.id !== eventId)); // Cập nhật lại danh sách sự kiện sau khi xóa
    });
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Danh sách sự kiện hiến máu</h1>

        <Input
          placeholder="Tìm kiếm tên sự kiện hoặc ngày..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={handleSearch} // Cập nhật state khi người dùng gõ tìm kiếm
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredEvents} // Dữ liệu đã lọc
        rowKey="id" // Sử dụng `id` làm khóa duy nhất cho mỗi hàng
      />
    </>
  );
};

export default EventBloodDonationList;
