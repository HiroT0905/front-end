import React, { useState, useRef, useCallback, useMemo } from "react";
import { Button, Form, Input, Upload, message, Card, Row, Col, Space, Spin } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewsAdd = () => {
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  // Ổn định hàm onChange bằng useCallback
  const handleEditorChange = useCallback((value) => {
    setEditorContent(value);
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);
    const { title, photo } = values;
    const formData = new FormData();
    const token = localStorage.getItem("token");

    formData.append("title", title);
    formData.append("content", editorContent);
    formData.append("author", "ChiTin");

    if (photo && photo[0]) {
      formData.append("image", photo[0].originFileObj);
    }

    try {
      await axios.post("http://localhost:8080/news/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      message.success("Thêm tin tức thành công!");
      navigate("/admin/news");
    } catch (error) {
      console.error("Lỗi khi thêm tin tức:", error);
      message.error("Thêm tin tức thất bại!");
    } finally {
      setLoading(false);
    }
  };

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
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:8080/upload-image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
        
        const imageUrl = res.data;
        const editor = quillRef.current?.getEditor();
        
        if (editor) {
          const range = editor.getSelection();
          if (range) {
            editor.insertEmbed(range.index, "image", imageUrl);
          } else {
         
            editor.clipboard.dangerouslyPasteHTML(
              editor.getLength(),
              `<img src="${imageUrl}" alt="uploaded-image" />`
            );
          }
        }
      } catch (err) {
        console.error("Upload ảnh thất bại", err);
        message.error("Tải ảnh không thành công");
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
      matchVisual: false // Ngăn chặn các vấn đề về định dạng
    }
  }), [imageHandler]);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "link", "image"
  ];

  return (
    <div className="news-add-container">
      <Card
        title={<span className="text-xl font-semibold">Thêm tin tức mới</span>}
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
                    bounds=".news-add-container"
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
                      Lưu tin tức
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

export default NewsAdd;