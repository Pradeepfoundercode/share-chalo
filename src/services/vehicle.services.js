import API from "./api";

// ==========================================
// VEHICLES APIs
// ==========================================

// GET Vehicles list with pagination & optional filters
export const getVehiclesApi = async (params = {}) => {
  const { data } = await API.get("/admins/vehicles", { params });
  return data;
};

// GET Single Vehicle Details by ID
export const getVehicleByIdApi = async (vehicleId) => {
  const { data } = await API.get(`/admins/vehicles/${vehicleId}`);
  return data;
};
