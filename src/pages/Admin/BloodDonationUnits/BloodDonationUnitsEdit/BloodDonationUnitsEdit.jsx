import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../../../service/userService";
import { TextField, Button, CircularProgress, Box, Typography, Grid, Paper, Snackbar, Alert } from "@mui/material";

const BloodDonationUnitsEdit = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [unitData, setUnitData] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    photo: "", // Link ảnh cũ từ AWS
  });
  const [file, setFile] = useState(null); // Ảnh mới nếu được chọn
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [successMessage, setSuccessMessage] = useState(""); // Trạng thái thông báo thành công
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Điều khiển việc mở/đóng Snackbar

  // Dùng useEffect để tải thông tin đơn vị khi component được render
  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        const response = await ApiService.getDonationUnitById(id, token); // Gọi API với token
        setUnitData({
          name: response.donationUnitDTO.name,
          location: response.donationUnitDTO.location,
          email: response.donationUnitDTO.email,
          phone: response.donationUnitDTO.phone,
          photo: response.donationUnitDTO.unitPhotoUrl, // Hiển thị ảnh đơn vị
        });
      } catch (error) {
        console.log("Lỗi khi lấy thông tin đơn vị:", error.message);
        setError("Không thể tải thông tin đơn vị.");
        setSnackbarOpen(true); // Mở snackbar khi có lỗi
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchUnitDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value }); // Cập nhật dữ liệu đơn vị
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]; // Lấy ảnh người dùng chọn
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile); // Tạo URL để hiển thị ảnh ngay lập tức
      setUnitData({ ...unitData, photo: previewUrl }); // Cập nhật ảnh đơn vị
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngừng hành động mặc định của form
  
    try {
      setLoading(true); // Bắt đầu tải
      const token = localStorage.getItem("token"); // Lấy token từ localStorage
  
      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("name", unitData.name); // Thêm thông tin tên
      formData.append("location", unitData.location); // Thêm thông tin location
      formData.append("email", unitData.email); // Thêm thông tin email
      formData.append("phone", unitData.phone); // Thêm thông tin phone
  
      if (file) {
        formData.append("photo", file); // Nếu người dùng chọn ảnh mới
      }
  
      // Gửi formData đến backend
      const response = await fetch(`http://localhost:8080/units/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
        body: formData, // Gửi formData
      });

      if (response.ok) {
        setSuccessMessage("Cập nhật đơn vị thành công!");
        setSnackbarOpen(true); // Mở snackbar thông báo thành công
        
        setTimeout(() => {
          navigate("/admin/blood-donation-units"); 
        }, 1500); 
      } else {
        const errorData = await response.json();
        setError(`Lỗi: ${errorData.message}`);
        setSnackbarOpen(true); // Mở snackbar khi có lỗi
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn vị:", error);
      setError("Không thể cập nhật đơn vị.");
      setSnackbarOpen(true); // Mở snackbar khi có lỗi
    } finally {
      setLoading(false); // Kết thúc tải
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Đóng snackbar khi người dùng bấm vào
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cập nhật đơn vị hiến máu
        </Typography>

        {loading && <CircularProgress />} {/* Hiển thị loading khi đang tải */}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div className="w-full">
              <TextField
                label="Tên đơn vị"
                name="name"
                value={unitData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Địa điểm"
                name="location"
                value={unitData.location}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Email"
                name="email"
                value={unitData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <TextField
                label="Điện thoại"
                name="phone"
                value={unitData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </div>

            <div className="w-full">
              <Typography variant="subtitle1">Ảnh hiện tại:</Typography>
              {unitData.photo && (
                <img
                  src={unitData.photo}
                  alt="Current Unit"
                  className="w-[150px] h-[150px] object-cover rounded-lg"
                />
              )}
            </div>

            <div className="w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
            </div>

            <div className="w-full">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật đơn vị"}
              </Button>
            </div>
          </div>
        </form>
      </Paper>

      {/* Hiển thị Snackbar với thông báo thành công hoặc lỗi */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BloodDonationUnitsEdit;
