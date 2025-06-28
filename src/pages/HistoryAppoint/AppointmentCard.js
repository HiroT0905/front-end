import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, CalendarDaysIcon, ClockIcon, BuildingOfficeIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Sử dụng icon từ thư viện
import UserService from '../../service/userService';
// --- Helper Functions & Constants ---
const statusMap = {
  PENDING: { text: "Đang chờ", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  CANCELED: { text: "Đã hủy", color: "bg-red-100 text-red-800" },
  COMPLETED: { text: "Hoàn thành", color: "bg-green-100 text-green-800" },
};

const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : "--:--";
const formatDate = (isoString) => {
  if (!isoString) return "Chưa có ngày";
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
};

const InfoRow = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <span className="text-sm text-gray-700">{text || "Chưa có thông tin"}</span>
  </div>
);

function AppointmentCard({ appointment, onStatusUpdate }) {
  const [isCanceling, setIsCanceling] = useState(false);
  const statusInfo = statusMap[appointment.status] || { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' };
  const event = appointment.event;
const handleCancelAppointment = async () => {
    // Hỏi xác nhận từ người dùng
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không? Hành động này không thể hoàn tác.");

    if (!isConfirmed) {
      return;
    }

    setIsCanceling(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực.");
      }

      // Gọi API để cập nhật trạng thái
      await UserService.updateAppointmentStatus(token, appointment.id, 'CANCELED');
      
      // Gọi hàm callback từ component cha để cập nhật UI
      onStatusUpdate(appointment.id, 'CANCELED');

      alert("Hủy lịch hẹn thành công!");

    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Đã có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.");
    } finally {
      setIsCanceling(false);
    }
  };

    const canCancel = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          {/* Header */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900">
                {event?.title || "Sự kiện hiến máu"}
              </h3>
              <span className={`${statusInfo.color} px-3 py-1 rounded-full text-xs font-semibold`}>
                {statusInfo.text}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Mã lịch hẹn: #{appointment.id}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-100 pt-4">
          <InfoRow icon={MapPinIcon} text={event?.donationUnitDTO?.location} />
          <InfoRow icon={CalendarDaysIcon} text={formatDate(event?.donateDate)} />
          <InfoRow icon={ClockIcon} text={`${formatTime(event?.eventStartTime)} - ${formatTime(event?.eventEndTime)}`} />
          <InfoRow icon={BuildingOfficeIcon} text={event?.donationUnitDTO?.unit} />
        </div>
        
        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end items-center space-x-3">
          {/* Hiển thị nút Hủy nếu điều kiện cho phép */}
          {canCancel && (
            <button
              onClick={handleCancelAppointment}
              disabled={isCanceling}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              {isCanceling ? 'Đang hủy...' : 'Hủy lịch hẹn'}
            </button>
          )}

          <Link
            to={`/historyappoint/${appointment.id}`}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-300"
          >
            Xem chi tiết
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;