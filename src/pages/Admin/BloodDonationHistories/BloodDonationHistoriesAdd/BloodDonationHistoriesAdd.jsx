import { Button, Form, Input, Select, DatePicker, InputNumber, message, Alert, Card, Spin, Typography } from "antd";
import React, { useState, useEffect } from "react";
import UserService from "../../../../service/userService";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from "moment";
const { Title, Text } = Typography;

const AddBloodInventoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [noAppointments, setNoAppointments] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await UserService.getAllAppointments(token);
        
        if (response && Array.isArray(response.appointmentDTOList)) {
          const completedAppointments = response.appointmentDTOList.filter(
            appointment => appointment.status === "CONFIRMED"
          );

          setAppointments(completedAppointments);
          setNoAppointments(completedAppointments.length === 0);
        } else {
          setNoAppointments(true);
          message.warning("Dữ liệu lịch hẹn không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch hẹn:", error);
        message.error("Không thể tải danh sách lịch hẹn");
        setNoAppointments(true);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        donationType: values.donationType,
        quantity: parseInt(values.quantity),
        lastUpdated: new Date().toISOString(),
        expirationDate: values.expirationDate.toISOString(),
      };

      await UserService.addBloodInventory(token, payload, values.appointmentId);
      message.success("Thêm túi máu thành công!");
      navigate('/admin/blood-donation-history');
    } catch (error) {
      console.error("Lỗi khi thêm túi máu:", error);
      message.error(`Thêm túi máu thất bại: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const bloodTypeOptions = [
    { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
  ];

  const quantityOptions = [
    { label: "250ml (1 đơn vị máu)", value: "250" },
    { label: "350ml (1.5 đơn vị máu)", value: "350" },
    { label: "450ml (2 đơn vị máu)", value: "450" },
  ];

  if (loadingAppointments) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin tip="Đang tải danh sách lịch hẹn..." size="large" />
      </div>
    );
  }

  return (
    <Card 
      className="max-w-2xl mx-auto shadow-lg"
      title={<Title level={3} className="text-center">Thêm túi máu mới</Title>}
      bordered={false}
    >
      {noAppointments ? (
        <Alert
          message="Thông báo"
          description={
            <div>
              <p>Không có lịch hẹn nào đã hoàn thành.</p>
              <p>Vui lòng kiểm tra lại các lịch hẹn và cập nhật trạng thái trước khi thêm túi máu.</p>
            </div>
          }
          type="warning"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-6"
        />
      ) : (
        <Alert
          message="Hướng dẫn"
          description="Vui lòng điền đầy đủ thông tin túi máu từ lịch hẹn đã hoàn thành"
          type="info"
          showIcon
          className="mb-6"
        />
      )}

      <Form
        layout="vertical"
        onFinish={onSubmit}
        disabled={noAppointments}
        className="px-4"
      >
        <Form.Item
          name="donationType"
          label={<Text strong>Nhóm máu</Text>}
          rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
          tooltip="Chọn nhóm máu và Rh của túi máu"
        >
          <Select
            placeholder="Chọn nhóm máu"
            options={bloodTypeOptions}
            showSearch
            optionFilterProp="label"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label={<Text strong>Thể tích</Text>}
          rules={[{ required: true, message: "Vui lòng chọn thể tích túi máu" }]}
          tooltip="Chọn thể tích túi máu tiêu chuẩn"
        >
          <Select
            placeholder="Chọn thể tích"
            options={quantityOptions}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="expirationDate"
          label={<Text strong>Ngày hết hạn</Text>}
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
          tooltip="Ngày hết hạn sử dụng của túi máu"
        >
          <DatePicker 
            placeholder="Chọn ngày hết hạn" 
            format="DD/MM/YYYY" 
            style={{ width: "100%" }} 
            size="large"
            disabledDate={(current) => {
              return current && current < moment().startOf('day');
            }}
          />
        </Form.Item>

        <Form.Item
          name="appointmentId"
          label={<Text strong>Lịch hẹn hiến máu</Text>}
          rules={[{ required: true, message: "Vui lòng chọn lịch hẹn" }]}
          tooltip="Chọn lịch hẹn đã hoàn thành để thêm túi máu"
        >
          <Select
            loading={loadingAppointments}
            placeholder="Chọn lịch hẹn"
            options={appointments.map(appointment => ({
              label: `ID: ${appointment.id} - Người hiến: ${appointment.userName || appointment.userId}`,
              value: appointment.id,
            }))}
            size="large"
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            disabled={noAppointments}
            className="h-12 font-medium"
          >
            {loading ? 'Đang xử lý...' : 'Thêm túi máu'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddBloodInventoryForm;