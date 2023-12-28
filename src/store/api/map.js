import axios from "axios";

const mapApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_API + "/map",
});

mapApi.interceptors.request.use((req) => {
  const { token } = JSON.parse(localStorage.getItem("user"));
  req.headers.Authorization = "Bearer " + token;
  return req;
});

export { mapApi };
