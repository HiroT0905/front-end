import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import UserService from "../../service/userService";

const Appointments = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState({});
  const [error, setError] = useState(null); // Quản lý lỗi
  const [appointment  ,setAppointment]= useState({}); 
  
  useEffect(() => {
    const fetchEventData = async () => {
      if (!username) {
        messageApi.error("Username is missing!");
        setLoading(false);
        return;
      }

      try {
        const response = await UserService.getYourProfile(token);
        const appointmentRe = await UserService.getAppointmentPendingUser(token,username);

        setProfileInfo(response.user || []);
        setAppointment(appointmentRe.appointments || []);
        const userAppointments = response.user?.appointments || [];
        
        response.user.appointments = appointmentRe.appointments || [];
        
        const pendingAppointment = userAppointments.find(
          (appointment) => appointment.status === "PENDING"
        );

        console.log("Pending Appointment:", pendingAppointment);

        setAppointment(appointmentRe.appointmentDTO  || null);
        if (pendingAppointment) {
          localStorage.setItem("AppointmentId", pendingAppointment.id);
        }

      
      } catch (error) {
        console.error("Error fetching event data:", error.message);
        messageApi.error("Failed to load event data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [username,token, messageApi]);

  const handleDelete = async () => {
    try {
      const id = appointment?.id;
      const status = "CANCELED";
      if (!id) {
        messageApi.error("Appointment ID is missing!");
        return;
      }

      setLoading(true);

      // Send request to cancel appointment status
      await UserService.updateAppointmentStatus(token, id, status);

      // After successful cancellation, reset appointment state
      setAppointment(null);

      messageApi.success("Appointment canceled successfully!");
    } catch (error) {
      messageApi.error("Failed to cancel the appointment.");
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Spin size="large" />;
  }


  return (
    <div className="bg-zinc-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md my-2 p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Thông tin đăng ký hiến máu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin cá nhân
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Họ và tên:</span>
                <span>{profileInfo?.userInfoDTO?.fullName || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Số CMND:</span>
                <span>{profileInfo.username || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ngày sinh:</span>
                <span>{profileInfo?.userInfoDTO?.dob || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giới tính:</span>
                <span>{profileInfo?.userInfoDTO?.sex || "-"}</span>
              </div>
        
            </div>
          </div>
          <div className="bg-zinc-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Địa chỉ liên lạc:</span>
                <span>{profileInfo?.userInfoDTO?.address || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Điện thoại di động:</span>
                <span>{profileInfo?.phone || "-"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{profileInfo?.email || "-"}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-50 rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            Phiếu đăng ký hiến máu
          </h3>
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src="/assets/img/phieuDangky.png"
              alt="Document Icon"
              className="mb-4 w-[140px]"
            />
            {appointment ? (
                <p className="text-red-700">Bạn đã đăng ký hiến máu</p>  // Khi có appointment
              ) : (
                <p className="text-zinc-500">Chưa có phiếu đăng ký hiến máu</p>  // Khi appointment là null
              )}
          </div>
        </div>
        <div className="flex justify-center mt-6">
        {appointment? (
          //Handle Delete tại đây
              <button
              onClick={handleDelete} // Điều hướng tới trang đăng ký hiến máu
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Xóa đơn đăng ký
            </button>
            ) : (
              <button
              onClick={() => navigate('/events')} // Điều hướng tới trang đăng ký hiến máu
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
             Đăng ký hiến máu
            </button>
            )}
         
        </div>
      </div>
    </div>
  );
};

export default Appointments;
