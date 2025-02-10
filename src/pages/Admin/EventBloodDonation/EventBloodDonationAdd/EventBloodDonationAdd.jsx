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
} from "antd";
import { useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";

const EventBloodDonationAdd = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [eventData, setEventData] = useState({
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    maxRegistrations: "",
    unitId: "",
    status: "ACTIVE",
  });
  const [units, setUnits] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await UserService.getAllUnits(token);
        const allUnits = response.donationUnitList;
        setUnits(allUnits);
        setFilteredUnits(allUnits);
      } catch (error) {
        console.error("Error fetching units:", error.message);
      }
    };

    fetchUnits();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/events/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      console.log("response", response
      );
      const data = await response.json();
      if (response.status ===200) {
        notification.success({
          message: "Success",
          description: "Event added successfully!",
        });
        navigate("/admin/event-blood-donation");
      } else {
        setError(data.message);
        notification.error({
          message: "Error",
          description: data.message || "Failed to add event.",
        });
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event.");
      notification.error({
        message: "Error",
        description: "An error occurred while adding the event.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Add Event for Blood Donation
      </h1>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="eventDate"
              label="Event Date"
              initialValue={eventData.eventDate}
              rules={[{ required: true, message: "Please select event date" }]}
            >
              <DatePicker
                name="eventDate"
                value={eventData.eventDate}
                onChange={(date, dateString) =>
                  setEventData({ ...eventData, eventDate: dateString })
                }
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="eventStartTime"
              label="Start Time"
              initialValue={eventData.eventStartTime}
              rules={[{ required: true, message: "Please select start time" }]}
            >
              <TimePicker
                name="eventStartTime"
                value={eventData.eventStartTime}
                onChange={(time, timeString) =>
                  setEventData({ ...eventData, eventStartTime: timeString })
                }
                format="HH:mm"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="eventEndTime"
              label="End Time"
              initialValue={eventData.eventEndTime}
              rules={[{ required: true, message: "Please select end time" }]}
            >
              <TimePicker
                name="eventEndTime"
                value={eventData.eventEndTime}
                onChange={(time, timeString) =>
                  setEventData({ ...eventData, eventEndTime: timeString })
                }
                format="HH:mm"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxRegistrations"
              label="Max Registrations"
              initialValue={eventData.maxRegistrations}
              rules={[
                { required: true, message: "Please enter max registrations" },
              ]}
            >
              <Input
                type="number"
                name="maxRegistrations"
                value={eventData.maxRegistrations}
                onChange={handleInputChange}
                placeholder="Max Registrations"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="unitId"
          label="Select Donation Unit"
          initialValue={eventData.unitId}
          rules={[{ required: true, message: "Please select a unit" }]}
        >
          <Select
            name="unitId"
            value={eventData.unitId}
            onChange={(value) => setEventData({ ...eventData, unitId: value })}
            placeholder="Select Donation Unit"
          >
            {units.map((unit) => (
              <Select.Option key={unit.id} value={unit.id}>
                {unit.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              background: "#1890ff",
              borderColor: "#1890ff",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {loading ? "Adding..." : "Add Event"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EventBloodDonationAdd;
