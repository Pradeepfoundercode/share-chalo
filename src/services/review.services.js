import API from "./api";

// ==========================================
// REVIEWS & RATINGS APIs
// ==========================================

// GET Reviews List
export const getReviewsApi = async (params = {}) => {
  const { data } = await API.get("/admins/reviews", { params });
  return data;
};
