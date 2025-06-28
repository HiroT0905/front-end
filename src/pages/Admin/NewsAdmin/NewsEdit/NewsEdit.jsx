import { Button, Card, Form, Input, Upload, message, Row, Col, Space, Spin, Flex } from "antd";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../../../service/userService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";


const NewsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const quillRef = useRef(null);

  // Load dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (id) {
      const fetchNewsDetail = async () => {
        const token = localStorage.getItem("token");
        try {
          setLoading(true);
          const res = await UserService.getNewsById(id, token);
          const news = res.newsDTO;

          form.setFieldsValue({
            title: news.title,
            photo: news.images
              ? [
                  {
                    uid: "-1",
                    name: "Ảnh đã tải lên",
                    status: "done",
                    url: news.images,
                  },
                ]
              : [],
          });
          
          setEditorContent(news.content || "");
        } catch (err) {
          console.error("Lỗi khi tải dữ liệu:", err);
          message.error("Không thể tải thông tin tin tức.");
        } finally {
          setLoading(false);
        }
      };

      fetchNewsDetail();
    }
  }, [id, form]);

  const handleEditorChange = useCallback((value) => {
    setEditorContent(value);
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);
      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const res = await UserService.uploadImage(formData, token);
        
        const imageUrl = res.data.url || res.data;
        const editor = quillRef.current?.getEditor();
        
        if (editor) {
          const range = editor.getSelection();
          if (range) {
            editor.insertEmbed(range.index, "image", imageUrl);
            editor.setSelection(range.index + 1, 0);
          } else {
            editor.clipboard.dangerouslyPasteHTML(
              editor.getLength(),
              `<img src="${imageUrl}" alt="uploaded-image" style="max-width: 100%; height: auto;" />`
            );
          }
        }
      } catch (err) {
        console.error("Upload ảnh thất bại:", err.response?.data || err.message);
        message.error(`Tải ảnh không thành công: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"]
      ],
      handlers: {
        image: imageHandler
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [imageHandler]);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image"
  ];

  const onSubmit = async (values) => {
    const token = localStorage.getItem("token");
    const author = localStorage.getItem("username");
    const formData = new FormData();
    setLoading(true);
    formData.append("title", values.title);
    formData.append("content", editorContent);
    formData.append("author",author )

    if (values.photo && values.photo.length > 0 && values.photo[0].originFileObj) {
      formData.append("photo", values.photo[0].originFileObj);
    }
    try {
      await axios.put(`http://localhost:8080/news/update/${id}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            });

            message.success("cập nhật tin tức thành công!");
            navigate("/admin/news");
        } catch (error) {
        console.error("Lỗi khi thêm tin tức:", error);
        message.error("Thêm tin tức thất bại!");
    } finally {
        setLoading(false);
    }

  };

  return (
    <div className="news-edit-container">
      <Card
        title={<span className="text-xl font-semibold">{id ? "Chỉnh sửa tin tức" : "Thêm tin tức"}</span>}
        bordered={false}
        className="shadow-sm"
      >
        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={onSubmit}>
            <Row gutter={24}>
              <Col xs={24} md={16}>
                <Form.Item
                  label="Tiêu đề tin tức"
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề tin tức" }]}
                >
                  <Input placeholder="Nhập tiêu đề tin tức" size="large" />
                </Form.Item>

                <Form.Item
                  label="Nội dung chi tiết"
                  required
                  validateStatus={editorContent ? "success" : "error"}
                  help={!editorContent && "Vui lòng nhập nội dung tin tức"}
                >
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={editorContent}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Nhập nội dung chi tiết của bài viết..."
                    style={{ height: 400, marginBottom: 50 }}
                    bounds=".news-edit-container"
                    preserveWhitespace
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Card title="Thông tin bổ sung" className="mb-4">
                  <Form.Item
                    label="Ảnh đại diện"
                    name="photo"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    extra="Ảnh thumbnail cho tin tức (tỉ lệ 16:9)"
                    rules={[{ required: !id, message: "Vui lòng tải lên ảnh" }]}
                  >
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={() => false}
                      accept="image/*"
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Card>

                <Card>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      size="large"
                      block
                      loading={loading}
                    >
                      {id ? "Cập nhật" : "Lưu tin tức"}
                    </Button>
                    <Button
                      type="default"
                      size="large"
                      block
                      onClick={() => navigate("/admin/news")}
                      disabled={loading}
                    >
                      Hủy bỏ
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default NewsEdit;