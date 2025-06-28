import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import { ROUTE_PATH } from "../../../../constants/routes";
import { Table, Button, Input, Popconfirm, message, Pagination } from "antd"; // Make sure to import Pagination here
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./ManageBloodDonationUnitsPage.css";

const BloodDonationUnitList = () => {
  const [units, setUnits] = useState([]); // Toàn bộ danh sách đơn vị
  const [filteredUnits, setFilteredUnits] = useState([]); // Danh sách đơn vị sau khi tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [pageSize, setPageSize] = useState(10); // Số đơn vị mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await UserService.getAllUnits(token);
        const allUnits = response.donationUnitList;
        setUnits(Array.isArray (allUnits) ? allUnits : []);
        setFilteredUnits(allUnits);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn vị:", error.message);
      }
    };

    fetchUnits();
  }, []);

  const handleSearchChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    if (keyword === "") {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((unit) =>
        unit.name.toLowerCase().includes(keyword)
      );
      setFilteredUnits(filtered);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Bạn chắc chắn muốn xóa đơn vị này?")) {
      try {
        await UserService.deleteUnit(id, token);
        setFilteredUnits((prevUnits) =>
          prevUnits.filter((unit) => unit.id !== id)
        );
        setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== id));
        message.success("Đơn vị đã được xóa thành công.");
      } catch (error) {
        console.error("Xóa đơn vị thất bại:", error.message);
        message.error("Đã xảy ra lỗi khi xóa đơn vị.");
      }
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "Ký hiệu",
      dataIndex: "unit",
      key: "unit",
      render: (text) => <a>{text}</a>, // Hiển thị tên đơn vị với liên kết
    },
    {
      title: "Tên đơn vị",
      dataIndex: "donationPlace",
      key: "donationPlace",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div>
          <Link to={ROUTE_PATH.BLOOD_DONATION_UNITS_EDIT(record.id)}>
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ color: "#1890ff", marginRight: 10 }}
            >
              Chỉnh sửa
            </Button>
          </Link>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa đơn vị này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: "red" }}
            >
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-units">
      <h2 className="title">Tất cả các đơn vị hiến máu</h2>

      <div className="filter-container">
        <Input
          id="search"
          value={searchKeyword}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo tên đơn vị"
          className="filter-input"
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredUnits.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        rowKey="id"
        pagination={false} // Tắt phân trang của bảng
        bordered
      />

      <div className="pagination-container">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredUnits.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "30"]}
          showTotal={(total) => `Tổng cộng ${total} đơn vị`}
        />
      </div>
    </div>
  );
};

export default BloodDonationUnitList;
