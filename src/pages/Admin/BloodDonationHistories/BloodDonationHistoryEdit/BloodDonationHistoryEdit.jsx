import { Button, Flex, Form, Input, Select, DatePicker, Spin, message } from "antd";
import React from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../../../service/userService";

const bloodTypes = [
  { label: "A+", value: "A+" },
    { label: "A-", value: "A-" },
    { label: "B+", value: "B+" },
    { label: "B-", value: "B-" },
    { label: "AB+", value: "AB+" },
    { label: "AB-", value: "AB-" },
    { label: "O+", value: "O+" },
    { label: "O-", value: "O-" },
];

const quantities = [
  { label: "250ml", value: 250 },
  { label: "350ml", value: 350 },
  { label: "450ml", value: 450 },
];

const BloodDonationHistoryEdit = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await userService.getBloodInventory(token , id);
        const data = response.bloodInventoryDTO;
        console.log(data);
       form.setFieldsValue({
            donationType: data.donationType, // Select
            quantity: data.quantity, // Input number
            lastUpdated: data.lastUpdated ? dayjs(data.lastUpdated) : null, // DatePicker
            expirationDate: data.expirationDate ? dayjs(data.expirationDate) : null, // DatePicker
            appointmentId: data.appointmentDTO?.id, // Input number
          });
      } catch (err) {
        message.error("Không thể tải dữ liệu tồn kho máu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = {
        id: Number(id),
        donationType: values.donationType,
        quantity: Number(values.quantity),
        expirationDate: values.expirationDate ? values.expirationDate.toISOString() : null,
        appointmentDTO: {
          id: values.appointmentId,
        },
      };
      const response = await userService.updateBloodInventory(token, id, data);
     
      console.log(response);
      if (response.code === 200) {
          message.success("Cập nhật thành công!");
          navigate("/admin/blood-donation-history");
      }
  
    } catch (err) {
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <Flex align="center" justify="space-between">
        <h1 className="font-semibold text-xl">Chỉnh sửa tồn kho máu</h1>
      </Flex>

      <Form
        className="mt-6"
        layout="vertical"
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          name="donationType"
          label="Loại máu"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Select placeholder="Chọn  hiến máu" options={bloodTypes} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng (ml)"
          rules={[
            { required: true, message: "Trường này là bắt buộc" }
          ]}
        >
          <Select placeholder="Chọn số lượng máu" options={quantities} />
  

        </Form.Item>

        <Form.Item
          name="lastUpdated"
          label="Cập nhật lần cuối"        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            placeholder="Chọn thời gian cập nhật"
            format="YYYY-MM-DD"
            disabled
          />
        </Form.Item>

        <Form.Item
          name="expirationDate"
          label="Ngày hết hạn máu"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            placeholder="Chọn ngày hết hạn"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="appointmentId"
          label="Mã lịch hẹn (Appointment ID)"
          rules={[{ required: true, message: "Trường này là bắt buộc" }]}
        >
          <Input type="number" placeholder="Nhập mã lịch hẹn" />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Lưu
        </Button>
      </Form>
    </>
  );
};

export default BloodDonationHistoryEdit;