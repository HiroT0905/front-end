import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import { Form, Select, Button, message, Spin, Card, Typography, Divider, Row, Col } from "antd";
import { CalendarOutlined, UserOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const statusColor = {
  PENDING: "orange",
  CONFIRMED: "blue",
  CANCELED: "red",
  COMPLETED: "green",
};

const EditAppointmentForm = () => {
  const { id } = useParams();
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
        setStatus(response.appointmentDTO?.status || "");
        setLoading(false);
      } catch (error) {
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
      await UserService.updateAppointmentStatus(token, id, status);
      messageApi.success("Trạng thái cuộc hẹn đã được cập nhật thành công!");
      navigate("/admin/appointments");
    } catch (error) {
      messageApi.error("Không thể cập nhật trạng thái cuộc hẹn.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin tip="Đang tải thông tin cuộc hẹn..." />;
  }

  return (
    <Row justify="center" style={{ marginTop: 32 }}>
      {contextHolder}
      <Col xs={24} sm={20} md={16} lg={12}>
        <Card
          title={
            <span>
              <CalendarOutlined style={{ color: "#1677ff", marginRight: 8 }} />
              <span>Chỉnh sửa trạng thái cuộc hẹn</span>
            </span>
          }
          bordered
          style={{ boxShadow: "0 2px 8px #f0f1f2" }}
        >
          {appointment ? (
            <>
              <Divider orientation="left">
                <InfoCircleOutlined /> Thông tin cuộc hẹn
              </Divider>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <Text strong>Mã cuộc hẹn:</Text> <Text>{appointment.id}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Người đặt:</Text>{" "}
                  <Text>
                    <UserOutlined /> {appointment.userId || "Không rõ"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày hẹn:</Text>{" "}
                  <Text>
                    {appointment.appointmentDateTime
                      ? new Date(appointment.appointmentDateTime).toLocaleString("vi-VN")
                      : "Chưa có"}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số lượng máu:</Text>{" "}
                  <Text>{appointment.bloodAmount ? `${appointment.bloodAmount} ml` : "Chưa có"}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Trạng thái hiện tại:</Text>{" "}
                  <Text type="secondary" style={{ color: statusColor[appointment.status] }}>
                    {appointment.status}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text strong>Sự kiện:</Text>{" "}
                  <Text>{appointment.eventId || "Không rõ"}</Text>
                </Col>
              </Row>
              <Divider />
              <Form layout="vertical" onFinish={handleUpdate}>
                <Form.Item
                  label="Cập nhật trạng thái"
                  name="status"
                  initialValue={status}
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                  <Select value={status} onChange={handleStatusChange} placeholder="Chọn trạng thái">
                    <Option value="PENDING">Đang chờ</Option>
                    <Option value="CONFIRMED">Đã xác nhận</Option>
                    <Option value="CANCELED">Đã hủy</Option>
                    <Option value="COMPLETED">Hoàn thành</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Cập nhật trạng thái
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <Text type="danger">Không tìm thấy thông tin cuộc hẹn.</Text>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default EditAppointmentForm;