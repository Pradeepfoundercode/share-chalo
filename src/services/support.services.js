import API from "./api";

// ========================================
// SUPPORT & COMPLAINTS SERVICES
// ========================================

export const getSupportTicketsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/support-tickets", {
    params: { page, limit },
  });
  return data;
};

export const getSupportTicketByIdApi = async (ticketId) => {
  const { data } = await API.get(`/admins/support-tickets/${ticketId}`);
  return data;
};
