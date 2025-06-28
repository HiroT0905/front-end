import { Flex, Input, Popconfirm, Table, message, Spin } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";

const BloodDonationHistoryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [bloodInventories, setBloodInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBloodInventoryData = async () => {
      try {
        const response = await UserService.getAllBloodInventory(token);
        setBloodInventories(response.bloodInventoryDTOList || []);
  
      } catch (error) {
        message.error("Failed to fetch data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodInventoryData();
  }, [token]);

  const columns = useMemo(() => {
    return [
      {
        title: "Người hiến",
        key: "user",
  
        render: (_, record) => record.appointmentDTO?.userId || "N/A",
      },
      {
        title: "Loại máu",
        key: "donationType",
        dataIndex: "donationType",
      },
      {
        title: "Thể tích (ml)",
        key: "quantity",
        dataIndex: "quantity",
      },
      {
        title: "Ngày cập nhật",
        key: "lastUpdated",
        dataIndex: "lastUpdated",
        render: (date) => new Date(date).toLocaleString(),
      },
      {
        title: "Ngày hết hạn",
        key: "expirationDate",
        dataIndex: "expirationDate",
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: "Trạng thái lịch hẹn",
        key: "status",
        render: (_, record) => record.appointmentDTO?.status || "N/A",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <Flex gap="12px">
            <Link
              className="text-blue-500"
              to={ROUTE_PATH.EDIT_BLOOD_DONATION_HISTORY(record.id)}
            >
              Chỉnh sửa
            </Link>
            <Popconfirm
              title="Xóa dữ liệu"
              description="Bạn có chắc chắn muốn xóa mục này không?"
              onConfirm={() => handleDelete(record.id)}
            >
              <p className="text-red-500 cursor-pointer">Xóa</p>
            </Popconfirm>
          </Flex>
        ),
      },
    ];
  }, []);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleDelete = async (id) => {
    try {
      await UserService.deleteBloodInventory(id, token);
      setBloodInventories(bloodInventories.filter((item) => item.id !== id));
      message.success("Deleted successfully!");
    } catch (error) {
      message.error("Failed to delete: " + error.message);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Danh sách kho máu</h1>
        <Input
          placeholder="Tìm kiếm..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
        />
      </Flex>

      <Table
        columns={columns}
        className="mt-4"
        scroll={{ x: 1200 }}
        dataSource={bloodInventories}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: bloodInventories.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default BloodDonationHistoryList;
