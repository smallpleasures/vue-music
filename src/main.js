import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "../src/assets/css/player.css";

Vue.config.productionTip = false;

window.vue = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
