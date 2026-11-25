import API from "./api";

// ==========================================
// FINANCE & WALLETS APIs
// ==========================================

// GET Finance Overview
export const getFinanceOverviewApi = async (params) => {
  const { data } = await API.get("/admins/finance", { params });
  return data;
};
