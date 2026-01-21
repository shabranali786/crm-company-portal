import axios from "axios";

const ApiAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default ApiAxios;
