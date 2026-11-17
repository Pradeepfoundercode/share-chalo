import API from "./api";

// ==========================================
// POLICIES (PRIVACY POLICY) APIs
// ==========================================

// GET List Policies
export const getPoliciesApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/policies", {
    params: { page, limit },
  });
  return data;
};

// POST Create Policy
export const createPolicyApi = async (payload) => {
  const { data } = await API.post("/admins/policies", payload);
  return data;
};

// GET Single Policy By ID
export const getPolicyByIdApi = async (id) => {
  const { data } = await API.get(`/admins/policies/${id}`);
  return data;
};

// PATCH Edit Policy
export const updatePolicyApi = async ({ id, ...payload }) => {
  const { data } = await API.patch(`/admins/policies/${id}`, payload);
  return data;
};

// PATCH Update Policy Status (active / inactive)
export const updatePolicyStatusApi = async ({ id, status }) => {
  const { data } = await API.patch(`/admins/policies/${id}/status`, { status });
  return data;
};

// DELETE Policy
export const deletePolicyApi = async (id) => {
  const { data } = await API.delete(`/admins/policies/${id}`);
  return data;
};
