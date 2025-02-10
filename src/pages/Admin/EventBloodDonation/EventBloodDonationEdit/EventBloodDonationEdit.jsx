import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select, TimePicker, message, Row, Col, Typography } from "antd";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../../../service/userService";

const { Title } = Typography;

const EventBloodDonationEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Lấy thông tin sự kiện
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await UserService.getEventById(id);
        const eventData = response.eventDTO;
        form.setFieldsValue({
          name: eventData.name,
          location: eventData.donationUnitDTO?.location || "",
          eventDate: moment(eventData.eventDate, "YYYY-MM-DD"),
          startTime: moment(eventData.eventStartTime, "HH:mm:ss"),
          endTime: moment(eventData.eventEndTime, "HH:mm:ss"),
          maxRegistrations: eventData.maxRegistrations,
          status: eventData.status,
        });

  
      } catch (error) {
        console.error("Error fetching event data:", error.message);
        messageApi.error("Failed to fetch event data.");
      }
    };

    fetchEventData();
  }, [id, form, messageApi]);

  // Xử lý submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        eventDate: values.eventDate.format("YYYY-MM-DD"),
        eventStartTime: values.startTime.format("HH:mm:ss"),
        eventEndTime: values.endTime.format("HH:mm:ss"),
      };

      await UserService.updateEvent(id, formattedValues);
      console.log("Du lieu: ", formattedValues);
      messageApi.success("Event updated successfully!");
      navigate("/admin/event-blood-donation");
    } catch (error) {
      console.error("Error updating event:", error.message);
      messageApi.error("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="p-5 bg-[#f5f5f5] min-h-screen">
        <Row justify="center">
          <Col span={12}>
            <Title level={2} className="text-center mb-5">
              Sửa thông tin sự kiện hiến máu
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="bg-white p-5 rounded-lg shadow-lg"
            >
              <Form.Item
                name="name"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input placeholder="Nhập tên sự kiện" />
              </Form.Item>

              <Form.Item
                name="location"
                label="Địa chỉ"
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input placeholder="Nhập thông tin địa chỉ" />
              </Form.Item>

              <Form.Item
                name="eventDate"
                label="Ngày diễn ra"
                rules={[{ required: true, message: "Vui lòng chọn ngày sự kiện" }]}
              >
                <DatePicker placeholder="Chọn ngày" format="YYYY-MM-DD"  className="w-full"/>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startTime"
                    label="Thời gian bắt đầu"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
                  >
                    <TimePicker placeholder="Chọn thời gian bắt đầu" format="HH:mm" className="w-full"/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="endTime"
                    label="Thời gian kết thúc"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc" }]}
                  >
                    <TimePicker placeholder="Chọn thời gian kết thúc" format="HH:mm" className="w-full"/>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maxRegistrations"
                label="Giới hạn đăng ký"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <Input type="number" placeholder="Nhập giới hạn đăng ký" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="ACTIVE">Active</Select.Option>
                  <Select.Option value="DONE">Done</Select.Option>
                  <Select.Option value="FULL">Full</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EventBloodDonationEdit;
