import React, { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ApiService from "../../../../service/userService";

const EventBloodDonationAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [donationUnits, setDonationUnits] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    title: "",
    donateDate: null,
    eventStartTime: null,
    eventEndTime: null,
    unit: "",
    maxRegistrations: 0,
    status: "ACTIVE",
    minIBloodBag: 0,
    maxIBloodBag: 0,
    goalIBloodBag: 0,
    additionalIBloodBag: 0,
  });

  useEffect(() => {
    ApiService.getAllUnits()
      .then((res) => {
        setDonationUnits(res.donationUnitList || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Không thể tải danh sách đơn vị hiến máu.",
          severity: "error",
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['title', 'donateDate', 'eventStartTime', 'eventEndTime', 'unit', 'status'];
    const isEmpty = requiredFields.some(field => !formData[field]);
    
    if (isEmpty) {
      setSnackbar({
        open: true,
        message: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        severity: "error",
      });
      return;
    }

    const payload = {
      ...formData,
      donateDate: dayjs(formData.donateDate).format("YYYY-MM-DD"),
      eventStartTime: dayjs(formData.eventStartTime).format("HH:mm:ss"),
      eventEndTime: dayjs(formData.eventEndTime).format("HH:mm:ss"),
      maxRegistrations: Number(formData.maxRegistrations),
      bloodQuotaDTO: {
        minIBloodBag: Number(formData.minIBloodBag),
        maxIBloodBag: Number(formData.maxIBloodBag),
        goalIBloodBag: Number(formData.goalIBloodBag),
        additionalIBloodBag: Number(formData.additionalIBloodBag),
      },
    };

    try {
      setLoading(true);
      await ApiService.addEvent(payload);
      setSnackbar({ open: true, message: "Tạo sự kiện thành công!", severity: "success" });
      setTimeout(() => navigate("/admin/event-blood-donation"), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Tạo sự kiện thất bại!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tạo sự kiện hiến máu mới</h1>
            <p className="mt-2 text-sm text-gray-600">Điền đầy đủ thông tin bên dưới để tạo sự kiện</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 sm:p-8">
            <div className="space-y-6">
              {/* Tên sự kiện */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sự kiện <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Đơn vị hiến máu */}
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị hiến máu <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="">Chọn đơn vị</option>
                  {donationUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit} - {unit.location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ngày và trạng thái */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hiến máu <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.donateDate}
                    onChange={(value) => setFormData(prev => ({ ...prev, donateDate: value }))}
                    className="w-full"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        className: 'w-full'
                      }
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">Đang mở</option>
                    <option value="FULL">Đã đầy</option>
                    <option value="DONE">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              {/* Thời gian bắt đầu và kết thúc */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian bắt đầu hoạt động <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.eventStartTime}
                    onChange={(value) => setFormData(prev => ({ ...prev, eventStartTime: value }))}
                    className="w-full"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        className: 'w-full'
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <TimePicker
                    value={formData.eventEndTime}
                    onChange={(value) => setFormData(prev => ({ ...prev, eventEndTime: value }))}
                    className="w-full"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        className: 'w-full'
                      }
                    }}
                  />
                </div>
              </div>

              {/* Giới hạn đăng ký */}
              <div>
                <label htmlFor="maxRegistrations" className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn đăng ký
                </label>
                <input
                  id="maxRegistrations"
                  name="maxRegistrations"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.maxRegistrations}
                  onChange={handleChange}
                />
              </div>

              {/* Chỉ tiêu máu */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="minIBloodBag" className="block text-sm font-medium text-gray-700 mb-1">
                    Túi máu tối thiểu
                  </label>
                  <input
                    id="minIBloodBag"
                    name="minIBloodBag"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.minIBloodBag}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="maxIBloodBag" className="block text-sm font-medium text-gray-700 mb-1">
                    Túi máu tối đa
                  </label>
                  <input
                    id="maxIBloodBag"
                    name="maxIBloodBag"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.maxIBloodBag}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="goalIBloodBag" className="block text-sm font-medium text-gray-700 mb-1">
                    Chỉ tiêu máu
                  </label>
                  <input
                    id="goalIBloodBag"
                    name="goalIBloodBag"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.goalIBloodBag}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="additionalIBloodBag" className="block text-sm font-medium text-gray-700 mb-1">
                    Túi máu dự phòng
                  </label>
                  <input
                    id="additionalIBloodBag"
                    name="additionalIBloodBag"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.additionalIBloodBag}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Nút submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : 'Tạo sự kiện'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Snackbar thông báo */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-6 py-4 rounded-md shadow-lg text-white ${
            snackbar.severity === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="flex items-center">
              {snackbar.severity === 'success' ? (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <span>{snackbar.message}</span>
            </div>
          </div>
        </div>
      )}
    </LocalizationProvider>
  );
};

export default EventBloodDonationAdd;