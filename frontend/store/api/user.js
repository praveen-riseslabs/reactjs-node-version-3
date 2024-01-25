import axios from "axios";

const userApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_BASE_URL + "/api/v1/user",
});


export { userApi };
