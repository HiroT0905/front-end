import React, { useEffect, useState, useCallback } from 'react';
import UserService from '../../service/userService';

import AppointmentCard from './AppointmentCard';
import AppointmentSkeleton from './AppointmentSkeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

// --- Constants ---
const TOKEN_KEY = "token";
const USERNAME_KEY = "username";

function HistoryAppoint() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const username = localStorage.getItem(USERNAME_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token || !username) {
        throw new Error("Thông tin xác thực không tồn tại.");
      }

      const response = await UserService.getAppointmentByUser(token, username);

      const appointmentsWithEvent = await Promise.all(
        response.map(async (appointment) => {
          if (appointment.eventId) {
            try {
              const eventResponse = await UserService.getEventById(appointment.eventId);
              return {
                ...appointment,
                event: eventResponse.eventDTO,
              };
            } catch (eventError) {
              console.error(`Error fetching event ${appointment.eventId}:`, eventError);
              // Vẫn trả về lịch hẹn dù không có thông tin sự kiện
              return { ...appointment, event: null };
            }
          }
          return appointment;
        })
      );

      setAppointments(appointmentsWithEvent);
    } catch (err) {
      console.error("Error fetching appointment history:", err);
      setError("Không thể tải lịch sử đặt hẹn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAppointmentStatusChange = (appointmentId, newStatus) => {
      setAppointments(currentAppointments =>
        currentAppointments.map(app =>
          app.id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    };

  const renderContent = () => {
    if (loading) {
      // Hiển thị 3 skeleton card để tạo cảm giác đang tải
      return Array.from({ length: 3 }).map((_, index) => (
        <AppointmentSkeleton key={index} />
      ));
    }

    if (error) {
      return <ErrorState message={error} onRetry={fetchAppointments} />;
    }

    if (appointments.length === 0) {
      return <EmptyState />;
    }

    return appointments.map((appointment) => (
      <AppointmentCard key={appointment.id} appointment={appointment}   onStatusUpdate={handleAppointmentStatusChange} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử Đặt hẹn</h1>
          {!loading && !error && appointments.length > 0 && (
            <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              {appointments.length} lịch hẹn
            </div>
          )}
        </header>

        <main className="space-y-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default HistoryAppoint;