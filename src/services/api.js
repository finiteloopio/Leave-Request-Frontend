import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use(
  (config) => {
    // --- DEBUGGING LOG ---
    console.log("API Interceptor: Preparing to send a request to:", config.url);

    const token = localStorage.getItem("token");
    const userSession = JSON.parse(localStorage.getItem("user"));

    if (token) {
      // --- DEBUGGING LOG ---
      console.log(
        "API Interceptor: Found token, attaching it to the Authorization header."
      );
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      // --- DEBUGGING LOG ---
      console.log("API Interceptor: No token found in localStorage.");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
