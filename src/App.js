import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTE_PATH } from "./constants/routes";
import Home from "./pages/Home/Home";
import ClientLayout from "./layouts/ClientLayout/ClientLayout";
import Appointments from "./pages/Appointments/Appointments";
import Faq from "./pages/FAQ/Faq";
import Booking from "./pages/Booking/Booking";
import Certificate from "./pages/Certificate/certificate";
import HistoryAppoint from "./pages/HistoryAppoint/HistoryAppoint";
import News from "./pages/News/News";
import Contact from "./pages/Contact/Contact";
import Settings from "./pages/Account/Settings";
import Profile from "./pages/Account/Profile";
import Events from "./pages/Events/Events";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AppointmentDetail from "./pages/HistoryAppoint/AppointmentDetail";

import BloodDonationHistoryList from "./pages/Admin/BloodDonationHistories/BloodDonationHistoryList/BloodDonationHistoryList";
import BloodDonationHistoryEdit from "./pages/Admin/BloodDonationHistories/BloodDonationHistoryEdit/BloodDonationHistoryEdit";
import BloodDonationHistoriesAdd from "./pages/Admin/BloodDonationHistories/BloodDonationHistoriesAdd/BloodDonationHistoriesAdd";

import ListUser from "./pages/Admin/UserManagement/ListUser/ListUser";
import AddUser from "./pages/Admin/UserManagement/AddUser/AddUser";
import EditUser from "./pages/Admin/UserManagement/EditUser/EditUser";

import EventBloodDonationList from "./pages/Admin/EventBloodDonation/EventBloodDonationList/EventBloodDonationList";
import EventBloodDonationAdd from "./pages/Admin/EventBloodDonation/EventBloodDonationAdd/EventBloodDonationAdd";
import EventBloodDonationEdit from "./pages/Admin/EventBloodDonation/EventBloodDonationEdit/EventBloodDonationEdit";

import BloodDonationUnitsList from "./pages/Admin/BloodDonationUnits/BloodDonationUnitsList/BloodDonationUnitsList";
import BloodDonationUnitsAdd from "./pages/Admin/BloodDonationUnits/BloodDonationUnitsAdd/BloodDonationUnitsAdd";
import BloodDonationUnitsEdit from "./pages/Admin/BloodDonationUnits/BloodDonationUnitsEdit/BloodDonationUnitsEdit";
import ClientHeader from "./layouts/ClientLayout/ClientHeader";

import LoginPage from "./pages/auth/LoginPage";
import RegistrationPage from "./pages/auth/RegistrationPage";
import { AdminRoute, GuestRoute } from "./components/HOC";

import EmailSending from "./pages/Password/EmailSending";
import ResetPasswordPage from "./pages/Password/ResetPasswordPage";
import HealthCheckList from "./pages/Admin/HealthCheck/HealthCheckList/HealthCheckList";
import HealthCheckAdd from "./pages/Admin/HealthCheck/HealthCheckAdd/HealthCheckAdd";
import HealthCheckEdit from "./pages/Admin/HealthCheck/HealthCheckEdit/HealthCheckEdit";

import AppointmentList from "./pages/Admin/AppointmentAdmin/AppointmentAdminList/AppointmentList";
import AppointmentAdd from "./pages/Admin/AppointmentAdmin/AppointmentAdminAdd/AppointmentAdd";
import AppointmentEdit from "./pages/Admin/AppointmentAdmin/AppointmentAdminEdit/AppointmentEdit";

import NewsList from "./pages/Admin/NewsAdmin/NewsList/NewsList";
import NewsAdd from "./pages/Admin/NewsAdmin/NewsAdd/NewsAdd";
import NewsEdit from "./pages/Admin/NewsAdmin/NewsEdit/NewsEdit";

