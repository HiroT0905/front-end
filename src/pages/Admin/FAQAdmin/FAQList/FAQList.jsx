import { Flex, Input, Popconfirm, Table, notification } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../../../constants/routes";
import UserService from "../../../../service/userService";

const FAQList = () => {
  // Quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [faqs, setFaqs] = useState([]);

  // Lấy dữ liệu danh sách FAQ từ API
  useEffect(() => {
    const fetchFaqs = async () => {
      const token = localStorage.getItem("token"); // Sửa lại cách lấy token
      try {
        const response = await UserService.getAllFaq(token); // Sửa hàm API
        console.log("response", response.faqDTOList);
         setFaqs(Array.isArray(response.faqDTOList) ? response.faqDTOList : []); // Giả sử API trả về { data: [...faqList] }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách FAQ:", error.message);
      }
    };

    fetchFaqs();  
  }, []);

  // Cột cho bảng
  const columns = useMemo(() => {
    return [
      {
        title: "Tiêu đề",
        key: "title",
        dataIndex: "title",
      },
      {
        title: "Mô tả",
        key: "description",
        dataIndex: "description",
        ellipsis: true,
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => {
          return (
            <Flex gap="12px">
              <Link className="text-blue-500" to={ROUTE_PATH.FAQ_ADMIN_EDIT(record.id)}>
                Chỉnh sửa
              </Link>

              <Popconfirm
                title="Xóa câu hỏi này?"
                description="Bạn có chắc chắn muốn xóa câu hỏi này không?"
                onConfirm={() => handleDelete(record.id)} // Thêm hàm xóa
              >
                <p className="text-red-500 cursor-pointer">Xóa</p>
              </Popconfirm>
            </Flex>
          );
        },
      },
    ];
  }, []);

  // Hàm xử lý phân trang
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Hàm xử lý xóa FAQ
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await UserService.deleteFaq(token, id); // Hàm xóa trong UserService
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== id)); // Cập nhật lại danh sách FAQ sau khi xóa
      notification.success({
        message: "Thành công",
        description: "FAQ đã được xóa.",
      });
    } catch (error) {
      console.error("Lỗi khi xóa FAQ:", error.message);
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa FAQ.",
      });
    }
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Danh sách FAQ</h1>

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
        dataSource={faqs} // Cập nhật dữ liệu từ state faqs
        rowKey="id"
        // Phân trang
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: faqs.length, // Tổng số bản ghi
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trong tổng số ${total} mục`,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default FAQList;
