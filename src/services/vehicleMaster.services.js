import API from "./api";

// Vehicle Brands
export const getVehicleBrandsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/vehicle-brands", {
    params: { page, limit },
  });

  return data;
};



export const createVehicleBrandApi = async (payload) => {
  console.log(payload)
  const { data } = await API.post("/admins/vehicle-brands", payload);
  return data;
};

export const updateVehicleBrandApi = async ({ id, ...payload }) => {
  const { data } = await API.patch(`/admins/vehicle-brands/${id}`, payload);
  return data;
};

export const updateVehicleBrandStatusApi = async ({ id, status }) => {
  const { data } = await API.patch(`/admins/vehicle-brands/${id}/status`, {
    status,
  });
  return data;
};

// Vehicle Colors
export const getVehicleColorsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/vehicle-colors", {
    params: { page, limit },
  });
  return data;
};

export const createVehicleColorApi = async (payload) => {
  const { data } = await API.post("/admins/vehicle-colors", payload);
  return data;
};

export const updateVehicleColorApi = async ({ id, ...payload }) => {
  const { data } = await API.patch(`/admins/vehicle-colors/${id}`, payload);
  return data;
};

export const updateVehicleColorStatusApi = async ({ id, status }) => {
  const { data } = await API.patch(`/admins/vehicle-colors/${id}/status`, {
    status,
  });
  return data;
};

// Vehicle Types
export const getVehicleTypesApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/vehicle-types", {
    params: { page, limit },
  });
  return data;
};

// Vehicle Models
export const getVehicleModelsApi = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await API.get("/admins/vehicle-models", {
    params: { page, limit },
  });
  return data;
};

export const getVehicleModelByIdApi = async (id) => {
  const { data } = await API.get(`/admins/vehicle-models/${id}`);
  return data;
};

export const createVehicleModelApi = async (payload) => {
  const { data } = await API.post("/admins/vehicle-models", payload);
  return data;
};

export const updateVehicleModelApi = async ({ id, ...payload }) => {
  const { data } = await API.patch(`/admins/vehicle-models/${id}`, payload);
  return data;
};

export const updateVehicleModelStatusApi = async ({ id, status }) => {
  const { data } = await API.patch(`/admins/vehicle-models/${id}/status`, {
    status,
  });
  return data;
};
