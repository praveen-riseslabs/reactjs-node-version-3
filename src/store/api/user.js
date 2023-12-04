import axios from "axios";

const userApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_API,
});

export { userApi };
