import React, {useEffect, useState} from 'react';
import { Navigate ,useLocation ,Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserService from '../service/userService';


export const GuestRoute = ({ element: Component }) => {
  const location = useLocation();

  return UserService.isAuthenticated() ? (
    <Navigate to="/profile" replace state={{ from: location }} />
  ) : (
    Component
  );
};


export  const ProtectedRoute = ({ element, ...rest }) => {
  // Kiểm tra nếu có token (nghĩa là người dùng đã đăng nhập)
  // const isAuthenticated = Cookies.get('token');
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Nếu người dùng chưa đăng nhập, chuyển hướng họ về trang login
    return <Navigate to="/login" />;
  }


  // Nếu người dùng đã đăng nhập, hiển thị element tương ứng
  return element;
};


export const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const result =  UserService.isAdmin(); // Kiểm tra quyền admin
        setIsAdmin(result);
        console.log("resule", result)
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Hiển thị khi đang kiểm tra quyền
  }

  return isAdmin ? (
    <Outlet /> // Render các route con nếu có quyền
  ) : (
    <Navigate to="/not-found" replace /> // Chuyển hướng nếu không có quyền
  );
};

export default AdminRoute;