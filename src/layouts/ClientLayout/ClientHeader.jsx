// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { ROUTE_PATH } from "../../constants/routes";
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode'; // Update import here

// // Giải mã token JWT để lấy thông tin người dùng
// const decodeJwt = (token) => {
//   try {
//     return jwtDecode(token); // Use jwtDecode function
//   } catch (error) {
//     console.error('Invalid token', error);
//     return null;
//   }
// };

// const ClientHeader = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [userName, setUserName] = useState(""); // State lưu tên người dùng
//   const dropdownRef = useRef(null); // Tạo ref cho dropdown
//   const location = useLocation(); // Sử dụng useLocation để theo dõi thay đổi location
//   const navigate = useNavigate(); // Dùng useNavigate để điều hướng người dùng
//   const [isAuthenticated, setIsAuthenticated] = useState(false); // Thêm state để kiểm tra đăng nhập

//   // Mở/đóng dropdown
//   const handleToggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   // Đóng dropdown khi bấm ra ngoài
//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      
//       setShowDropdown(false);
//     }
//   };

//   useEffect(() => {
//     // Thêm sự kiện click khi component được mount
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       // Dọn dẹp sự kiện khi component unmount
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     // Đóng dropdown khi location thay đổi
//     setShowDropdown(false);
//   }, [location]);

//   useEffect(() => {
//     // Kiểm tra cookie xem có token hay không khi component mount
//     const token = localStorage.getItem('token');
//     const username = localStorage.getItem('username')
//     // const storedUserName = Cookies.get('userName'); // Lấy userName từ cookie
  
//     if(token){
//       try{
//           const decodedToken = jwtDecode(token);
//           // setUserName(decodedToken?.userName || 'Tài khoản');
//           setUserName(username?? 'Tài khoản')
//           setIsAuthenticated(true);
//       }catch(error ){
//         console.error('Token không hợp lệ', error);
//         setIsAuthenticated(false);

//       }
//     }else{
//       setIsAuthenticated(false);
//     }
    
//   }, [location]);

//   // Hàm đăng xuất
//   const handleLogout = () => {
//     // Xóa token khỏi cookie khi đăng xuất
//     localStorage.clear();
//     setIsAuthenticated(false);
//     navigate(ROUTE_PATH.LOGIN); // Điều hướng về trang chủ
//     window.location.reload();

//   };

//   return (
//     <>
//       <div className="header-container w-full h-[57px] flex justify-center items-center text-black">
//         <div className="header-content w-[1024px] h-full flex justify-between items-center">
//           <div className="languages">
//             <Link to="" className="text-[16px] text-[var(--black)] font-bold mr-[1px]">
//               VN
//             </Link>
//             |
//             <Link to="" className="text-[16px] text-[var(--gray)] font-bold ml-[1px]">
//               EN
//             </Link>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Link to={ROUTE_PATH.HOME}>
//               <img
//                 src="/assets/img/logo-hutech.png"
//                 alt="Logo 1"
//                 className="h-8"
//               />
//             </Link>
//           </div>

//           <div className="relative inline-block text-left flex flex-row gap-2" ref={dropdownRef}>
//             <div>
//               <button
//                   onClick={() => {
//                     if (!isAuthenticated) {
//                       navigate('/login');  // Chuyển đến trang đăng nhập nếu chưa đăng nhập
//                     } else {
//                       handleToggleDropdown();  // Mở/đóng dropdown nếu đã đăng nhập
//                     }
//                   }}
//                   className="justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   {userName || "Đăng nhập"}  {/* Hiển thị Tài khoản nếu đã đăng nhập, ngược lại là Đăng nhập */}
//               </button>
//             </div>
//             {!isAuthenticated && (
//               <div >
//               <button 
//                       onClick={() => {
//                         if (!isAuthenticated){
//                           navigate('/register')
//                         }
//                       }}
                      
//                       className="justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-1">
//                   Đăng ký
//               </button>
//               </div>
//             )}
           
//             <div
//               id="dropdown"
//               className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${showDropdown ? "" : "hidden"}`}
//             >
//               <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//                 <NavLink to="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                   Thông tin cá nhân
//                 </NavLink>

//                 <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                   Thiết lập cá nhân
//                 </NavLink>

