import React from 'react';

function Certificate() {
  return (
    <div
      className="relative flex items-center justify-center h-screen bg-blue-400"
    >
      <img
        src="/assets/img/chungNhan.png"
        alt="Background Image"
        className="absolute inset-0 w-full h-full object-cover opacity-50 w-full"
      />
      <div className="relative z-10 text-center p-4">
        <p
          className="text-white text-lg md:text-xl lg:text-2xl mb-4 max-w-[650px] text-center mt-[100px]"
        >
          Thêm giấy chứng nhận hiến máu của bạn tại đây. Nếu bạn chưa từng đặt
          lịch hiến trên hệ thống, hãy nhớ cập nhật thông tin cá nhân trước khi
          thực hiện thao tác này để quản trị có thể đối chiếu thông tin.
        </p>
        <a href="#">
          <button
            className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-zinc-100 transition"
          >
            Thêm chứng nhận
          </button>
        </a>
      </div>
    </div>
  );
};

export default Certificate;