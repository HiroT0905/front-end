import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import UserService from '../../service/userService';
import Cookies from 'js-cookie'; // Thêm thư viện cookies

function LoginPage() {
  const [cccd, setCccd] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cccd || !password) {
      setError('Please fill in all fields.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      // Gửi request login để lấy thông tin người dùng
      const response = await UserService.login({ cccd, password });

      if (response.code === 200) {
        // Lưu thông tin đăng nhập vào localStorage và Cookie
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', cccd);
        localStorage.setItem('role', response.role);
        // Cookies.set('username', cccd);
        
        // Điều hướng đến trang trước đó hoặc trang chủ
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || error.message);
      setTimeout(() => {
        setError(''); // Xóa thông báo lỗi sau 5 giây
      }, 5000);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-form">
        <h2 className="text-center">Login</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cccd">CCCD: </label>
            <input
              type="text"
              id="cccd"
              value={cccd}
              onChange={(e) => setCccd(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <div className="forgot-password pt-4">
          <Link to="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
