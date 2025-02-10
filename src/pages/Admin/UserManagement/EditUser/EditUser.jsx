import { Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../../../service/userService";

const EditUser = () => {
  const { username } = useParams(); // Extract username from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for better UX
  const navigate = useNavigate(); // Hook for navigation
  const [messageApi, contextHolder] = message.useMessage(); // Ant Design message instance

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserService.getUserById(username);
        setUserData(response.user); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        messageApi.error("Failed to fetch user data.");
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchUserData();
  }, [username, messageApi]);

  const onSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const dataToSend = { ...values, username }; // Include username in the payload

      const response = await UserService.updateUser(
        username,
        dataToSend,
        token
      );

      // Show success message
      messageApi.success("User updated successfully!");

      // Redirect to user list page after success
      setTimeout(() => {
        navigate("/admin/user");
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error.message);
      messageApi.error("An error occurred while updating the user.");
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading message until data is fetched
  if (!userData) return <div>No user data found.</div>; // Handle case where userData is null

  const { phone, email, userInfoDTO, role } = userData;
  const { fullName, address } = userInfoDTO;

  return (
    <>
      {contextHolder} {/* Ant Design message context */}
      <div
        className="flex justify-between items-center"
      >
        <h1 className="font-semibold text-xl">Sửa thông tin người dùng</h1>
      </div>
      <Form
        className="mt-6"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          cccd: username, // Use username as CCCD
          fullName: fullName,
          phone: phone,
          email: email,
          address: address,
          roles: [role.name], // Set default role from API data
        }}
      >
        <Form.Item
          name="cccd"
          label="CCCD"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập CCCD" disabled />
        </Form.Item>

        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[
            { required: true, message: "Trường này là bắt buộc" },
            {
              validator: (_, value) => {
                if (!value || value.length <= 35) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Họ tên không được quá 25 ký tự")
                );
              },
            },
          ]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Trường này là bắt buộc" },
            { type: "email", message: "Vui lòng nhập đúng định dạng" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="roles"
          label="Vai trò"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Select
            placeholder="Select role"
            mode="multiple"
            options={[
              { label: "Admin", value: "ADMIN" },
              { label: "User", value: "USER" },
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

export default EditUser;
