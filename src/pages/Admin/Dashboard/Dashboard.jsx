import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Empty, Typography } from "antd";
import { Chart } from "react-chartjs-2";
import axiosInstance from "../../../axiosConfig";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

const { Title: AntTitle, Text } = Typography;

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const [genderData, setGenderData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [eventStats, setEventStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [gRes, iRes, uRes, eRes] = await Promise.all([
          axiosInstance.get("/api/statistics/gender-distribution"),
          axiosInstance.get("/api/statistics/blood-inventory"),
          axiosInstance.get("/api/statistics/donations-by-user"),
          axiosInstance.get("/api/statistics/event-performance"),
        ]);

        setGenderData({
          labels: gRes.data.map((d) => d.sex),
          datasets: [
            {
              data: gRes.data.map((d) => d.total),
              backgroundColor: ["#6366F1", "#EC4899", "#10B981"],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        });

        setInventoryData({
          labels: iRes.data.map((d) => d.bloodType),
          datasets: [
            {
              label: "Túi máu",
              data: iRes.data.map((d) => d.quantity),
              backgroundColor: "#3B82F6",
              borderRadius: 6,
              barThickness: 30,
            },
          ],
        });

        setUserStats({
          labels: uRes.data.map((d) => d.fullName),
          datasets: [
            {
              label: "Lượt hiến",
              data: uRes.data.map((d) => d.totalDonations),
              backgroundColor: "#8B5CF6",
              borderRadius: 6,
            },
          ],
        });

        setEventStats({
          labels: eRes.data.map((d) => d.title),
          datasets: [
            {
              label: "Chỉ tiêu",
              data: eRes.data.map((d) => d.goalBloodBag),
              backgroundColor: "#F59E0B",
              borderRadius: 6,
            },
            {
              label: "Thực tế",
              data: eRes.data.map((d) => d.actualDonations),
              backgroundColor: "#06B6D4",
              borderRadius: 6,
            },
          ],
        });

      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Card className="text-center">
          <Empty
            description={
              <>
                <AntTitle level={4} className="mb-2">
                  {error}
                </AntTitle>
                <Text type="secondary">
                  Vui lòng kiểm tra kết nối mạng và thử lại
                </Text>
              </>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
      <AntTitle level={3} className="mb-6 text-gray-800">
        Thống kê hệ thống hiến máu
      </AntTitle>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Giới tính người hiến máu"
            className="shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: "1px solid #E5E7EB" }}
            bodyStyle={{ padding: "16px" }}
          >
            <div className="h-[300px]">
              {genderData ? (
                <Chart type="pie" data={genderData} options={chartOptions} />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Tình trạng kho máu"
            className="shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: "1px solid #E5E7EB" }}
            bodyStyle={{ padding: "16px" }}
          >
            <div className="h-[300px]">
              {inventoryData ? (
                <Chart type="bar" data={inventoryData} options={chartOptions} />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Lượt hiến máu theo người dùng"
            className="shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: "1px solid #E5E7EB" }}
            bodyStyle={{ padding: "16px" }}
          >
            <div className="h-[350px]">
              {userStats ? (
                <Chart
                  type="bar"
                  data={userStats}
                  options={{
                    ...chartOptions,
                    indexAxis: "y",
                  }}
                />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </div>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title="Hiệu quả các sự kiện hiến máu"
            className="shadow-sm hover:shadow-md transition-shadow"
            headStyle={{ borderBottom: "1px solid #E5E7EB" }}
            bodyStyle={{ padding: "16px" }}
          >
            <div className="h-[350px]">
              {eventStats ? (
                <Chart type="bar" data={eventStats} options={chartOptions} />
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;