import React from 'react';

const Logout = () => {
  const handleLogout = () => {
    alert("Bạn đã đăng xuất thành công!");
    window.location.replace('/')
  };

  return (
    <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
      <h2 className="text-xl font-semibold mb-4">Trang đăng xuất</h2>
      <p className="mb-4">Bạn có muốn đăng xuất khỏi tài khoản của mình?</p>
      <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Đăng xuất</button>
    </div>
  );
}

export default Logout;