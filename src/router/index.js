import Vue from "vue";
import VueRouter from "vue-router";
// 引入路由组件
import routes from "./home.js";
import store from "../store";
import { Message } from "element-ui";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});
// 路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.login.token;
  if (to.path == "/myhome") {
    if (token) {
      next();
    } else {
      Message.error({ message: "请先登录!" });
      next("/login");
    }
  } else {
    next();
  }
});
export default router;
