import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import UserService from "../../service/userService";  // Service gửi yêu cầu API

const ResetPasswordRequest = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    const { email } = values;
    try {
      await UserService.requestPasswordReset(email);
      message.success("Password reset email has been sent.");
      alert("Gửi email thành công!!. Vui lòng kiểm tra email của bạn.")
    } catch (error) {
      message.error("Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onSubmit} className="max-w-2xl my-6 mx-auto p-4">
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Send Reset Link
      </Button>
    </Form>
  );
};

export default ResetPasswordRequest;
