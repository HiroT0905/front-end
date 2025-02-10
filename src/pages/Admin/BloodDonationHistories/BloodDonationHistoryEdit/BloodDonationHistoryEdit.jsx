import { Button, Flex, Form, Input, Select } from "antd";
import React from "react";

const BloodDonationHistoryEdit = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Chỉnh sửa lịch sử hiến máu</h1>
      </Flex>

      <Form className="mt-6" layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="type"
          label="Loại hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Select
            placeholder="Chọn loại hiến máu"
            options={[
              {
                label: "Loại 1",
                value: 1,
              },
              {
                label: "Loại 2",
                value: 2,
              },
              {
                label: "Loại 3",
                value: 3,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="receivingFacility"
          label="Cơ sở nhận máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập cơ sở nhận máu" />
        </Form.Item>

        <Form.Item
          name="donationUnitAddress"
          label="Địa chỉ đơn vị hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ đơn vị" />
        </Form.Item>

        <Form.Item
          name="donor"
          label="Người hiến máu"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập tên người hiến máu" />
        </Form.Item>

        <Form.Item
          name="event"
          label="Sự kiện"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Input placeholder="Nhập tên sự kiện" />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[
            {
              required: true,
              message: "Trường này là bắt buộc",
            },
          ]}
        >
          <Select
            placeholder="Chọn trạng thái"
            options={[
              {
                label: "Trạng thái 1",
                value: 1,
              },
              {
                label: "Trạng thái 2",
                value: 2,
              },
              {
                label: "Trạng thái 3",
                value: 3,
              },
            ]}
          />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Lưu
        </Button>
      </Form>
    </>
  );
};

export default BloodDonationHistoryEdit;
