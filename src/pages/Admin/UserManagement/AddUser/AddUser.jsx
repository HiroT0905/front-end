import { Button, Flex, Form, Input, Select } from "antd";
import React from "react";

const AddUser = () => {
  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Add user</h1>
      </Flex>

      <Form className="mt-6" layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="cccd"
          label="CCCD"
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Input placeholder="Enter CCCD" />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="roles"
          label="Roles"
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Select
            placeholder="Select role"
            mode="multiple"
            options={[
              {
                label: "Admin",
                value: 1,
              },
              {
                label: "User",
                value: 2,
              },

            ]}
          />
        </Form.Item>

        

        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AddUser;
