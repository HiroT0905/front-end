import { Button, Flex, Form, Input, Select, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";

const NewsEdit = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

    // Hàm để xử lý giá trị file từ input upload
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
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
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

export default NewsEdit;
