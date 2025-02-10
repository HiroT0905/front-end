import { Button, Form, Input, message, Select } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HealthCheckAdd = () => {
  const navigate = useNavigate();
  const [bmi, setBmi] = useState(""); // State để lưu giá trị BMI
  const [healthMetrics, setHealthMetrics] = useState(""); // State để lưu giá trị Health Metrics

  const onValuesChange = (changedValues, allValues) => {
    const { weight, height, heartRate, bloodPressure, temperature } = allValues;

    // Tính BMI nếu có giá trị weight và height
    if (weight && height) {
      const calculatedBmi = (weight / (height * height)).toFixed(2);
      setBmi(calculatedBmi); // Cập nhật giá trị BMI
    }

    // Tạo chuỗi Health Metrics nếu đủ dữ liệu
    if (heartRate && bloodPressure && temperature && weight && height) {
      const metrics = `${heartRate} / ${bloodPressure} / ${temperature} / ${height} / ${weight}`;
      setHealthMetrics(metrics);
    }
  };

  const onSubmit = (values) => {
    console.log({ ...values, bmi, healthMetrics }); // Đảm bảo BMI và Health Metrics được gửi kèm
    message.success("Health check added successfully!");
    setTimeout(() => {
      navigate("/admin/health-check");
    }, 1000);
  };

  return (
    <>
      <h1 className="font-semibold text-xl">Sửa lịch sử kiểm tra sức khỏe</h1>

      <Form
        className="mt-6"
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={onValuesChange} // Lắng nghe thay đổi giá trị Form
      >
        <Form.Item
          name="heartRate"
          label="Nhịp tim"
          rules={[
            { required: true, message: "Không được để trống" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve();
                }
                if (value >= 40 && value <= 100) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Nhip tim phải nằm trong khoảng từ 40 đến 100")
                );
              },
            },
          ]}
        >
          <Input
            type="number"
            placeholder="Nhập nhịp tim"
            min={40} // Ngăn người dùng nhập giá trị nhỏ hơn 40 trực tiếp từ trường nhập
            max={100} // Ngăn người dùng nhập giá trị lớn hơn 100 trực tiếp từ trường nhập
          />
        </Form.Item>

        <Form.Item
          name="bloodPressure"
          label="Huyết áp"
          rules={[
            { required: true, message: "Không được để trống" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve(); // Không kiểm tra nếu giá trị trống (sẽ được xử lý bởi `required` ở trên)
                }
                if (value >= 80 && value <= 120) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Huyết áp phải nằm trong khoảng từ 80 đến 120")
                );
              },
            },
          ]}
        >
          <Input placeholder="Nhập huyết áp" />
        </Form.Item>

        <Form.Item
          name="temperature"
          label="Nhiệt độ"
          rules={[
            { required: true, message: "Không được để trống" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve(); // Không kiểm tra nếu giá trị trống (sẽ được xử lý bởi `required` ở trên)
                }
                if (value >= 36 && value <= 37.5) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Nhiêt độ phải nằm trong khoảng từ 36 đến 37.5")
                );
              },
            },
          ]}
        >
          <Input placeholder="Nhập nhiệt độ" />
        </Form.Item>

        <Form.Item
          name="height"
          label="Chiều cao (m)"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input type="text" placeholder="Nhập chiều cao (m)" />
        </Form.Item>

        <Form.Item
          name="weight"
          label="Cân nặng (kg)"
          rules={[
            { required: true, message: "Không được để trống" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve(); // Không kiểm tra nếu giá trị trống (sẽ được xử lý bởi `required` ở trên)
                }
                if (value >= 45 && value <= 100) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Cân nặng phải lớn hơn hoặc bằng 45 và nhỏ hơn hoặc bằng 100")
                );
              },
            },
          ]}
        >
          <Input type="text" placeholder="Nhập cân nặng (kg)" />
        </Form.Item>

        <Form.Item label="Số liệu sức khỏe">
          <Input
            value={healthMetrics}
            readOnly
            placeholder="Số liệu sức khỏe sẽ được tính tự động"
          />
        </Form.Item>

        <Form.Item label="BMI">
          <Input
            value={bmi}
            readOnly
            placeholder="BMI sẽ được tính tự động"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Ghi chú"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Kết quả"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Select
            placeholder="Chọn kết quả"
            options={[
              {
                label: "Đạt",
                value: 1,
              },
              {
                label: "Không đạt",
                value: 2,
              },
            ]}
          />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default HealthCheckAdd;