import FAQList from "./pages/Admin/FAQAdmin/FAQList/FAQList";
import FAQAdd from "./pages/Admin/FAQAdmin/FAQAdd/FAQAdd";
import FAQEdit from "./pages/Admin/FAQAdmin/FAQEdit/FAQEdit";
const App = () => {
  const router = createBrowserRouter([
    {
      path: ROUTE_PATH.HOME,
      element: <ClientLayout />,
      children: [
        {
          path: ROUTE_PATH.FORGOT,
          element: <EmailSending />,
        },
        {
          path: ROUTE_PATH.RESETPASSWORD,
          element: <ResetPasswordPage />,
        },
        {
          path: ROUTE_PATH.HOME,
          element: <Home />,
        },
        {
          path: ROUTE_PATH.APPOINTMENTS,
          element: <Appointments />,
        },
        {
          path: ROUTE_PATH.HISTORYAPPOINT_DETAIL(":id"),
             element: <AppointmentDetail />,
        }, 
        {
          path: ROUTE_PATH.BOOKING,
          element: <Booking />,
        },
        {
          path: ROUTE_PATH.FAQ,
          element: <Faq />,
        },
        {
          path: ROUTE_PATH.CERTIFICATE,
          element: <Certificate />,
        },
        {
          path: ROUTE_PATH.HISTORYAPPOINT,
          element: <HistoryAppoint />,
        },
        {
          path: ROUTE_PATH.NEWS,
          element: <News />,
        },
        {
          path: ROUTE_PATH.CONTACT,
          element: <Contact />,
        },
        {
          path: ROUTE_PATH.SETTINGS,
          element: <Settings />,
        },
        {
          path: ROUTE_PATH.PROFILE,
          element: <Profile />,
        },
        {
          path: ROUTE_PATH.LOGOUT,
          element: <logout />,
        },
        {
          path: ROUTE_PATH.LOGIN,
          element: <GuestRoute element={<LoginPage />} />,
        },

        {
          path: ROUTE_PATH.REGISTRATION,
          element: <RegistrationPage />,
        },

        {
          path: ROUTE_PATH.EVENTS,
          element: <Events />,
        },
      ],
    },

    {
      // Component: AdminRoute,
      path: ROUTE_PATH.DASHBOARD,
      element: <AdminRoute />,
      //Đây là đoạn code phân quyền!!!
      children: [
        {
          element: <AdminLayout />, // AdminLayout bao quanh các trang

          children: [
            {
              path: "",
              element: <Dashboard />,
            },
            {
              path: ROUTE_PATH.BLOOD_DONATION_HISTORY,
              element: <BloodDonationHistoryList />,
            },
            {
              path: ROUTE_PATH.ADD_BLOOD_DONATION_HISTORY,
              element: <BloodDonationHistoriesAdd />,
            },
            {
              path: ROUTE_PATH.EDIT_BLOOD_DONATION_HISTORY(":id"),
              element: <BloodDonationHistoryEdit />,
            },

            {
              path: ROUTE_PATH.USER,
              element: <ListUser />,
            },
            {
              path: ROUTE_PATH.ADD_USER,
              element: <AddUser />,
            },
            {
              path: ROUTE_PATH.EDIT_USER(":username"),
              element: <EditUser />,
            },

            {
              path: ROUTE_PATH.EVENT_BLOOD_DONATION,
              element: <EventBloodDonationList />,
            },
            {
              path: ROUTE_PATH.EVENT_BLOOD_DONATION_ADD,
              element: <EventBloodDonationAdd />,
            },
            {
              path: ROUTE_PATH.EVENT_BLOOD_DONATION_EDIT(":id"),
              element: <EventBloodDonationEdit />,
            },

            {
              path: ROUTE_PATH.BLOOD_DONATION_UNITS,
              element: <BloodDonationUnitsList />,
            },
            {
              path: ROUTE_PATH.BLOOD_DONATION_UNITS_ADD,
              element: <BloodDonationUnitsAdd />,
            },
            {
              path: ROUTE_PATH.BLOOD_DONATION_UNITS_EDIT(":id"),
              element: <BloodDonationUnitsEdit />,
            },

            {
              path: ROUTE_PATH.HEALTH_CHECK,
              element: <HealthCheckList />,
            },
            {
              path: ROUTE_PATH.HEALTH_CHECK_ADD,
              element: <HealthCheckAdd />,
            },
            {
              path: ROUTE_PATH.HEALTH_CHECK_EDIT(":id"),
              element: <HealthCheckEdit />,
            },

            {
              path: ROUTE_PATH.APPOINTMENTS_ADMIN,
              element: <AppointmentList />,
            },
            {
              path: ROUTE_PATH.APPOINTMENTS_ADMIN_ADD,
              element: <AppointmentAdd />,
            },
            {
              path: ROUTE_PATH.APPOINTMENTS_ADMIN_EDIT(":id"),
              element: <AppointmentEdit />,
            },

            {
              path: ROUTE_PATH.NEWS_ADMIN,
              element: <NewsList />,
            },
            {
              path: ROUTE_PATH.NEWS_ADMIN_ADD,
              element: <NewsAdd />,
            },
            {
              path: ROUTE_PATH.NEWS_ADMIN_EDIT(":id"),
              element: <NewsEdit />,
            },

            {
              path: ROUTE_PATH.FAQ_ADMIN,
              element: <FAQList />,
            },
            {
              path: ROUTE_PATH.FAQ_ADMIN_ADD,
              element: <FAQAdd />,
            },
            {
              path: ROUTE_PATH.FAQ_ADMIN_EDIT(":id"),
              element: <FAQEdit />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
