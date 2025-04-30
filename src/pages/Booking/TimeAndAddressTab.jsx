
import React, { useState, useEffect } from "react";
import { DatePicker, Select, Button, Pagination, Spin, message } from "antd";
import userService from "../../service/userService";
import { useLocation, useNavigate } from "react-router-dom";
import UserService  from "../../service/userService";



const TimeAndAddressTab = ({ onTabChange }) => {
  const eventId = localStorage.getItem("eventId");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const { Option } = Select;
  const [responseMessage, setResponseMessage] = useState('');
  const [responseCode, setResponseCode] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
      const fetchEventData = async () => {
        if (!eventId) {
          messageApi.error("Event ID is missing!");
          setLoading(false);
          return;
        }
        try {
          // Fetch event details
          const response = await UserService.getEventById(eventId,token );
          setEvent(response.eventDTO); 
          console.log("response.eventDTO");
        } catch (error) {
          console.error("Error fetching event data:", error.message);
          messageApi.error("Failed to load event data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchEventData();
    }, [eventId, token, messageApi]);

    const handleSaveAppointment = async () => {
      if (!username || !eventId) {
        messageApi.error("Missing user or event data for appointment.");
        return;
      }
  
      try {
        const response = await UserService.saveAppointment(token, username, eventId);
        messageApi.success("Your appointment was saved successfully!");
        console.log("response",response);
        if(response.code === 200){
          alert("Appointment successfully saved!");

        }
        else{
          alert("You have already booked your appointment!");

        }
        navigate("/appointments");
      } catch (error) {
        console.error("Error saving appointment:", error.message);
        messageApi.error("Unable to save your appointment. Please try again.");
        setResponseMessage('Something went wrong.');
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!event) {
      return <div>No event data available</div>;
    }

  return (
    <div className="col-span-1 md:col-span-2">
      {contextHolder}
      <h2 className="text-xl font-semibold mt-6 text-blue-800">
        Thời gian &amp; địa điểm
      </h2>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">Ngày</label>
        <input
          type="date"
          className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)]"
          readOnly
          value={event.donateDate}
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Tỉnh/Thành phố
        </label>
        <div className="relative">
          <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
            <option>Hồ Chí Minh</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Địa điểm
        </label>
        <div className="relative">
          <div className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] bg-white">
            <p className="text-base font-bold text-blue-600">Hiến máu - {event.title}</p>  {/* Tiêu đề lớn hơn */}
            <p className="text-sm text-gray-600">{event.donationUnitDTO.location}</p>  {/* Địa điểm nhỏ hơn */}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
          </div>
        </div>
      </div>

      <div className="mt-4">
    <label className="block pb-0.5">Nhóm máu cần hiến</label>
    <div className="flex space-x-2 mt-2">
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-[10px] hover:bg-cyan-600 transition-all duration-300">
            Nhóm máu A
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-[10px] hover:bg-yellow-600 transition-all duration-300">
            Nhóm máu B
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-[10px] hover:bg-red-600 transition-all duration-300">
            Nhóm máu AB
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-[10px] hover:bg-green-600 transition-all duration-300">
            Nhóm máu O
        </button>
    </div>
</div>


      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 pb-0.5">
          Giờ hiến máu
        </label>
        <div className="relative">
          <select className="w-full p-2 rounded-lg border-2 border-solid border-[rgb(187,215,253)] focus:ring-indigo-500 focus:border-indigo-500 appearance-none pr-10">
          <option>
              {`${event.eventStartTime.slice(0, 5)} - ${event.eventEndTime.slice(
                0,
                5
              )}`}
            </option> 
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button  
          onClick={() => onTabChange("FORM")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Tiếp tục
        </button>
      </div>
      {responseMessage && (
        <div className={responseCode === 200 ? 'success' : 'error'}>
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default TimeAndAddressTab;
