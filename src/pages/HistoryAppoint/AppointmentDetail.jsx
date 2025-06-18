import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../../service/userService';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await UserService.getAppointmentById(id, token);
        const eventId = response.appointmentDTO.eventId;
        
        const eventResponse = await UserService.getEventById(eventId, token);
        setAppointment({
          ...response.appointmentDTO,
          event: eventResponse.eventDTO
        });
      } catch (error) {
        console.error("Error fetching appointment detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetail();
  }, [id]);

  const statusMap = {
    PENDING: {
      text: "Đang chờ",
      color: "bg-yellow-500",
      icon: "⏳",
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "bg-blue-500",
      icon: "✓",
    },
    CANCELED: {
      text: "Đã hủy",
      color: "bg-red-500",
      icon: "✗",
    },
    COMPLETED: {
      text: "Hoàn thành",
      color: "bg-green-500",
      icon: "✓",
    },
  };

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    return timeString.slice(0, 5);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Chưa có thông tin";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", { 
      weekday: 'long',
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <p className="text-lg text-gray-700 mb-4">Không tìm thấy thông tin đặt hẹn</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className={`${statusMap[appointment.status]?.color} p-4 text-white`}>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Chi tiết lịch hẹn hiến máu</h1>
              <span className="text-lg font-medium">
                {statusMap[appointment.status]?.icon} {statusMap[appointment.status]?.text}
              </span>
            </div>
            <p className="text-sm opacity-90 mt-1">Mã đăng ký: {appointment.id}</p>
          </div>

          <div className="p-6">
            {/* Thông tin sự kiện */}
            {appointment.event && (
              <div className="mb-8">
                <div className="flex items-start mb-6">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <img
                      src="/assets/img/blood.png"
                      alt="blood drop icon"
                      className="w-10 h-10"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{appointment.event.title}</h2>
                    <p className="text-gray-600">{appointment.event.description || "Không có mô tả"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <img
                          src="/assets/img/local222.png"
                          alt="location icon"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Địa điểm</h3>
                        <p className="font-medium">{appointment.event.donationUnitDTO?.location || "Không có thông tin"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <img
                          src="/assets/img/calendar-icon.png"
                          alt="date icon"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Ngày hiến máu</h3>
                        <p className="font-medium">{formatDate(appointment.event.donateDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <img
                          src="/assets/img/alarm.png"
                          alt="time icon"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Thời gian</h3>
                        <p className="font-medium">
                          {formatTime(appointment.event.eventStartTime)} - {formatTime(appointment.event.eventEndTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <img
                          src="/assets/img/organization-icon.png"
                          alt="organization icon"
                          className="w-4 h-4"
                        />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Đơn vị tổ chức</h3>
                        <p className="font-medium">{appointment.event.donationUnitDTO?.unit || "Không có thông tin"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin đăng ký */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin đăng ký</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Ngày đăng ký</h3>
                  <p className="font-medium">{formatDate(appointment.appointmentDateTime)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Trạng thái</h3>
                  <p className="font-medium">
                    <span className={`${statusMap[appointment.status]?.color} text-white px-2 py-1 rounded-full text-xs`}>
                      {statusMap[appointment.status]?.text}
                    </span>
                  </p>
                </div>

                {appointment.note && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="text-xs font-medium text-gray-500 mb-1">Ghi chú</h3>
                    <p className="font-medium">{appointment.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              
              <button
                onClick={() => alert("Tính năng in phiếu đăng ký đang phát triển")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                In phiếu đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;