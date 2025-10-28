import axiosInstance from "./axios.customize";
import axios from "axios";

const EXTERNAL_API_BASE = "http://10.1.24.54/api";

export const quizService = {
  uploadDocument: async (file: File) => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("document", file);

      const response = await axios.post(
        `${EXTERNAL_API_BASE}/quiz/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
      throw new Error(errorMessage);
    }
  },

  createQuiz: async (title: string, language: string = 'vi') => {
    try {
      const response = await axiosInstance.post("/quiz/create", {
        title,
        language,
      });
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create quiz";
      throw new Error(errorMessage);
    }
  },

  getQuizzes: async () => {
    try {
      const response = await axiosInstance.get("/quiz/list");
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get quizzes";
      throw new Error(errorMessage);
    }
  },
};

