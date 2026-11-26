import API from "./api";

// ==========================================
// NOTIFICATIONS APIs
// ==========================================

// GET Notifications list
export const getNotificationsApi = async (params) => {
  const { data } = await API.get("/admins/notifications", { params });
  return data;
};

// GET Notification by ID
export const getNotificationByIdApi = async (notifId) => {
  const { data } = await API.get(`/admins/notifications/${notifId}`);
  return data;
};

// POST Create Notification
export const createNotificationApi = async (payload) => {
  const { data } = await API.post("/admins/notifications", payload);
  return data;
};
