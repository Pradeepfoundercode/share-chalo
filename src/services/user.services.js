import API from "./api";

// ========================================
// USERS / PASSENGERS SERVICES
// ========================================

export const getUsersApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/users", { params: { page, limit } });
  return data;
};

export const getUserByIdApi = async (userId) => {
  const { data } = await API.get(`/admins/users/${userId}`);
  return data;
};

export const updateUserStatusApi = async ({ userId, status }) => {
  const { data } = await API.patch(`/admins/users/${userId}/status`, { status });
  return data;
};
