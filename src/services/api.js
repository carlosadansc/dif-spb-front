import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/",
});


export default instance
