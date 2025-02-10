import React, { useState } from "react";

const ContentSection = ({ title, description }) => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!visible);

  // Hàm format mô tả để thay thế \n thành <br />
  const formatDescription = (text) => {
    if (typeof text === "string") {
      // Thay thế tất cả các ký tự \n bằng <br />
      return text
        .split("\n") // Tách chuỗi thành các dòng
        .map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
    }
    return text;
  };

  return (
    <>
      <button
        onClick={toggleVisible}
        className="w-full text-left p-4 border-2 rounded-lg border-solid border-[rgb(187,215,253)] accordion-button"
      >
        <span className="text-blue-600 font-semibold">{title}</span>
        <span className="float-right">{visible ? "▲" : "▼"}</span>
      </button>

      <div
        className={`p-4 bg-gray-100 border rounded-[20px_20px_20px_20px] ${!visible ? "hidden" : ""}`}
      >
        <div>{formatDescription(description)}</div>
      </div>
    </>
  );
};

export default ContentSection;
