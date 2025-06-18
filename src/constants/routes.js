export const ROUTE_PATH = {
  HOME: "/",
  APPOINTMENTS: "/appointments",
  FAQ: "/faq",
  BOOKING: "/appointments/booking",
  CERTIFICATE: "/certificate",
  HISTORYAPPOINT: "/historyappoint",
  HISTORYAPPOINT_DETAIL: (id) => `/historyappoint/${id}`,
  NEWS: "/news",
  CONTACT: "/contact",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGOUT: "/logout",
  LOGIN: "/login",
  REGISTRATION: "/register",
  FORGOT: "/forgot",
  EVENTS: "/events",
  RESETPASSWORD:"/reset-password" ,
  // Admin
  DASHBOARD: "/admin",


  BLOOD_DONATION_HISTORY: "/admin/blood-donation-history",
  ADD_BLOOD_DONATION_HISTORY: "/admin/blood-donation-history/add",
  EDIT_BLOOD_DONATION_HISTORY: (param) =>
    `/admin/blood-donation-history/${param}/edit`,

  USER: "/admin/user",
  ADD_USER: "/admin/user/add",
  EDIT_USER: (param) => `/admin/user/${param}/edit`,  
  
  EVENT_BLOOD_DONATION: "/admin/event-blood-donation",
  EVENT_BLOOD_DONATION_ADD: "/admin/event-blood-donation/add",
  EVENT_BLOOD_DONATION_EDIT: (param) =>
    `/admin/event-blood-donation/${param}/edit`,

  BLOOD_DONATION_UNITS: "/admin/blood-donation-units",
  BLOOD_DONATION_UNITS_ADD: "/admin/blood-donation-units/add",
  BLOOD_DONATION_UNITS_EDIT: (param) =>
    `/admin/blood-donation-units/${param}/edit`,

  HEALTH_CHECK: "/admin/health-check",
  HEALTH_CHECK_ADD: "/admin/health-check/add",
  HEALTH_CHECK_EDIT: (param) =>
    `/admin/health-check/${param}/edit`,

  APPOINTMENTS_ADMIN: "/admin/appointments",
  APPOINTMENTS_ADMIN_ADD: "/admin/appointments/add",
  APPOINTMENTS_ADMIN_EDIT: (param) =>
    `/admin/appointments/${param}/edit`,

  NEWS_ADMIN: "/admin/news",
  NEWS_ADMIN_ADD: "/admin/news/add",
  NEWS_ADMIN_EDIT: (param) =>
    `/admin/news/${param}/edit`,

  FAQ_ADMIN: "/admin/faqs",
  FAQ_ADMIN_ADD: "/admin/faqs/add",
  FAQ_ADMIN_EDIT: (param) =>
    `/admin/faqs/${param}/edit`,
};
