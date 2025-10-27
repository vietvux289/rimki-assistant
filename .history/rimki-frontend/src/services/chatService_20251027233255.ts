import axiosInstance from "./axios.customize";

export const chatService = {
  sendMessage: async (message: string) => {
    try {
      const response = await axiosInstance.post("/chat/message", {
        message,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to send message");
    }
  },
};

