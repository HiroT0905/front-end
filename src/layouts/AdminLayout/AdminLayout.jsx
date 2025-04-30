import React, { useState, useEffect } from "react";
import { AppstoreOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ROUTE_PATH } from "../../constants/routes";
import UserService from "../../service/userService";

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: ROUTE_PATH.DASHBOARD,
    icon: <AppstoreOutlined />,
    label: <Link to={ROUTE_PATH.DASHBOARD}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "Quản lý kho máu",
    children: [
      {
        key: ROUTE_PATH.BLOOD_DONATION_HISTORY,
        label: (
          <Link to={ROUTE_PATH.BLOOD_DONATION_HISTORY}>Danh sách kho máu</Link>
        ),
      },
      {
        key: ROUTE_PATH.ADD_BLOOD_DONATION_HISTORY,
        label: (
          <Link to={ROUTE_PATH.ADD_BLOOD_DONATION_HISTORY}>Thêm túi máu</Link>
        ),
      },
    ],
  },
  {
    key: "3",
    icon: <AppstoreOutlined />,
    label: "Quản lý người dùng",
    children: [
      {
        key: ROUTE_PATH.USER,
        label: <Link to={ROUTE_PATH.USER}>Danh sách người dùng</Link>,
      },
    ],
  },
  {
    key: "4",
    icon: <AppstoreOutlined />,
    label: "Sự kiện hiến máu",
    children: [
      {
        key: ROUTE_PATH.EVENT_BLOOD_DONATION,
        label: (
          <Link to={ROUTE_PATH.EVENT_BLOOD_DONATION}>
            Danh sách sự kiện hiến máu
          </Link>
        ),
      },
      {
        key: ROUTE_PATH.EVENT_BLOOD_DONATION_ADD,
        label: (
          <Link to={ROUTE_PATH.EVENT_BLOOD_DONATION_ADD}>
            Thêm sự kiện hiến máu
          </Link>
        ),
      },
    ],
  },
  {
    key: "5",
    icon: <AppstoreOutlined />,
    label: "Đơn vị hiến máu",
    children: [
      {
        key: ROUTE_PATH.BLOOD_DONATION_UNITS,
        label: (
          <Link to={ROUTE_PATH.BLOOD_DONATION_UNITS}>
            Danh sách đơn vị hiến máu
          </Link>
        ),
      },
      {
        key: ROUTE_PATH.BLOOD_DONATION_UNITS_ADD,
        label: (
          <Link to={ROUTE_PATH.BLOOD_DONATION_UNITS_ADD}>
            Thêm đơn vị hiến máu
          </Link>
        ),
      },
    ],
  },
  // {
  //   key: "6",
  //   icon: <AppstoreOutlined />,
  //   label: "Kiểm tra sức khỏe",
  //   children: [
  //     {
  //       key: ROUTE_PATH.HEALTH_CHECK,
  //       label: (
  //         <Link to={ROUTE_PATH.HEALTH_CHECK}>Danh sách kiểm tra sức khỏe</Link>
  //       ),
  //     },
  //     {
  //       key: ROUTE_PATH.HEALTH_CHECK_ADD,
  //       label: (
  //         <Link to={ROUTE_PATH.HEALTH_CHECK_ADD}>
  //           Thêm thông tin kiểm tra sức khỏe
  //         </Link>
  //       ),
  //     },
  //   ],
  // },
  {
    key: "7",
    icon: <AppstoreOutlined />,
    label: "Cuộc hẹn",
    children: [
      {
        key: ROUTE_PATH.APPOINTMENTS_ADMIN,
        label: (
          <Link to={ROUTE_PATH.APPOINTMENTS_ADMIN}>Danh sách cuộc hẹn</Link>
        ),
      },
      // {
      //   key: ROUTE_PATH.APPOINTMENTS_ADMIN_ADD,
      //   label: (
      //     <Link to={ROUTE_PATH.APPOINTMENTS_ADMIN_ADD}>
      //       Thêm cuộc hẹn
      //     </Link>
      //   ),
      // },
    ],
  },
  {
    key: "8",
    icon: <AppstoreOutlined />,
    label: "Tin tức",
    children: [
      {
        key: ROUTE_PATH.NEWS_ADMIN,
        label: <Link to={ROUTE_PATH.NEWS_ADMIN}>Danh sách tin tức</Link>,
      },
      {
        key: ROUTE_PATH.NEWS_ADMIN_ADD,
        label: <Link to={ROUTE_PATH.NEWS_ADMIN_ADD}>Thêm tin tức</Link>,
      },
    ],
  },
  {
    key: "9",
    icon: <AppstoreOutlined />,
    label: "FAQs",
    children: [
      {
        key: ROUTE_PATH.FAQ_ADMIN,
        label: <Link to={ROUTE_PATH.FAQ_ADMIN}>Danh sách FAQ</Link>,
      },
      {
        key: ROUTE_PATH.FAQ_ADMIN_ADD,
        label: <Link to={ROUTE_PATH.FAQ_ADMIN_ADD}>Thêm FAQ</Link>,
      },
    ],
  },
];

const AdminLayout = () => {
  const [user, setUserData] = useState();
  const location = useLocation(); // Lấy URL hiện tại
  const username = localStorage.getItem("username");

  // Lấy danh sách menu con cần mở dựa trên đường dẫn hiện tại
  const getDefaultOpenKeys = () => {
    const openKeys = [];
    items.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.key === location.pathname) {
            openKeys.push(item.key);
          }
        });
      }
    });
    return openKeys;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserService.getYourProfile(username);
        setUserData(response.user);
        console.log("user", response.user)
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <Layout hasSider>
      <Sider
        className="!max-w-64 !w-64 overflow-auto h-screen fixed inset-y-0 left-0 scrollbar-thin"

      >
        <Link
          to={ROUTE_PATH.DASHBOARD}
          className="!text-white font-semibold h-16 flex items-center justify-center text-2xl"
        >
          <img
            alt=""
            className="w-100px h-100px object-cover p-8"
            src="/assets/img/logo-hutech.png"
          />
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // Đặt mục được chọn
          defaultOpenKeys={getDefaultOpenKeys()} // Mở các menu con mặc định
          items={items}
        />
      </Sider>

      <Layout className="ml-64 h-screen">
        <Header className="bg-white px-4 leading-normal flex items-center justify-end">
          <div className="text-right mr-1 p-1 px-4 text-weight ">
            {user ? (
              <>
                <p>{user.username || "Admin"}</p>
                <p>{user.email || "admin@gmail.com"}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </Header>

        <Content className="pt-6 px-4 overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
