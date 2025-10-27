import axiosInstance from "./axios.customize";
import axios from "axios";

export const quizService = {
  uploadDocument: async (file: File) => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("document", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/quiz/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload document");
    }
  },

  createQuiz: async (title: string, questions: any[] = []) => {
    try {
      const response = await axiosInstance.post("/quiz/create", {
        title,
        questions,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to create quiz");
    }
  },

  getQuizzes: async () => {
    try {
      const response = await axiosInstance.get("/quiz/list");
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get quizzes");
    }
  },
};

