import React, { useEffect, useState } from 'react';
import UserService from '../../service/userService'; // Giả sử bạn có UserService để lấy dữ liệu từ API

function HistoryAppoint() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        // Giả sử UserService có hàm lấy lịch sử đặt hẹn
        const response = await UserService.getAppointmentByUser(token, username);

        // Lấy thông tin sự kiện cho mỗi cuộc hẹn
        const appointmentsWithEvent = await Promise.all(response.map(async (appointment) => {
          if (appointment.eventId) {
            const eventResponse = await UserService.getEventById(appointment.eventId);
            console.log("hihi",appointment.status);
            // Thêm thông tin sự kiện vào appointment
            return { ...appointment, event: eventResponse.eventDTO }; // Truy cập eventDTO thay vì toàn bộ đối tượng
          }
          return appointment;
        }));

        setAppointments(appointmentsWithEvent);
      } catch (error) {
        console.error("Error fetching appointment history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const statusMap = {
    PENDING: {
      text: "Đang chờ",
      color: "bg-yellow-500",  // Example color for "Pending"
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "bg-blue-500",  // Example color for "Confirmed"
    },
    CANCELED: {
      text: "Đã xoá",
      color: "bg-red-500",  // Example color for "Canceled"
    },
    COMPLETED: {
      text: "Hoàn thành",
      color: "bg-green-500",  // Example color for "Completed"
    },
  };
  

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-blue-800">Lịch sử đặt hẹn</h2>
      <div className="mt-4 space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-start p-4 bg-zinc-100 rounded-lg shadow-sm">
            <img
              src="/assets/img/blood.png"
              alt="blood drop icon"
              className="w-14 h-14 mr-4"
            />
            <div className="flex-1">
              <h3 className="text-blue-800 font-semibold">
                {appointment.event ? appointment.event.name : "Thông tin sự kiện không có"}
              </h3>
              <p className="text-zinc-600">
                <span className="inline-block mr-2">
                  <img
                    src="/assets/img/local222.png"
                    alt="location icon"
                    className="inline w-4 h-4 mr-1"
                  />
                  {appointment.event ? appointment.event.donationUnitDTO.location : "Không có địa điểm"}
                </span>
                <br />
                <span className="inline-block">
                  <img
                    src="/assets/img/alarm.png"
                    alt="clock icon"
                    className="inline w-4 h-4 mr-1"
                  />
                  {appointment.event ? `${appointment.event.eventStartTime} - ${appointment.event.eventDate}` : "Không có thời gian"}
                </span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <button
                className={`${statusMap[appointment.status]?.color} text-white px-3 py-1 rounded-full mb-2`}
              >
                {statusMap[appointment.status]?.text}
              </button>
              <a href={`/appointment/${appointment.id}`} className="text-blue-600">
                Xem chi tiết
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryAppoint;
