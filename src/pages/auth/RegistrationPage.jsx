import React, { useState } from "react";
import UserService from "../../service/userService";
import { useNavigate } from "react-router-dom";
import OcrService from "../../service/ocrService";
function RegistrationPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [step, setStep] = useState(1); // step 1: upload, 2: form1, 3: contact
  const [formData, setFormData] = useState({
    cccd: "",
    password: "",
    fullName: "",
    dob: "",
    sex: "",
    address: "",
  });
  const [contactInfo, setContactInfo] = useState({ email: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    const stateSetter = formType === "form1" ? setFormData : setContactInfo;
    stateSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Please select an image of CCCD before proceeding.");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("file", imageFile);
      console.log(imageFile);
      const response = await OcrService.extractImage(imageFile);
      console.log(response);
      
        setFormData((prev) => ({
          ...prev,
          cccd: response.cccd || "",
          fullName: response.fullName || "",
          dob: response.dateOfBirth || "",
          sex: response.gender || "",
          address: response.address || "",
        }));
        setStep(2);
    
    } catch (err) {
      console.error(err);
      alert("Error extracting data from image.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const { cccd, password, fullName, dob, sex, address } = formData;
    if (cccd && password && fullName && dob && sex && address) {
      setStep(3);
    } else {
      alert("Please complete all fields in this form.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (token) {
    alert("Bạn đã đăng nhập. Vui lòng đăng xuất trước khi đăng ký.");
    return;
  }

  try {
    const userData = {
      ...formData,
      dob: formatDate(formData.dob),
      ...contactInfo,
    };

    const { code, error } = await UserService.register(userData, token);
    console.log("code: ",code);

    switch (code) {
      case 200:
        alert("Đăng ký thành công!");
        navigate("/login");
        break;

      case 409:
        console.warn("⚠️ Người dùng đã tồn tại:", userData.cccd);
        alert("Người dùng đã tồn tại. Vui lòng sử dụng CCCD khác.");
        break;

      default:
        console.error(`🚨 Đăng ký thất bại. Mã lỗi: ${code}. Chi tiết:`, error);
        alert(`Đã xảy ra lỗi: ${error || "Lỗi không xác định"}`);
    }

  } catch (err) {
    if (err.response && err.response.status === 409) {
    console.warn("⚠️ Người dùng đã tồn tại:");
    alert("Người dùng đã tồn tại. Vui lòng sử dụng CCCD khác.");
  } else {
    console.error("❌ Lỗi không mong muốn khi đăng ký:");
    alert(err);
  }
  }
};

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 ở trước nếu tháng là số đơn
    const day = d.getDate().toString().padStart(2, '0'); // Thêm số 0 nếu ngày là số đơn
    return `${year}-${month}-${day}`;
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Registration</h2>

        {step === 1 && (
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Đăng ký tài khoản</h2>
            <li className="text-sm font-semi text-gray-600 mb-4 ">Để đăng ký tài khoản vui lòng cung cấp thông tin giấy tờ tùy thân của người hiến máu.</li>
            <li className="text-sm font-semi text-gray-600 mb-4 ">Vui lòng chuẩn bị giấy tờ tùy thân để hệ thống ghi nhận lại mặt trước của giấy tờ tùy thân.</li>

            
            <div className="mb-6">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="fileInput"
                    className="absolute inset-0 opacity-0 cursor-pointer "
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('fileInput').click()}
                    className="text-while bg-indigo-500 w-full border border-gray-300 rounded-md p-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 "
                  >
                    {selectedFile ? selectedFile.name : 'Chọn file để tải lên'}
                  </button>
                </div>
              </div>
            
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={loading || !imageFile} 
                  className={`w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none ${loading || !imageFile ? "bg-indigo-200 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {loading ? "Processing..." : "Tiếp theo"}
                </button>
              </div>
          </div>
        )}


        {step === 2 && (
          <form>
            <div className="mb-4">
              <label htmlFor="cccd" className="block text-sm font-medium text-gray-600">CCCD</label>
              <input type="text" id="cccd" name="cccd" value={formData.cccd} disabled className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input type="password" name="password" value={formData.password} onChange={(e) => handleInputChange(e, "form1")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-600">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={(e) => handleInputChange(e, "form1")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-600">Date of Birth</label>
              <input type="date" name="dob" value={formatDate(formData.dob)} onChange={(e) => handleInputChange(e, "form1")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="sex" className="block text-sm font-medium text-gray-600">Sex</label>
              <input type="text" name="gender" value={formData.sex} onChange={(e) => handleInputChange(e, "form1")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
             
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
              <input type="text" name="address" value={formData.address} onChange={(e) => handleInputChange(e, "form1")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="text-center">
              <button type="button" onClick={handleNext} className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Next</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
              <input type="email" name="email" value={contactInfo.email} onChange={(e) => handleInputChange(e, "form2")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone</label>
              <input type="text" name="phone" value={contactInfo.phone} onChange={(e) => handleInputChange(e, "form2")} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="text-center">
              <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">Register</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegistrationPage;
