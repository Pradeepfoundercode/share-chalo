import API from "./api";


export const getDriversApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/drivers", {
    params: { page, limit },
  });
  return data;
};

export const getDriverByIdApi = async (driverId) => {
  const { data } = await API.get(`/admins/drivers/${driverId}`);
  return data;
};

// ========================================
// GET DRIVER RIDE HISTORY API
// ========================================
export const getDriverRideHistoryApi = async (
  driverId,
  { page = 1, limit = 20, status = "all" } = {}
) => {
  const { data } = await API.get(`/admins/drivers/${driverId}/ride-history`, {
    params: { page, limit, status },
  });
  return data;
};

// ========================================
// DRIVER VERIFICATION REVIEWS (PATCH)
// ========================================
export const reviewDriverProfileApi = async (driverId, payload = { action: "approved" }) => {
  const { data } = await API.patch(`/admins/drivers/${driverId}/profile/review`, payload);
  return data;
};

export const reviewDriverKycApi = async (driverId, payload = { action: "approved" }) => {
  const { data } = await API.patch(`/admins/drivers/${driverId}/kyc/review`, payload);
  return data;
};

export const reviewDriverVehicleApi = async (driverId, payload = { action: "approved" }) => {
  const { data } = await API.patch(`/admins/drivers/${driverId}/vehicle/review`, payload);
  return data;
};
