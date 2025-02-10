import React, { useState } from "react";
import TimeAndAddressTab from "./TimeAndAddressTab";
import FormTab from "./FormTab";
import classNames from "classnames";

const Booking = () => {
  const [tab, setTab] = useState("TIME_ADDRESS");

  return (
    <div className="max-w-5xl mx-auto my-6 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1 md:col-span-2">
          <h1 className="text-2xl font-bold text-blue-800">
            Đặt lịch hiến máu
          </h1>
          <div className="flex mt-4">
            <button
              className={classNames(
                "bg-gray-200 text-black px-4 py-2 rounded-tl-md rounded-bl-md",
                {
                  "!bg-blue-500 !text-white": tab === "TIME_ADDRESS",
                }
              )}
            >
              Thời gian &amp; địa điểm
            </button>
            <button
              className={classNames(
                "bg-gray-200 text-black px-4 py-2 rounded-tr-md rounded-br-md",
                {
                  "!bg-blue-500 !text-white": tab === "FORM",
                }
              )}
            >
              Phiếu đăng ký hiến máu
            </button>
          </div>
        </div>

        {tab === "TIME_ADDRESS" && <TimeAndAddressTab onTabChange={setTab} />}
        {tab === "FORM" && <FormTab onTabChange={setTab} />}
      </div>
    </div>
  );
};

export default Booking;
