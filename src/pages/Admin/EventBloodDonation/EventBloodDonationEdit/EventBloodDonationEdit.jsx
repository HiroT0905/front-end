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
  const [donationUnits, setDonationUnits] = useState([]);

  // Lấy danh sách đơn vị hiến máu
  useEffect(() => {
    const fetchDonationUnits = async () => {
      try {
        const units = await UserService.getAllUnits();
        setDonationUnits(units.donationUnitList || []);
      } catch (error) {
        console.error("Error fetching donation units:", error);
      }
    };

    fetchDonationUnits();
  }, []);

  // Lấy thông tin sự kiện
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await UserService.getEventById(id);
        const eventData = response.eventDTO;
        
        form.setFieldsValue({
          title: eventData.title,
          location: eventData.donationUnitDTO?.location,
          donateDate: moment(eventData.donateDate, "YYYY-MM-DD"),
          eventStartTime: moment(eventData.eventStartTime, "HH:mm:ss"),
          eventEndTime: moment(eventData.eventEndTime, "HH:mm:ss"),
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
        title: values.title,
        location: values.location,
        donateDate: values.donateDate.format("YYYY-MM-DD"),
        eventStartTime: values.eventStartTime.format("HH:mm:ss"),
        eventEndTime: values.eventEndTime.format("HH:mm:ss"),
        maxRegistrations: values.maxRegistrations,
        status: values.status,
      };

      await UserService.updateEvent(id, formattedValues);
      messageApi.success("Cập nhật sự kiện thành công!");
      navigate("/admin/event-blood-donation");
    } catch (error) {
      console.error("Error updating event:", error.message);
      messageApi.error("Cập nhật sự kiện thất bại!");
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
                name="title"
                label="Tên sự kiện"
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input placeholder="Nhập tên sự kiện" />
              </Form.Item>

              <Form.Item
                name="location"
                label="Đơn vị hiến máu"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị hiến máu" }]}
              >
                <Select placeholder="Chọn đơn vị hiến máu">
                  {donationUnits.map(unit => (
                    <Select.Option key={unit.id} value={unit.id}>
                      {unit.name} - {unit.location}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="donateDate"
                label="Ngày diễn ra"
                rules={[{ required: true, message: "Vui lòng chọn ngày sự kiện" }]}
              >
                <DatePicker placeholder="Chọn ngày" format="YYYY-MM-DD" className="w-full"/>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="eventStartTime"
                    label="Thời gian bắt đầu"
                    rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
                  >
                    <TimePicker placeholder="Chọn thời gian bắt đầu" format="HH:mm" className="w-full"/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="eventEndTime"
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
                rules={[{ required: true, message: "Không được để trống" }]}
              >
                <Input type="number" placeholder="Nhập giới hạn đăng ký" />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                  <Select.Option value="DONE">Đã hoàn thành</Select.Option>
                  <Select.Option value="FULL">Đã đầy</Select.Option>
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