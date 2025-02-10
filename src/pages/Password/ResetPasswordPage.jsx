import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import UserService from "../../service/userService";  // Service gửi yêu cầu API

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();  // Khai báo hook useNavigate
  const [loading, setLoading] = useState(false);

  // Lấy giá trị token từ URL
  const token = new URLSearchParams(location.search).get("token");

  // Hàm xử lý khi form được submit
  const onSubmit = async (values) => {
    const { newPassword } = values;  // Lấy mật khẩu mới từ form
    setLoading(true);

    try {
      // Gọi API reset password và truyền token cùng mật khẩu mới
      const res = await UserService.resetPassword(token, newPassword);

      message.success("Password has been reset successfully.");
      alert("Thay đổi mật khẩu thành công!!!");
      console.log(res);
        // Chuyển hướng đến trang đăng nhập
      navigate("/login");  // Điều hướng tới trang login
      
    } catch (error) {
      message.error("An error occurred while resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onSubmit} className="max-w-2xl my-6 mx-auto p-4">
      <Form.Item
        label="New Password"
        name="newPassword"
        rules={[{ required: true, message: "Please enter your new password" }]}
      >
        <Input.Password placeholder="Enter your new password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Reset Password
      </Button>
    </Form>
  );
};

export default ResetPassword;
