import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 8000
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (res) => {
    if (res.config.responseType === "blob") return res;
    const body = res.data;
    if (body && Object.prototype.hasOwnProperty.call(body, "code")) {
      if (body.code !== 0) return Promise.reject(new Error(body.message || "请求失败"));
      res.data = body.data;
      res.message = body.message;
    }
    return res;
  },
  (err) => {
    const msg = err?.response?.data?.message || "请求失败";
    return Promise.reject(new Error(msg));
  }
);

export default request;
