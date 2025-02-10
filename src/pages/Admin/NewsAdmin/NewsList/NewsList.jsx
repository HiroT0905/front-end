import React, { useMemo, useState, useEffect } from "react";
import { Table, Input, Popconfirm, Flex } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService"; // Đảm bảo bạn import đúng service để gọi API

const NewsList = () => {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Gọi API để lấy danh sách tin tức khi component được render
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = "your-jwt-token-here"; // Cập nhật với token thực tế
        const data = await UserService.getAllNews(token);
        setNewsData(data.newsDTOList || []);
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
        setNewsData([]);
      }
    };

    fetchNews();
  }, []);

  // Xử lý tìm kiếm
  const filteredData = useMemo(() => {
    return newsData.filter(item => {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [newsData, searchQuery]);

  // Các cột hiển thị trong bảng
  const columns = useMemo(() => {
    return [
      {
        title: "Tiêu đề",
        key: "title",
        dataIndex: "title",
      },
      {
        title: "Nội dung",
        key: "content",
        dataIndex: "content",
      },
      {
        title: "Hành động",
        key: "actions",
        render: (text, record) => {
          return (
            <Flex gap="12px">
              <Link
                className="text-blue-500"
                to={ROUTE_PATH.NEWS_ADMIN_EDIT(record.id)}
              >
                Chỉnh sửa
              </Link>

              <Popconfirm
                title="Xóa tin tức này?"
                description="Bạn có chắc chắn muốn xóa tin tức này không?"
                onConfirm={() => handleDelete(record.id)} // Gọi hàm xóa
              >
                <p className="text-red-500 cursor-pointer">Xóa</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, [newsData]);

  // Hàm xử lý xóa tin tức
  const handleDelete = async (id) => {
    try {
      const token = "your-jwt-token-here"; // Cập nhật với token thực tế
      const response = await UserService.deleteNews(id, token);

      if (response?.code === 200) {
        // Xóa thành công, cập nhật lại danh sách tin tức
        setNewsData(newsData.filter(news => news.id !== id));
        alert("Xóa thành công!!!");
      } else {
        console.error("Xóa tin tức thất bại:", response?.message);
      }
    } catch (error) {
      console.error("Lỗi khi xóa tin tức:", error);
    }
  };

  // Hàm xử lý phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <>
      <Flex align="center" justify="space-between" className="mb-4">
        <h1 className="font-semibold text-xl">Danh sách tin tức</h1>

        <Input
          placeholder="Tìm kiếm..."
          className="w-64"
          suffix={<SearchOutlined />}
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Flex>

      <Table
        columns={columns}
        className="mt-4"
        dataSource={filteredData}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default NewsList;
