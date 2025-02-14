import axios from "axios";

const port = 3000
const axiosObj = axios.create({
    baseURL: `http://localhost:${port}`,
});


axiosObj.interceptors.request.use(
  (config) => {
    // console.log("Interceptors is runnig..")
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.log("Interceptors is runnig..2")

      alert("Please login first!");
      window.location.href = "/login"; 
      return Promise.reject("No token found, redirecting to login.");
    }

    config.headers["access-token"] = token;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosObj     