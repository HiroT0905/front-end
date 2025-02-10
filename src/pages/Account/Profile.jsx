import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from '../../service/userService';
import Cookies from 'js-cookie'; // Thư viện Cookies
// import Cookies from "../../Cookies"
function Profile() {
  const [profileInfo, setProfileInfo] = useState({});
  const [error, setError] = useState(null); // Quản lý lỗi

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {

      const token = localStorage.getItem('token'); // Lấy token
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      const response = await UserService.getYourProfile(token);
      console.log("Response từ API:", response); // Kiểm tra dữ liệu trả về

      const { user } = response; // Phân tích dữ liệu
      // const user = Cookies.get('user');
      setProfileInfo(response.user);
    } catch (error) {
      console.error('Error fetching profile information:', error);
      setError(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi kết nối với máy chủ."
      );
    }
  };

  return (
    <div className="bg-zinc-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Thông tin đăng ký hiến máu
        </h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error ? (
          <div className="text-red-600 text-center mb-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Thông tin cá nhân
              </h3>
              <div className="space-y-2">
              <ProfileRow label="Số CMND" value={profileInfo?.username} />

                <ProfileRow label="Họ và tên" value={profileInfo?.userInfoDTO?.fullName} />
                <ProfileRow label="Ngày sinh" value={profileInfo?.userInfoDTO?.dob} />
                <ProfileRow label="Giới tính" value={profileInfo?.userInfoDTO?.sex} />
              </div>
            </div>

            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Thông tin liên hệ
              </h3>
              <div className="space-y-2">
                <ProfileRow label="Địa chỉ liên lạc" value={profileInfo?.userInfoDTO?.address} />
                <ProfileRow label="Điện thoại di động" value={profileInfo?.phone}/>
                <ProfileRow label="Email" value={profileInfo?.email} /> 
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value || "Chưa cập nhật"}</span>
    </div>
  );
}

export default Profile;
