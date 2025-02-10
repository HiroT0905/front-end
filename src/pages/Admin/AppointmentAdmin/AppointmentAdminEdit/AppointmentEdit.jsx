import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import { Form, Select, Button, message, Spin } from "antd";

const { Option } = Select;

const EditAppointmentForm = () => {
  const { id } = useParams(); // Lấy ID cuộc hẹn từ URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await UserService.getAppointmentById(id, token);
        setAppointment(response.appointmentDTO);
        setStatus(response.status);
        console.log("sdhsad",response.appointmentDTO);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin cuộc hẹn:", error.message);
        messageApi.error("Không thể lấy thông tin cuộc hẹn.");
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, messageApi]);

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      await UserService.updateAppointmentStatus(token,id,status);
      messageApi.success("Trạng thái cuộc hẹn đã được cập nhật thành công!");
      navigate("/admin/appointments");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái cuộc hẹn:", error.message);
      messageApi.error("Không thể cập nhật trạng thái cuộc hẹn.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Đang tải thông tin cuộc hẹn..." />;
  }

  return (
    <div className="edit-appointment-form">
      {contextHolder}
      <h2>Chỉnh sửa trạng thái cuộc hẹn</h2>
      {appointment ? (
        <Form layout="vertical" onFinish={handleUpdate}>
          <Form.Item label="Trạng thái hiện tại">
            <Select
              value={status}
              onChange={handleStatusChange}
              placeholder="Chọn trạng thái"
            >
              <Option value="PENDING">Đang chờ</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="CANCELED">Đã hủy</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Không tìm thấy thông tin cuộc hẹn.</p>
      )}
    </div>
  );
};

export default EditAppointmentForm;
