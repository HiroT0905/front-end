import React, { useState } from 'react';

function Settings() {
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(false);

  const handleToggleSms = () => {
    setSms(!sms);
  };

  const handleToggleEmail = () => {
    setEmail(!email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-semibold text-zinc-800">
          THIẾT LẬP CÁ NHÂN
        </h2>
        <div className="mt-4 p-4 bg-zinc-50 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-blue-600">
              QUẢN LÝ THÔNG BÁO
            </h3>
          </div>
          {/* Nút bật tắt SMS */}
          <div className="flex items-center mb-2">
            <label
              htmlFor="sms"
              className="toggle-label flex items-center cursor-pointer"
              onClick={handleToggleSms}
            >
              <div
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${
                  sms ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    sms ? 'translate-x-5' : ''
                  }`}
                ></div>
              </div>
            </label>
            <span className="ml-3">Nhận thông báo qua tin nhắn (SMS)</span>
          </div>

          {/* Nút bật tắt Email */}
          <div className="flex items-center">
            <label
              htmlFor="email"
              className="toggle-label flex items-center cursor-pointer"
              onClick={handleToggleEmail}
            >
              <div
                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${
                  email ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    email ? 'translate-x-5' : ''
                  }`}
                ></div>
              </div>
            </label>
            <span className="ml-3">Nhận thông báo qua Email</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
