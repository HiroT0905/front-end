import React from "react";

const Activities = () => {
  return (
    <>
      <div className="activities-title w-full h-[188px] relative mt-8">
        <img
          alt=""
          src="/assets/img/activities.png"
          className="w-full h-[188px] object-cover"
        />
        <div className="absolute w-[400px] top-1/2 left-1/2 transform-translate -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="text-[40px] text-white font-bold">
            Các hoạt động <br />
            hiến máu nhân đạo
          </h1>
        </div>
      </div>
      <div className="carousel-container w-full h-[380px] bg-white flex justify-center items-center pt-[10px]">
        <div className="slice-container-act carousel-content w-[1024px] h-full py-[10px] relative overflow-hidden">
          {/* Slicde act 1 */}
          <div className="slice-act w-full h-[360px]">
            <div className="grid grid-cols-4 gap-[20px]">
              <div className="w-full h-full bg-[var(--blue-dark)] p-[15px] rounded-[8px]">
                <p className="text-[24px] font-bold text-white">
                  Tình người hiến máu giữa đại dịch
                </p>
                <p className="text-[14px] text-white">
                  <i className="fa-regular fa-calendar-days mr-1" />
                  04/08/2021
                </p>
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac1.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac2.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac3.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac4.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac5.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac6.jpeg"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac7.jpeg"
                  className="w-[238px] h-[160px]"
                />
              </div>
            </div>
          </div>
          {/* Slide act 2 */}
          <div className="slice-act w-full h-[360px]">
            <div className="grid grid-cols-4 gap-[20px]">
              <div className="w-full h-full bg-[var(--blue-dark)] p-[15px] rounded-[8px]">
                <p className="text-[24px] font-bold text-white">
                  Giọt máu sẽ chia - Ân tình mùa dịch
                </p>
                <p className="text-[14px] text-white">
                  <i className="fa-regular fa-calendar-days mr-1" />
                  02/10/2021
                </p>
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac8.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac-9.jpg"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac10.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac11.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac12.png"
                  className="w-[238px] h-[160px]"
                />
              </div>
              <div className="">
                <img
                  alt=""
                  src="/assets/img/ac13.jpg"
                  className="w-[238px] h-[160px]"
                />
              </div>
            </div>
          </div>
          {/* Button previous */}
          <button className="w-[32px] h-[52px] bg-zinc-800/[0.7] rounded-[4px] absolute top-[40%] left-[10px] z-500">
            <i className="fa-solid fa-angle-left act-left text-white" />
          </button>
          {/* Button next */}
          <button className="w-[32px] h-[52px] bg-zinc-800/[0.7] rounded-[4px] absolute top-[40%] right-[10px] z-50">
            <i className="fa-solid fa-angle-right act-right text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Activities;
