import axios from "axios";

const EXTERNAL_API_BASE = "http://10.1.24.54/api";

export const chatService = {
  sendMessage: async (message: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(`${EXTERNAL_API_BASE}/chat/message`, {
        message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || "Failed to send message");
    }
  },
};

