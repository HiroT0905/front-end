import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ClientHeader from "./ClientHeader";
import ClientFooter from "./ClientFooter";
import UserService from "../../service/userService";
import { message } from "antd";

const ClientLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Tôi là chatbot hỗ trợ của bạn. Bạn cần giúp gì?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [options, setOptions] = useState([]);  // Store options as an array
  const chatContainerRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Fetch options for the user when the chat opens
  const fetchOptions = async (username) => {
    try {
      const options = await UserService.getOptions(username);  // Fetch options from BE
      console.log("Fetched options: ", options);
  
      // Save both keys and values as an array of objects
      const formattedOptions = Object.keys(options).map((key) => ({
        label: key,  // The key will be displayed
        value: options[key]  // The value will be sent to BE
      }));
  
      setOptions(formattedOptions);  // Set options as array of objects
    } catch (error) {
      console.error("Error fetching options: ", error);
    }
  };

  // Toggle chatbot window
  const handleChatbotClick = () => {
    setIsChatOpen(true);
    fetchOptions(localStorage.getItem("username"));  // Fetch options when chat opens
  };

  // Close chatbot window
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      console.log("inputText: ", inputText);

      // Call UserService to get the chatbot's response
      const response = await UserService.chat(inputText);  // Chat with the bot
      console.log(response); // Check the response from the chat API

      // Add user message
      setMessages((prev) => [...prev, { sender: "user", text: inputText }]);
      setInputText("");

      // Simulate bot response with the actual API response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response },
        ]);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle button click for options
  const handleOptionClick = async (option) => {
    try {
      // Send the value of the selected option (not the key)
      console.log("Selected option value:", option.value);
  
      const response = await UserService.chat(option.value);  // Send value to BE
      console.log("Response from bot:", response);
  
      // Add user message
      setMessages((prev) => [...prev, { sender: "user", text: option.label }]);
  
      // Simulate bot response with the actual API response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: response },
        ]);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatText = (text) => {
    // Thay thế \n thành <br />
    let formattedText = text.replace(/\n/g, '<br />');
    
    // Thay thế **bold text** thành <strong>bold text</strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    return formattedText;
  };

  return (
    <>
      <ClientHeader />
      <Outlet />
      <ClientFooter />

      {/* Chatbot Icon (hidden when chat is open) */}
      {!isChatOpen && (
        <button
          onClick={handleChatbotClick}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 transition-transform transform hover:scale-105"
          aria-label="Open chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chatbot Window (larger and styled) */}
      {isChatOpen && (
        <div
          ref={chatWindowRef}
          className="fixed bottom-6 right-6 w-[350px] max-w-[90%] h-[600px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200"
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-lg font-semibold">Chatbot Hỗ Trợ</h3>
            </div>
            <button
              onClick={handleCloseChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Messages with Scroll */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === "bot" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg shadow-sm ${message.sender === "bot" ? "bg-white text-black" : "bg-blue-600 text-white"}`}
                >
                  {typeof message.text === "object" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: formatText(message.text.reply) }}
                    />
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Options Buttons */}
          {options.length > 0 && (
            <div className="p-4 space-y-2">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full bg-gray-200 text-black py-2 px-4 rounded-lg shadow-sm hover:bg-gray-300"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* User Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-100 flex">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300"
              placeholder="Nhập tin nhắn..."
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white p-3 rounded-lg"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ClientLayout;
