import React from 'react';
import { Link } from 'react-router-dom';

function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <img
        src="/assets/img/empty-appointment.png" // Đảm bảo đường dẫn này chính xác
        alt="Không có lịch hẹn"
        className="mx-auto w-48 h-48 mb-6 opacity-80"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có lịch hẹn nào</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Có vẻ như bạn chưa đăng ký tham gia sự kiện hiến máu nào. Hãy cùng chung tay cứu người!
      </p>
      <Link
        to="/events"
        className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Khám phá các sự kiện
      </Link>
    </div>
  );
}

export default EmptyState;