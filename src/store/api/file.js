import axios from "axios";

const fileApi = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_API + "/file",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export { fileApi };
