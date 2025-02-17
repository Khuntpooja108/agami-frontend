import axios from "axios";

const port = 3000;
const axiosObj = axios.create({
    baseURL: `http://localhost:${port}`,
});

axiosObj.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Please login first!");
            window.location.href = "/login";
            return Promise.reject("No token found, redirecting to login.");
        }

        config.headers["access-token"] = token;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosObj.interceptors.response.use(
  (response) => {
      console.log("Response Interceptor Running...");
      return response; 
  },
  async (error) => {
      console.log("Response Interceptor Error:", error.response?.status);

      if (error.response?.status === 403) {
          console.log("🔄 Token Expired, Refreshing...");

          const refreshToken = localStorage.getItem("refreshToken");
          console.log("from refreshtoken ",refreshToken);
          

          if (!refreshToken) {
              alert("Session expired. Please log in again.");
              window.location.href = "/login";
              return Promise.reject("No refresh token, redirecting to login.");
          }

          try {
              const { data } = await axios.post(`http://localhost:${port}/auth/generate-access-token`, {
                  refreshToken,
              });

              const newAccessToken = data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);

              error.config.headers["access-token"] = newAccessToken;
              return axiosObj(error.config);
          } catch (refreshError) {
              alert("Session expired. Please log in again.");
              window.location.href = "/login";
              return Promise.reject(refreshError);
          }
      }

      return Promise.reject(error);
  }
);


export default axiosObj;


/* import axios from "axios";

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

export default axiosObj      */