import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  notification,
  Row,
  Col,
  Steps,
  Card,
  Typography,
  Divider,
  InputNumber
} from "antd";
import { useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import moment from "moment";

const { Step } = Steps;
const { Title } = Typography;

const EventBloodDonationAdd = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const navigate = useNavigate();

  // Form data state
  const [eventData, setEventData] = useState({
    title: "",
    donatePlace: "",
    donateAddress: "",
    donateDate: null,
    eventStartTime: null,
    eventEndTime: null,
    maxRegistrations: 0,
    status: "ACTIVE",
    unit: null,
    bloodQuotaDTO: {
      minIBloodBag: 0,
      maxIBloodBag: 0,
      goalIBloodBag: 0,
      additionalIBloodBag: 0
    }
  });

  useEffect(() => {
    const fetchUnits = async () => {
      setUnitsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await UserService.getAllUnits(token);
        setUnits(response.donationUnitList || []);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải danh sách đơn vị hiến máu"
        });
      } finally {
        setUnitsLoading(false);
      }
    };
    fetchUnits();
  }, []);

  const handleEventInfoSubmit = async () => {
    try {
      const values = await form.validateFields();
      setEventData(prev => ({
        ...prev,
        ...values,
        donateDate: values.donateDate,
        eventStartTime: values.eventStartTime,
        eventEndTime: values.eventEndTime
      }));
      setCurrentStep(1);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin"
      });
    }
  };

  const handleBloodQuotaSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Format data before sending
      const requestData = {
        ...eventData,
        donateDate: eventData.donateDate ? moment(eventData.donateDate).format("YYYY-MM-DD") : null,
        eventStartTime: eventData.eventStartTime ? moment(eventData.eventStartTime).format("HH:mm:ss") : null,
        eventEndTime: eventData.eventEndTime ? moment(eventData.eventEndTime).format("HH:mm:ss") : null,
        bloodQuotaDTO: eventData.bloodQuotaDTO
      };

      const response = await UserService.addEvent(requestData, token);
      
      if (response) {
        notification.success({
          message: "Thành công",
          description: "Tạo sự kiện hiến máu thành công!"
        });
        navigate("/admin/event-blood-donation");
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Không thể tạo sự kiện"
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Thông tin sự kiện',
      content: (
        <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
          <Form
            form={form}
            layout="vertical"
            initialValues={eventData}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Tên sự kiện"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
                >
                  <Input placeholder="Nhập tên sự kiện" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="donatePlace"
                  label="Địa điểm tổ chức"
                  rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
                >
                  <Input placeholder="Ví dụ: Hội trường A" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="donateAddress"
                  label="Địa chỉ chi tiết"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                  <Input placeholder="Ví dụ: 123 Đường ABC" />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  name="unit"
                  label="Đơn vị tổ chức"
                  rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}
                >
                  <Select
                    loading={unitsLoading}
                    placeholder="Chọn đơn vị hiến máu"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {units.map(unit => (
                      <Select.Option key={unit.id} value={unit.id}>
                        {unit.name} - {unit.location}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="donateDate"
                  label="Ngày diễn ra"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="eventStartTime"
                  label="Thời gian bắt đầu"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                >
                  <TimePicker 
                    style={{ width: '100%' }}
                    format="HH:mm"
                    placeholder="Bắt đầu"
                  />
                </Form.Item>
              </Col>
              
              <Col span={8}>
                <Form.Item
                  name="eventEndTime"
                  label="Thời gian kết thúc"
                  rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                >
                  <TimePicker 
                    style={{ width: '100%' }}
                    format="HH:mm"
                    placeholder="Kết thúc"
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="maxRegistrations"
                  label="Số lượng đăng ký tối đa"
                  rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                  <InputNumber 
                    min={1}
                    style={{ width: '100%' }}
                    placeholder="Nhập số lượng"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      title: 'Chỉ tiêu máu',
      content: (
        <Card title="Chỉ tiêu hiến máu" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số túi máu tối thiểu">
                <InputNumber
                  min={0}
                  value={eventData.bloodQuotaDTO.minIBloodBag}
                  onChange={value => setEventData(prev => ({
                    ...prev,
                    bloodQuotaDTO: {
                      ...prev.bloodQuotaDTO,
                      minIBloodBag: value || 0
                    }
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item label="Số túi máu tối đa">
                <InputNumber
                  min={eventData.bloodQuotaDTO.minIBloodBag}
                  value={eventData.bloodQuotaDTO.maxIBloodBag}
                  onChange={value => setEventData(prev => ({
                    ...prev,
                    bloodQuotaDTO: {
                      ...prev.bloodQuotaDTO,
                      maxIBloodBag: value || 0
                    }
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item label="Chỉ tiêu mục tiêu">
                <InputNumber
                  min={eventData.bloodQuotaDTO.minIBloodBag}
                  max={eventData.bloodQuotaDTO.maxIBloodBag}
                  value={eventData.bloodQuotaDTO.goalIBloodBag}
                  onChange={value => setEventData(prev => ({
                    ...prev,
                    bloodQuotaDTO: {
                      ...prev.bloodQuotaDTO,
                      goalIBloodBag: value || 0
                    }
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item label="Số túi dự phòng">
                <InputNumber
                  min={0}
                  value={eventData.bloodQuotaDTO.additionalIBloodBag}
                  onChange={value => setEventData(prev => ({
                    ...prev,
                    bloodQuotaDTO: {
                      ...prev.bloodQuotaDTO,
                      additionalIBloodBag: value || 0
                    }
                  }))}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Thêm sự kiện hiến máu mới
      </Title>
      
      <Steps current={currentStep} style={{ marginBottom: 32 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        {steps[currentStep].content}
      </div>

      <Divider />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        {currentStep > 0 && (
          <Button 
            style={{ marginRight: 16, width: 120 }}
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={loading}
          >
            Quay lại
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button 
            type="primary" 
            style={{ width: 120 }}
            onClick={handleEventInfoSubmit}
            loading={loading}
          >
            Tiếp theo
          </Button>
        ) : (
          <Button 
            type="primary" 
            style={{ width: 120 }}
            onClick={handleBloodQuotaSubmit}
            loading={loading}
          >
            Hoàn thành
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventBloodDonationAdd;