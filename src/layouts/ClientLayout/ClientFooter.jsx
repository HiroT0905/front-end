import React from "react";
import { Link } from "react-router-dom";

const ClientFooter = () => {
  return (
    <>
      {/* Footer top */}
      <div className="standard-container w-full h-auto bg-[var(--footer)] flex justify-center items-center text-black">
        <div className="carousel-content w-[1024px] h-full grid grid-cols-3 gap-[20px] py-[40px]">
          <div className="w-full flex flex-col justify-between">
            <div className="logo mb-[30px]">
              <img
                className="w-[199px] h-[61px]"
                alt=""
                src="/assets/img/logo.png"
              />
            </div>
            <div className="content text-white !flex flex-col gap-[12px]">
              <h1 className="w-[80px] text-[22px] font-medium border-b-[3px] pb-[3px]">
                LIÊN HỆ
              </h1>
              <h2 className="text-[16px] font-bold">Khu AB</h2>
              <p className="text-[14px]">
                <i className="fa-solid fa-location-dot mr-2" />
                475A Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh, Việt
                Nam
              </p>
            </div>
            <div className="content text-white !flex flex-col gap-[12px] mt-[60px]">
              <h2 className="text-[16px] font-bold">Khu E</h2>
              <p className="text-[14px]">
                <i className="fa-solid fa-location-dot mr-2" />
                10/80c Song Hành Xa Lộ Hà Nội, Phường Tân Phú, Quận 9, Hồ Chí
                Minh, Việt Nam
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col justify-between">
            <div className="logo" />
            <div className="content text-white !flex flex-col gap-[12px] mt-[62px]">
              <h2 className="text-[16px]">
                <i className="fa-solid fa-phone" /> Liên hệ giờ hành chính
              </h2>
              <Link href="" className="text-[18px] font-bold underline">
                {" "}
                0706389781{" "}
              </Link>
            </div>
            <div className="content text-white !flex flex-col gap-[12px] mb-[20px]">
              <h2 className="text-[16px]">
                <i className="fa-solid fa-phone" /> Liên hệ giờ hành chính
              </h2>
              <Link href="" className="text-[18px] font-bold underline">
                {" "}
                0961323076{" "}
              </Link>
            </div>
          </div>
          <div className="w-full flex flex-col justify-between">
            <div className="content text-white !flex flex-col gap-[12px] mt-[91px]">
              <h1 className="w-[90px] text-[22px] font-medium border-b-[3px] pb-[3px]">
                HỖ TRỢ
              </h1>
              <h2 className="text-[16px] font-bold">Điều khoản sử dụng</h2>
            </div>
            <div className="content text-white !flex flex-col gap-[12px] mt-[60px] relative w-full">
              <img
                src="/assets/img/bg.png"
                alt=""
                className="w-[410px] h-[173px]"
              />
              <div className="absolute h-full top-0 left-0 py-[30px] px-[45px] flex flex-col justify-between">
                <p className="text-[18px] font-[600]">
                  Ứng dụng “Giọt máu vàng” đã có mặt trên:
                </p>
                <div className="flex justify-between items-center">
                  <img
                    src="/assets/img/app-store.svg"
                    alt=""
                    className="w-[110px]"
                  />
                  <img
                    src="/assets/img/gg-play.svg"
                    alt=""
                    className="w-[110px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="bg-white text-gray-500 p-4 mt-8">
        <div className="container mx-auto flex flex-wrap justify-center items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <img src="/assets/img/logo-hutech.png" alt="Logo 1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientFooter;