import classNames from "classnames";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CollapseItem = ({ question, answers }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="border border-[#bbd7fd] px-[30px] py-[20px] rounded-[10px] cursor-pointer">
      <div
        className="title flex justify-between items-center"
        onClick={() => setVisible(!visible)}
      >
        <h1 className="text-[20px] text-[var(--blue-light)] font-medium">
          {question}
        </h1>
        <i className="fa-solid fa-angle-down" />
      </div>

      <div
        id="expanded-1"
        className={classNames("mt-[10px]", {
          hidden: !visible,
        })}
      >
        <ul>
          {answers.map((it, index) => (
            <li key={index}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Notes = () => {
  const data = useMemo(() => {
    return [
      {
        question: "Ai có thể tham gia hiến máu?",
        answers: [
          "- Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh.",
          "- Cân nặng ít nhất là 45kg đối với phụ nữ, nam giới. Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần.",
          "- Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác.",
          "- Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả Nam và Nữ.",
          "- Có giấy tờ tùy thân.",
        ],
      },
      {
        question: "Ai là người không nên hiến máu?",
        answers: [
          "- Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các vius lây qua đường truyền máu.",
          "- Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày…",
        ],
      },
      {
        question: "Máu của tôi sẽ được làm những xét nghiệm gì?",
        answers: [
          "- Tất cả những đơn vị máu thu được sẽ được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét.",
          "- Bạn sẽ được thông báo kết quả, được giữ kín và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên.",
        ],
      },
    ];
  }, []);

  return (
    <div className="standard-container w-full h-auto bg-white border flex justify-center items-center text-black">
      <div className="carousel-content w-[1024px] h-full flex flex-col items-start gap-[30px] py-[30px]">
        <div className="w-full h-[53px] text-center">
          <h1 className="text-[40px] text-[var(--blue-dark)] font-bold">
            Lưu ý quan trọng
          </h1>
        </div>
        <div className="w-full flex flex-col gap-[15px]">
          {data.map((it, index) => (
            <CollapseItem
              key={index}
              question={it.question}
              answers={it.answers}
            />
          ))}
        </div>
        <div className="w-full text-center">
          <Link
            href=""
            className="text-[16px] text-[var(--blue-dark)] font-medium"
          >
            Xem thêm &gt;&gt;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notes;
