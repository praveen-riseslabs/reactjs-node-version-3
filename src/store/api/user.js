import axios from "axios";

const userApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_API,
});

const authApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_API,
});

authApi.interceptors.response.use((response) => {
  const user = JSON.stringify({
    userId: response.data?.userId,
    token: response.data?.token,
  });
  localStorage.setItem("user", user);
  return response;
});

export { userApi, authApi };
