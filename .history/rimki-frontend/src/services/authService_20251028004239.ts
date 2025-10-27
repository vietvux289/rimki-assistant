import axiosInstance from "./axios.customize";

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.clear();
  },

  getProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get profile");
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("access_token");
    return token && token !== "undefined" && token.trim() !== "";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

