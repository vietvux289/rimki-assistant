import axiosInstance from "./axios.customize";

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      
      // Check for error response
      if (response.message && !response.token) {
        throw new Error(response.message || "Login failed");
      }
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
      
      return response;
    } catch (error: any) {
      // Check if it's an error response with message
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
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
    return !!localStorage.getItem("access_token");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

