import React, { useEffect, useState } from "react";
import { message } from "antd";
import UserService from '../../service/userService';

function Profile() {
  const [profileInfo, setProfileInfo] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.user);
      setForm({
        address: response.user?.userInfoDTO?.address || "",
        phone: response.user?.phone || "",
        email: response.user?.email || "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Có lỗi xảy ra khi kết nối với máy chủ."
      );
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const cccd = profileInfo.username; // username là số CMND/CCCD
        // userData là object chỉ chứa các trường cần cập nhật, ví dụ:
        const userData = {
            address: form.address,
            phone: form.phone,
            email: form.email,
            
        };
        await UserService.updateOwnUserProfile(token, cccd, userData);
        message.success("Cập nhật thông tin thành công!");
        setEditMode(false);
        fetchProfileInfo();
    } catch (error) {
        message.error("Cập nhật thất bại!");
    }
};

  return (
    <div className="bg-zinc-100 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Thông tin đăng ký hiến máu
        </h2>
        {error ? (
          <div className="text-red-600 text-center mb-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Thông tin cá nhân
              </h3>
              <div className="space-y-2">
                <ProfileRow label="Số CCCD" value={profileInfo?.username} />
                <ProfileRow label="Họ và tên" value={profileInfo?.fullName} />
                <>
                    <ProfileRow label="Họ và tên" value={profileInfo?.userInfoDTO?.fullName} />
                    <ProfileRow label="Ngày sinh" value={profileInfo?.userInfoDTO?.dob} />
                    <ProfileRow label="Giới tính" value={profileInfo?.userInfoDTO?.sex} />
                  </>
              </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                Thông tin liên hệ
              </h3>
              <div className="space-y-2">
                {editMode ? (
                  <>
                   <EditRow
                    label="Địa chỉ liên lạc"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                   <EditRow
                    label="Điện thoại di động"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                   <EditRow
                    label="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                  </>
                 
                ) : (
                  <>
                    <ProfileRow label="Địa chỉ liên lạc" value={profileInfo?.userInfoDTO?.address} />
                   <ProfileRow label="Điện thoại di động" value={profileInfo?.phone} />
                <ProfileRow label="Email" value={profileInfo?.email} />
                  </>
                
               )}
               
              </div>
            </div>
          </div>
        )}
        {!error && (
          <div className="mt-6 flex justify-end">
            {editMode ? (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  onClick={handleUpdate}
                >
                  Lưu
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setEditMode(false)}
                >
                  Hủy
                </button>
              </>
            ) : (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => setEditMode(true)}
              >
                Chỉnh sửa
              </button>
            )}
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

function EditRow({ label, name, value, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium">{label}:</span>
      <input
        className="border rounded px-2 py-1 ml-2 flex-1"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Profile;