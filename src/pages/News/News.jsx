import React, { useState, useEffect } from "react";
import UserService from "../../service/userService";

function TinTuc() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await UserService.getAllNews(token);

        // Log dữ liệu trả về từ API để kiểm tra
        console.log("Du lieu List", response.newsDTOList);

        // Kiểm tra nếu có trường newsDTO
        if (response && response.newsDTOList) {
          setNewsList(response.newsDTOList); // Gán trực tiếp, không cần gói trong mảng
        } else {
          console.error("Dữ liệu không có trường newsDTO");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tin tức:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) {
    return <p>Đang tải tin tức...</p>;
  }

  return (
    <div className="container my-6 mx-auto px-4 max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {newsList.length > 0 &&
          newsList.map((news) => (
            <a
              key={news.id} // Mỗi phần tử tin tức cần có 'key' duy nhất
              href="#"
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.images} // Đảm bảo bạn lấy đúng trường hình ảnh
                alt={`News Image ${news.id}`}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                  {news.title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-3">
                  {news.content}
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

export default TinTuc;
