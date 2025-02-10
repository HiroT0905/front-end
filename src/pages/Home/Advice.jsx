import React from "react";

const Advice = () => {
  return (
    <div className="standard-container w-full h-auto bg-[var(--blue-dark)] flex justify-center items-center text-black">
      <div className="carousel-content w-[1024px] h-full grid grid-cols-2 gap-[20px] py-[30px]">
        <div className="w-full flex flex-col justify-between">
          <h1 className="text-[40px] text-[var(--yellow)] font-bold">
            Những lời khuyên trước và sau khi hiến máu
          </h1>
          <div className="bg-white p-[25px] rounded-[8px]">
            <div className="flex justify-start items-center gap-[10px]">
              <img
                alt=""
                src="/assets/img/advice2.png"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[24px] text-[var(--green)] font-bold">
                Nên:
              </h1>
            </div>
            <ul className="mt-[16px]">
              <li className="mb-2">
                - Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu.
              </li>
              <li className="mb-2">
                - Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng
                keo cá nhân trong 4-6 giờ.
              </li>
              <li className="mb-2">
                - Nằm và ngồi nghỉ tại chỗ 10 phút sau khi hiến máu.
              </li>
              <li className="mb-2">
                - Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn
                nôn.
              </li>
              <li className="mb-2">
                - Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm
                vết chích nếu bị sưng, bầm tím.
              </li>
              <li>
                <div className="flex flex-col justify-end items-end pt-3">
                  <p className="font-bold text-sm">
                    Bác sĩ Ngô Văn Tân
                  </p>
                  <p className="max-w-[16.25rem] w-full text-sm text-end">
                    Trưởng khoa Khoa Tiếp nhận hiến máu. Bệnh viện Truyền máu
                    Huyết học
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col gap-[20px]">
          <div className="bg-white p-[25px] rounded-[8px]">
            <div className="flex justify-start items-center gap-[10px]">
              <img
                alt=""
                src="/assets/img/advice1.png"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[24px] text-[var(--red)] font-bold">
                Không nên:
              </h1>
            </div>
            <ul className="mt-[16px]">
              <li className="mb-2">- Uống sữa, rượu bia trước khi hiến máu.</li>
              <li className="mb-2">
                - Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao
                gắng sức trong ngày lấy máu.
              </li>
              <li>
                <div className="flex flex-col justify-end items-end pt-3">
                  <p className="font-bold text-[14px]">
                    Bác sĩ Ngô Văn Tân
                  </p>
                  <p className="max-w-[16.25rem] w-full text-sm text-end">
                    Trưởng khoa Khoa Tiếp nhận hiến máu. Bệnh viện Truyền máu
                    Huyết học
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-[25px] rounded-[8px]">
            <div className="flex justify-start items-center gap-[10px]">
              <img
                alt=""
                src="/assets/img/advice3.png"
                className="w-[60px] h-[60px]"
              />
              <h1 className="text-[24px] text-[var(--orange)] font-bold">
                Lưu ý:
              </h1>
            </div>
            <ul className="mt-[16px]">
              <li className="mb-[10px]">
                - Nếu phát hiện chảy máu tại chỗ chích:
              </li>
              <li>Giơ tay cao.</li>
              <li>Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính.</li>
              <li>Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết.</li>
              <li />
              <div className="flex flex-col justify-end items-end pt-3">
                <p className="font-bold text-[14px]">
                  Bác sĩ Ngô Văn Tân
                </p>
                <p className="max-w-[16.25rem] w-full text-sm text-end">
                  Trưởng khoa Khoa Tiếp nhận hiến máu. Bệnh viện Truyền máu
                  Huyết học
                </p>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;
