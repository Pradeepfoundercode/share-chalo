import API from "./api";

// ==========================================
// COMMISSION SETTINGS APIs
// ==========================================

// GET Commission Settings
export const getCommissionSettingsApi = async () => {
  const { data } = await API.get("/admins/commission-settings");
  return data;
};

// UPDATE Commission Settings
export const updateCommissionSettingsApi = async (payload) => {
  try {
    const { data } = await API.patch("/admins/commission-settings", payload);
    return data;
  } catch (error) {
    if (error.response?.status === 405 || error.response?.status === 404) {
      const { data } = await API.put("/admins/commission-settings", payload);
      return data;
    }
    throw error;
  }
};

