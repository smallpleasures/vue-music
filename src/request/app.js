import axios from "axios";
import router from "../router";
import { Message } from "element-ui";
export function requestWyy(config) {
  // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

  const instance = axios.create({
    baseURL: "http://1.15.155.218:8088/",
  });
  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      // console.log(config);
      return config;
    },
    (error) => {
      Message.error({ message: "请求超时!" });
      return Promise.reject(error);
    }
  );
  // 响应拦截
  instance.interceptors.response.use((response) => {
    //和后端token失效返回码约定403
    if (response.data.code == 403) {
      // 引用elementui message提示框
      Message.error({ message: "身份失效!" });
      //清除token
      sessionStorage.removeItem("token");
      //跳转
      router.push("/login");
    } else {
      return response;
    }
  });

  return instance(config);
}
