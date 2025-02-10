import React, { useEffect, useState } from "react";
import Notes from "./Notes";
import Advice from "./Advice";
import Activities from "./Activities";
import UserService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import { DatePicker, Select, Button } from "antd"; 
import { Color } from "antd/es/color-picker";
const Home = () => {
  const [eventData, setEventData] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const { RangePicker } = DatePicker;
  const [filters, setFilters] = useState({
    dateRange: [],
    organization: "Tất cả",
  });
  const handleInputChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleSearch = () => {
    if (filters.dateRange.length > 0) {
      const startDate = filters.dateRange[0].format("YYYY-MM-DD");
      const endDate = filters.dateRange[1].format("YYYY-MM-DD");
  
      // Điều hướng đến trang /events với tham số URL
      navigate(`/events?startDate=${startDate}&endDate=${endDate}`);

    } else {
      alert("Vui lòng chọn khoảng thời gian tìm kiếm!");
    }
  };
  useEffect(() => {
    

    const initSlide = () => {
      const carouselContainer = document.querySelector(".slice-container");
      const slides = carouselContainer?.querySelectorAll(".slice");
      const prevButton = carouselContainer?.querySelector(".fa-angle-left");
      const nextButton = carouselContainer?.querySelector(".fa-angle-right");
      
      let currentIndex = 0;
      const slideCount = slides?.length;

      function showSlide(index, direction) {
        slides?.forEach((slide, i) => {
          if (i === index) {
            slide.classList.add("active");
            slide.classList.remove("previous");
          } else if (direction === "prev" && i === (index + 1) % slideCount) {
            slide.classList.add("previous");
            slide.classList.remove("active");
          } else if (
            direction === "next" &&
            i === (index - 1 + slideCount) % slideCount
          ) {
            slide.classList.add("previous");
            slide.classList.remove("active");
          } else {
            slide.classList.remove("active", "previous");
          }
        });
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        showSlide(currentIndex, "next");
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        showSlide(currentIndex, "prev");
      }

      // Hiển thị slide ban đầu
      showSlide(currentIndex, "");

      // Tính năng tự động thay đổi slide
      setInterval(nextSlide, 3000);

      // Sự kiện cho các nút trước và sau
      prevButton?.addEventListener("click", function () {
        prevSlide();
      });

      nextButton?.addEventListener("click", function () {
        nextSlide();
      });

      const carouselContainer1 = document.querySelector(".slice-container-act");
      const slides1 = carouselContainer1?.querySelectorAll(".slice-act");
      const prevButton1 = carouselContainer1?.querySelector(
        ".fa-angle-left.act-left"
      );
      const nextButton1 = carouselContainer1?.querySelector(
        ".fa-angle-right.act-right"
      );

      let currentIndex1 = 0;
      const slideCount1 = slides1?.length;

      function showSlide1(index, direction) {
        slides1?.forEach((slide, i) => {
          if (i === index) {
            slide.classList.add("active");
            slide.classList.remove("previous");
          } else if (direction === "prev" && i === (index + 1) % slideCount1) {
            slide.classList.add("previous");
            slide.classList.remove("active");
          } else if (
            direction === "next" &&
            i === (index - 1 + slideCount1) % slideCount1
          ) {
            slide.classList.add("previous");
            slide.classList.remove("active");
          } else {
            slide.classList.remove("active", "previous");
          }
        });
      }

      function nextSlide1() {
        currentIndex1 = (currentIndex1 + 1) % slideCount1;
        showSlide1(currentIndex1, "next");
      }

      function prevSlide1() {
        currentIndex1 = (currentIndex1 - 1 + slideCount1) % slideCount1;
        showSlide1(currentIndex1, "prev");
      }

      // Hiển thị slide ban đầu
      showSlide1(currentIndex1, "");

      // Tính năng tự động thay đổi slide
      setInterval(nextSlide1, 3000);

      // Sự kiện cho các nút trước và sau
      prevButton1?.addEventListener("click", function () {
        prevSlide1();
      });

      nextButton1?.addEventListener("click", function () {
        nextSlide1();
      });
    };

    initSlide();
  }, []);
  


  return (
    <>
      <div className="banner-container w-full h-[430px] bg-white flex justify-start items-start relative">
        <img
          alt=""
          className="w-full h-[320px] object-cover"
          src="/assets/img/banner.png"
        />
        <div className="absolute banner-content w-[1024px] h-[180px] top-[104px] left-1/2 transform-translate -translate-x-1/2 -translate-y-1/2 px-[10px]">
          <h1 className="text-[40px] text-white font-bold">Đặt lịch hẹn</h1>
          <h1 className="text-[40px] text-white font-bold">
            Hiến máu cứu người
          </h1>
          <p className="text-[16px] text-white w-[570px]">
            Với mỗi lần hiến máu bạn có thể mang lại cơ hội cứu sống 3 người.
            Hãy cứu lấy mạng người bằng ít máu của mình!
          </p>
        </div>
        <div className="absolute flex justify-between items-center w-[1024px] h-[150px] shadow bg-white top-[305px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px]">
      <div className="w-[85%] flex flex-col p-[25px]">
        <div className="title flex justify-start items-center text-[var(--black)]">
          <i className="fa-solid fa-calendar-days text-[20px] mr-[5px]"></i>
          <h1 className="text-[20px]">Bạn cần đặt lịch vào thời gian nào?</h1>
        </div>
        <div className="date flex items-center gap-[10px]">
          <RangePicker
            className="h-full p-[16px] w-full text-[var(--black)] rounded-[8px] border border-[var(--blue-light)] outline-none"
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
          />
        </div>
      
      </div>
      <button
        type="button"
        className="w-[20%] h-[100%] bg-blue-500 text-white rounded-e-lg flex justify-center items-center hover:bg-blue-600"
        onClick={handleSearch}
      >
        <span className="font-semibold text-2xl">Tìm kiếm</span> 
      </button>
    </div>
    

        <div className="absolute flex justify-between items-center w-[1024px] h-auto bottom-0 left-1/2 transform-translate -translate-x-1/2 -translate-y-1/2 rounded-[10px]">
          <a
            href="https://static.giotmauvang.org.vn/ihpstatic/GMV_HuongDanSuDung.pdf"
            target="_blank"
            className="text-[16px] text-[var(--blue-light)] underline"
            rel="noreferrer"
          >
            Xem hướng dẫn quy trình đăng ký hiến máu &gt;&gt;&gt; Tại đây
          </a>
        </div>
      </div>
      {/* Carousel */}
      <div className="carousel-container w-full h-[490px] bg-white flex justify-center items-center">
        <div className="carousel-content w-[1024px] h-full grid grid-cols-2">
          <div className="w-full h-[450px] relative">
            <img
              alt=""
              className="h-full"
              src="/assets/img/carousel-left.png"
            />
            <div className="absolute top-[12px] left-[69px]">
              <h1 className="text-[40px] text-[var(--blue-dark)] font-bold">
                Quyền lợi của người hiến máu
              </h1>
              <p className="text-[16px] text-[var(--black)]">
                Người hiến máu tình nguyện sẽ được những quyền lợi như sau:
              </p>
            </div>
          </div>
          <div className="slice-container bg-[var(--blue-dark)] w-full h-[450px] bg-[#fdd05e] rounded-tr-[20px] rounded-br-[20px] relative overflow-hidden">
            {/* Slice 1 */}
            <div className="slice w-full h-[450px]">
              <div className="w-full h-[450px] rounded-[20px] text-white px-[68px] py-[20px]">
                <h1 className="text-[20px] text-center mb-[20px]">
                  Được bồi dưỡng trực tiếp
                </h1>
                <ul>
                  <li className="text-[16px] mb-[8px]">
                    - Ăn nhẹ, nước uống tại chỗ: tương đương 30.000 đồng (1 chai
                    trà xanh không độ, 01 hộp chocopie 66gram, 01 hộp bánh Goute
                    35,5gram).
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Hỗ trợ chi phí đi lại (bằng tiền mặt): 50.000 đồng.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Nhận phần quà tặng giá trị tương đương:
                  </li>
                </ul>
              </div>
            </div>
            {/* Slice 2 */}
            <div className="slice w-full h-[450px]">
              <div className="w-full h-[450px] rounded-[20px] text-white px-[68px] py-[20px]">
                <h1 className="text-[20px] text-center mb-[20px]">
                  Được cấp Giấy chứng nhận hiến máu tình nguyện
                </h1>
                <ul>
                  <li className="text-[16px] mb-[8px]">
                    1. Giấy chứng nhận được trao cho người hiến máu sau mỗi lần
                    hiến máu tình nguyện.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    2. Có giá trị để được truyền máu miễn phí bằng số lượng máu
                    đã hiến, khi bản thân người hiến có nhu cầu sử dụng máu tại
                    tất cả các cơ sở y tế công lập trên toàn quốc.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    3. Người hiến máu cần xuất trình Giấy chứng nhận để làm cơ
                    sở cho các cơ sở y tế thực hiện việc truyền máu miễn phí.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    4. Cơ sở y tế có trách nhiệm ký, đóng dấu, xác nhận số lượng
                    máu đã truyền miễn phí cho người hiến máu vào giấy chứng
                    nhận.
                  </li>
                </ul>
              </div>
            </div>
            {/* Slice 3 */}
            <div className="slice w-full h-[450px]">
              <div className="w-full h-[450px] rounded-[20px] text-white px-[68px] py-[20px]">
                <h1 className="text-[20px] text-center mb-[20px]">
                  Được tư vấn về sức khoẻ
                </h1>
                <ul>
                  <li className="text-[16px] mb-[8px]">
                    - Được giải thích về quy trình hiến máu và các tai biến có
                    thể xảy ra trong và sau khi hiến máu.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Được cung cấp thông tin về dấu hiệu, triệu chứng do nhiễm
                    vi rút viêm gan, HIV và một số bệnh lây qua đường truyền
                    máu, tình dục khác.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Được xét nghiệm sàng lọc một số vi rút lây qua đường
                    truyền máu, tình dục (HIV, Giang mai, viêm gan,…) sau khi
                    hiến máu.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Được tư vấn hướng dẫn cách chăm sóc sức khỏe, tư vấn về
                    kết quả bất thường sau hiến máu.
                  </li>
                  <li className="text-[16px] mb-[8px]">
                    - Được bảo mật về kết quả khám lâm sàng, kết quả xét nghiệm.
                  </li>
                </ul>
              </div>
            </div>
            {/* Button previous */}
            <button className="w-[32px] h-[50px] bg-[rgba(255,255,255,0.2)] rounded-[4px] absolute top-[40%] left-[10px] z-50">
              <i className="fa-solid fa-angle-left text-white" />
            </button>
            {/* Button next */}
            <button className="w-[32px] h-[50px] bg-[rgba(255,255,255,0.2)] rounded-[4px] absolute top-[40%] right-[10px] z-50">
              <i className="fa-solid fa-angle-right text-white" />
            </button>
          </div>
        </div>
      </div>
            {/* Standard */}
            <div className="standard-container w-full h-[704px] bg-[var(--blue-dark)] border flex justify-center items-center text-black">
        <div className="carousel-content w-[1024px] h-full flex flex-col items-start gap-[10px] py-[60px]">
          <div className="row-top w-full h-[284px] grid grid-cols-3 gap-[10px]">
            <div className="bg-red-400 relative w-full h-[284px] rounded-[8px] text-right">
              <img
                alt=""
                src="/assets/img/standard1.png"
                className="w-full h-[284px] object-cover blur-sm"
              />
              <h1 className="absolute top-[16px] right-[16px] text-[40px] text-[var(--blue-dark)] font-bold">
                Tiêu chuẩn tham gia hiến máu
              </h1>
            </div>
            <div className="w-full rounded-[8px] flex flex-col gap-[10px]">
              <div className="bg-white rounded-[8px] w-full h-[137px] p-[16px]">
                <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                  <i className="fa-solid fa-address-card text-[26px] text-white" />
                </div>
                <h3 className="text-[16px]">
                  Mang theo chứng minh nhân dân/hộ chiếu
                </h3>
              </div>
              <div className="bg-white rounded-[8px] w-full h-[137px] p-[16px]">
                <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                  <i className="fa-solid fa-syringe text-[26px] text-white" />
                </div>
                <h3 className="text-[16px]">
                  Không nghiện ma túy, rượu bia và các chất kích thích
                </h3>
              </div>
            </div>
            <div className="bg-white w-full h-[284px] rounded-[8px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-solid fa-virus text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">
                Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV, không
                nhiễm viêm gan B, viêm gan C, và các virus lây qua đường truyền
                máu
              </h3>
            </div>
          </div>
          <div className="row-center w-full h-[150px] grid grid-cols-3 gap-[10px]">
            <div className="bg-white rounded-[8px] w-full h-[150px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-solid fa-weight-scale text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">Cân nặng: Nam ≥ 45 kg Nữ ≥ 45 kg</h3>
            </div>
            <div className="bg-white rounded-[8px] w-full h-[150px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-solid fa-heart-pulse text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">
                Không mắc các bệnh mãn tính hoặc cấp tính về tim mạch, huyết áp,
                hô hấp, dạ dày…
              </h3>
            </div>
            <div className="bg-white w-full h-[150px] rounded-[8px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-solid fa-droplet text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">
                Chỉ số huyết sắc tố (Hb) ≥120g/l (≥125g/l nếu hiến từ 350ml trở
                lên).
              </h3>
            </div>
          </div>
          <div className="row-bottom w-full h-[150px] grid grid-cols-3 gap-[10px]">
            <div className="bg-white rounded-[8px] w-full h-[150px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="text-[26px] text-white   font-bold text-xl text-center">
                  18+
                </i>
              </div>
              <h3 className="text-[16px]">
                Người khỏe mạnh trong độ tuổi từ đủ 18 đến 60 tuổi
              </h3>
            </div>
            <div className="bg-white rounded-[8px] w-full h-[150px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-regular fa-calendar-days text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">
                Thời gian tối thiểu giữa 2 lần hiến máu là 12 tuần đối với cả
                Nam và Nữ
              </h3>
            </div>
            <div className="bg-white w-full h-[150px] rounded-[8px] p-[16px]">
              <div className="w-[50px] h-[50px] bg-[var(--blue-light)] rounded-[8px] flex justify-center items-center mb-[5px]">
                <i className="fa-solid fa-vial text-[26px] text-white" />
              </div>
              <h3 className="text-[16px]">
                Kết quả test nhanh âm tính với kháng nguyên bề mặt của siêu vi B
              </h3>
            </div>
          </div>
        </div>
      </div>
      <Notes />
      <Advice />
      <Activities />
    </>
  );
};

export default Home;
