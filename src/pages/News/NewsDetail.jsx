import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../../service/userService";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await UserService.getNewsById(id, token);
        setNews(res.newsDTO);
      } catch (err) {
        console.error("Lỗi lấy chi tiết tin tức:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải nội dung...</div>;
  }

  if (!news) {
    return <div className="text-center mt-10 text-red-500">Không tìm thấy tin tức</div>;
  }

  return (
   <div className="container my-10 mx-auto px-4 max-w-3xl bg-white p-6 rounded-xl shadow-md">
  <h1 className="text-[1.625rem] font-bold text-blue-700 mb-6 text-center">{news.title}</h1>
  <div
    className="
      text-justify text-base leading-loose tracking-tight font-arial
      [&_p]:indent-6 [&_p]:mb-4
       [&_ul]:list-disc [&_ul]:pl-12 [&_ul]:mb-4
         [&_ol]:list-decimal [&_ol]:pl-12 [&_ol]:mb-4
       [&_li]:mb-1 [&_li]:ml-2
      [&_strong]:font-semibold
      [&_img]:block [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-md [&_img]:max-w-full
    "
    dangerouslySetInnerHTML={{ __html: news.content }}
  />
</div>

  );
};

export default NewsDetail;
