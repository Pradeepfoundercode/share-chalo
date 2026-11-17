
import API from "./api";

export const loginApi = async (credentials) => {
  const { data } = await API.post(
    "/auth/admin/login",
    credentials
  );

  return data;
};


export const updateProfileApi = async (payload) => {
  const { data } = await API.patch("/admins/me", payload);
  return data;
};

export const getProfileApi = async () => {
  const { data } = await API.get("/admins/me");
  console.log(data, "data")
  return data;
};
