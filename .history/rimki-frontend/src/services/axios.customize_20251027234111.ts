import axios from "axios";
import { message } from "antd";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('access_token');
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response?.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    
    // For login errors, don't redirect
    const isLoginEndpoint = error?.config?.url?.includes('/auth/login');
    
    if (error?.response?.status === 401 && !isLoginEndpoint) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      message.error('Session expired. Please login again.');
      window.location.href = '/login';
    }
    
    // Reject the promise with the error
    return Promise.reject(error);
  }
);


export default instance;