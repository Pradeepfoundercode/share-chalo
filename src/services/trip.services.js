import API from "./api";

// ========================================
// TRIPS / RIDES SERVICES
// ========================================

export const getTripsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/trips", {
    params: { page, limit },
  });
  return data;
};

export const getTripByIdApi = async (tripId) => {
  const { data } = await API.get(`/admins/trips/${tripId}`);
  return data;
};
