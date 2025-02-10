import React, { useState } from "react";
import UserService from "../../service/userService";
import { Card, Form, Radio, Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./HealthCheckForm.css"; // Tạo CSS riêng để tùy chỉnh giao diện

const HealthCheckForm = () => {
  const [formData, setFormData] = useState({
    hasDonatedBefore: null,
    hasChronicDiseases: null,
    hasRecentDiseases: null,
    hasSymptoms: null,
    isPregnantOrNursing: null,
    HIVTestAgreement: null,
    notes: "",
  });

  const eventId = localStorage.getItem("eventId");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveAppointment = async () => {
    if (!username || !eventId) {
      messageApi.error("Thiếu thông tin người dùng hoặc sự kiện để đặt lịch.");
      return;
    }

    setLoading(true);
    try {
      const response = await UserService.saveAppointment(token, username, eventId, formData);

      if (response.code === 200) {
        messageApi.success("Lịch hẹn của bạn đã được lưu thành công!");
        navigate("/appointments");
      } else {
        messageApi.warning(response.message || "Không thể lưu lịch hẹn.");
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch hẹn:", error.message);
      messageApi.error("Không thể lưu lịch hẹn của bạn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const fieldLabels = {
    hasDonatedBefore: "Bạn đã từng hiến máu trước đây chưa?",
    hasChronicDiseases: "Bạn có mắc các bệnh mãn tính không?",
    hasRecentDiseases: "Bạn có mắc các bệnh gần đây không?",
    hasSymptoms: "Bạn có triệu chứng nào không?",
    isPregnantOrNursing: "Bạn đang mang thai hoặc cho con bú?",
    HIVTestAgreement: "Bạn đồng ý làm xét nghiệm HIV không?",
    notes: "Ghi chú bổ sung",
  };

  return (
    <div className="health-check-container">
      {contextHolder}
      <Card title="Khảo sát sức khỏe" className="health-check-card my-4">
        <Spin spinning={loading}>
          <Form layout="vertical" onFinish={handleSaveAppointment}>
            <Form.Item>
              <p>Vui lòng hoàn thành khảo sát sức khỏe trước khi tiếp tục:</p>
            </Form.Item>
            {Object.keys(formData).map((key) =>
              key !== "notes" ? (
                <Form.Item label={fieldLabels[key]} key={key}>
                  <Radio.Group
                    onChange={(e) => handleChange(key, e.target.value)}
                    value={formData[key]}
                  >
                    <Radio value={true}>Có</Radio>
                    <Radio value={false}>Không</Radio>
                  </Radio.Group>
                </Form.Item>
              ) : (
                <Form.Item label={fieldLabels[key]} key={key}>
                  <Input.TextArea
                    name={key}
                    value={formData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={4}
                    placeholder="Nhập ghi chú bổ sung tại đây..."
                  />
                </Form.Item>
              )
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Gửi khảo sát
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default HealthCheckForm;
