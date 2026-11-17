import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  loginApi,
  getProfileApi,
  updateProfileApi,
} from "../services/auth.services";

import { useAuthStore } from "../store/authStore";

// Login API
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await loginApi(credentials);

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    },

    onSuccess: (response) => {
      const { token, user } = response.data;
      login(user, token);
    },
  });
};

// Get Admin Profile API
export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: getProfileApi,
    enabled,
  });
};

// Update Admin Profile API
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateAdmin = useAuthStore((state) => state.updateAdmin);

  return useMutation({
    mutationFn: updateProfileApi,

    onSuccess: (response) => {
      if (response.success && response.data) {
        // Update React Query cache
        queryClient.setQueryData(
          ["admin-profile"],
          response.data
        );

        // Update Zustand admin state
        updateAdmin(response.data);
      }
    },
  });
};