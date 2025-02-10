import { Flex, Input, Popconfirm, Table } from "antd";
import React, { useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";

const DATA = [
  {
    id: 1,
    healthMetrics: "Test 1",
    notes: "Note 1",
  },
];

const HealthCheckList = () => {
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const columns = useMemo(() => {
    return [

      {
        title: "Nhịp tim",
        key: "heartRate",
        dataIndex: "heartRate",
      },
      {
        title: "Huyết áp",
        key: "bloodPressure",
        dataIndex: "bloodPressure",
      },
    //   {
    //     title: "Respiratory Rate",
    //     key: "respiratoryRate",
    //     dataIndex: "respiratoryRate",
    //   },
      {
        title: "Nhiệt độ",
        key: "temperature",
        dataIndex: "temperature",
      },
    //   {
    //     title: "Blood Oxygen",
    //     key: "bloodOxygen",
    //     dataIndex: "bloodOxygen",
    //   },
      {
        title: "Chiều cao",
        key: "height",
        dataIndex: "height",
      },
      {
        title: "Cân nặng",
        key: "weight",
        dataIndex: "weight",
      },
      {
        title: "Số liệu sức khỏe",
        key: "healthMetrics",
        dataIndex: "healthMetrics",
      },
      {
        title: "BMI",
        key: "bmi",
        dataIndex: "bmi",
      },
      {
        title: "Ghi chú",
        key: "notes",
        dataIndex: "notes",
      },
      {
        title: "Kết quả",
        key: "result",
        dataIndex: "result",
      },
      {
        title: "Hành động",
        key: "actions",
        render: () => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.HEALTH_CHECK_EDIT(888)}
              >
                Edit
              </Link>

              <Popconfirm
                title="Xóa lịch sử này?"
                description="Bạn có chắc chắn muốn xóa lịch sử này?"
              >
                <p className="text-red-500 cursor-pointer">Delete</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, []);

  // Phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Kiểm tra sức khỏe</h1>

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
        dataSource={DATA}
        rowKey="id"

      // Phân trang
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: DATA.length,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default HealthCheckList;
