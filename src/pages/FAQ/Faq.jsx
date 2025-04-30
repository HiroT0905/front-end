import React, { useEffect, useState } from "react";
import ContentSection from "./ContentSection"; // Giả sử ContentSection đã được định nghĩa ở một nơi khác
import UserService from "../../service/userService"; // Import UserService để gọi API

const Faq = () => {
  const [faqs, setFaqs] = useState([]); // Trạng thái lưu trữ FAQ
  const [loading, setLoading] = useState(true); // Trạng thái loading khi đang fetch dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi khi có sự cố trong quá trình fetch

  useEffect(() => {
    const fetchFaqs = async () => {
  
      try {
        const response = await UserService.getAllFaq(); // Gọi API với token
        console.log("Dữ liệu API trả về:", response.faqDTOList);

        if (response && response.faqDTOList) {
          // Đảm bảo description là một chuỗi
          const updatedFaqs = response.faqDTOList.map(faq => ({
            ...faq,
            description: faq.description ? faq.description : "", // Nếu không có description, sử dụng chuỗi rỗng
          }));
          setFaqs(updatedFaqs);
        } else {
          setError("Dữ liệu không hợp lệ hoặc không có dữ liệu FAQ.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách FAQ:", error.message);
        setError("Đã xảy ra lỗi khi tải dữ liệu FAQ.");
      } finally {
        setLoading(false); // Kết thúc quá trình loading
      }
    };

    fetchFaqs();
  }, []); // useEffect sẽ chỉ chạy một lần khi component được render lần đầu tiên

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-4xl font-semibold mb-6 text-blue-800 text-center">
        Lưu ý quan trọng
      </h2>
      
      {loading ? (
        <p className="text-center text-xl">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500 text-center text-xl">{error}</p> // Hiển thị lỗi nếu có
      ) : (
        <div className="space-y-4">
          {faqs.map((it, index) => (
            <ContentSection
              key={index}
              title={`${index + 1}. ${it.title}`} // Câu hỏi là title
              description={it.description} // Truyền description là chuỗi
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Faq;
