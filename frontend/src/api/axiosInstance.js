import axios from "axios";
import { URL } from "../config"; // Update if needed

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true, // <- Important
});

export default axiosInstance;