//                 <NavLink onClick={handleLogout} to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                   Đăng xuất tài khoản
//                 </NavLink>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="navigate-container w-full h-[42px] bg-[var(--blue-dark)] flex justify-center items-center text-black">
//         <div className="navigate-content w-[1024px] h-full flex justify-center items-center">
//           <div className="info flex justify-center items-center gap-[50px] text-white" id="navigation">
//             <NavLink to={ROUTE_PATH.HOME} className="py-[7px] text-[16px] text-white">
//               TRANG CHỦ
//             </NavLink>
//             {isAuthenticated && (
//               <>
//                 <NavLink to="/appointments" className="py-[7px] text-[16px] text-white">
//                   LỊCH HẸN CỦA BẠN
//                 </NavLink>
//                 <NavLink to="/historyappoint" className="py-[7px] text-[16px] text-white">
//                   LỊCH SỬ ĐẶT HẸN
//                 </NavLink>
//                 <NavLink to="/certificate" className="py-[7px] text-[16px] text-white">
//                   CHỨNG NHẬN
//                 </NavLink>
//               </>
//             )}
//             <NavLink to={ROUTE_PATH.FAQ} className="py-[7px] text-[16px] text-white">
//               HỎI - ĐÁP
//             </NavLink>
//             <NavLink to={ROUTE_PATH.NEWS} className="py-[7px] text-[16px] text-white">
//               TIN TỨC
//             </NavLink>
//             <NavLink to={ROUTE_PATH.CONTACT} className="py-[7px] text-[16px] text-white">
//               LIÊN HỆ
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };



// export default ClientHeader;
import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ROUTE_PATH } from "../../constants/routes";
import { jwtDecode } from 'jwt-decode'; // Cập nhật lại import

// Giải mã token JWT để lấy thông tin người dùng
const decodeJwt = (token) => {
  try {
    return jwtDecode(token); // Dùng jwtDecode để giải mã token
  } catch (error) {
    console.error('Token không hợp lệ', error);
    return null;
  }
};

const ClientHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState(""); // State lưu tên người dùng
  const dropdownRef = useRef(null); // Tạo ref cho dropdown
  const location = useLocation(); // Sử dụng useLocation để theo dõi thay đổi location
  const navigate = useNavigate(); // Dùng useNavigate để điều hướng người dùng
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Thêm state kiểm tra đăng nhập

  // Mở/đóng dropdown
  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Đóng dropdown khi bấm ra ngoài
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    // Thêm sự kiện click khi component được mount
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp sự kiện khi component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Đóng dropdown khi location thay đổi
    setShowDropdown(false);
  }, [location]);

  useEffect(() => {
    // Kiểm tra cookie xem có token hay không khi component mount
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(username || 'Tài khoản');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token không hợp lệ', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.clear();
    setIsAuthenticated(false);
    navigate(ROUTE_PATH.LOGIN); // Điều hướng về trang đăng nhập
    window.location.reload();

  };

  return (
    <>
      <div className="header-container w-full h-[57px] flex justify-center items-center text-black">
        <div className="header-content w-[1024px] h-full flex justify-between items-center">
          <div className="languages">
            <Link to="" className="text-[16px] text-[var(--black)] font-bold mr-[1px]">
              VN
            </Link>
            |
            <Link to="" className="text-[16px] text-[var(--gray)] font-bold ml-[1px]">
              EN
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to={ROUTE_PATH.HOME}>
              <img src="/assets/img/logo-hutech.png" alt="Logo" className="h-8" />
            </Link>
          </div>

          <div className="relative inline-block text-left flex flex-row gap-2" ref={dropdownRef}>
            <div>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');  // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
                  } else {
                    handleToggleDropdown();  // Mở/đóng dropdown nếu đã đăng nhập
                  }
                }}
                className="justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {userName || "Đăng nhập"}  {/* Hiển thị Tài khoản nếu đã đăng nhập, ngược lại là Đăng nhập */}
              </button>
            </div>

            {!isAuthenticated && (
              <div>
                <button
                  onClick={() => navigate('/register')}
                  className="justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-1"
                >
                  Đăng ký
                </button>
              </div>
            )}

            <div
              id="dropdown"
              className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${showDropdown ? "" : "hidden"}`}
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <NavLink to="/Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Thông tin cá nhân
                </NavLink>
                <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Thiết lập cá nhân
                </NavLink>
                <NavLink onClick={handleLogout} to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Đăng xuất
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="navigate-container w-full h-[42px] bg-[var(--blue-dark)] flex justify-center items-center text-black">
        <div className="navigate-content w-[1024px] h-full flex justify-center items-center">
          <div className="info flex justify-center items-center gap-[50px] text-white" id="navigation">
            <NavLink to={ROUTE_PATH.HOME} className="py-[7px] text-[16px] text-white">
              TRANG CHỦ
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/appointments" className="py-[7px] text-[16px] text-white">
                  LỊCH HẸN CỦA BẠN
                </NavLink>
                <NavLink to="/historyappoint" className="py-[7px] text-[16px] text-white">
                  LỊCH SỬ ĐẶT HẸN
                </NavLink>
                <NavLink to="/certificate" className="py-[7px] text-[16px] text-white">
                  CHỨNG NHẬN
                </NavLink>
              </>
            )}
            <NavLink to={ROUTE_PATH.FAQ} className="py-[7px] text-[16px] text-white">
              HỎI - ĐÁP
            </NavLink>
            <NavLink to={ROUTE_PATH.NEWS} className="py-[7px] text-[16px] text-white">
              TIN TỨC
            </NavLink>
            <NavLink to={ROUTE_PATH.CONTACT} className="py-[7px] text-[16px] text-white">
              LIÊN HỆ
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientHeader;
