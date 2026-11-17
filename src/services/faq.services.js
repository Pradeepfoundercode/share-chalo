import API from "./api";

// ==========================================
// FAQS (FREQUENTLY ASKED QUESTIONS) APIs
// ==========================================

// GET List FAQs
export const getFaqsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/faqs", {
    params: { page, limit },
  });
  return data;
};

// POST Create FAQ
export const createFaqApi = async (payload) => {
  const { data } = await API.post("/admins/faqs", payload);
  return data;
};

// GET Single FAQ By ID
export const getFaqByIdApi = async (id) => {
  const { data } = await API.get(`/admins/faqs/${id}`);
  return data;
};

// PATCH Edit FAQ
export const updateFaqApi = async ({ id, ...payload }) => {
  const { data } = await API.patch(`/admins/faqs/${id}`, payload);
  return data;
};

// PATCH Update FAQ Status (active / inactive)
export const updateFaqStatusApi = async ({ id, status }) => {
  const { data } = await API.patch(`/admins/faqs/${id}/status`, { status });
  return data;
};

// PATCH Set FAQ Inactive
export const setFaqInactiveApi = async (id) => {
  const { data } = await API.patch(`/admins/faqs/${id}/inactive`);
  return data;
};

// PATCH Set FAQ Active
export const setFaqActiveApi = async (id) => {
  const { data } = await API.patch(`/admins/faqs/${id}/active`);
  return data;
};

// DELETE FAQ
export const deleteFaqApi = async (id) => {
  const { data } = await API.delete(`/admins/faqs/${id}`);
  return data;
};
