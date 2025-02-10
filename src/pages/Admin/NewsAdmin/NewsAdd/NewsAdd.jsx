import React from "react";
import { Button, Flex, Form, Input, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Đảm bảo axios đã được cài đặt
import { useNavigate } from "react-router-dom";

const NewsAdd = () => {
    const navigate = useNavigate();
  
  const onSubmit = async (values) => {
    const { title, content, photo } = values;
    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", "ChiTin"); // Giả sử tác giả là "ChiTin", có thể thay đổi theo nhu cầu
    formData.append("image", photo[0]?.originFileObj); // Lấy file ảnh từ field photo

    try {
      const response = await axios.post("http://localhost:8080/news/add", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Tin tức đã được thêm:", response.data);
      alert("Tin tức đã được thêm!!!")
      navigate("/admin/news");

    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
    }
  };

  // Hàm xử lý file
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Thêm tin tức</h1>
      </Flex>

      <Form className="mt-6" layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập tiêu đề" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung bài viết"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input.TextArea placeholder="Nhập nội dung bài viết" />
        </Form.Item>

        <Form.Item
          name="photo"
          label="Tải Lên Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng tải lên ảnh" }]}
        >
          <Upload
            name="photo"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
          </Upload>
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Gửi
        </Button>
      </Form>
    </>
  );
};

export default NewsAdd;
