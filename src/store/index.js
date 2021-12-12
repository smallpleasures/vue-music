import Vue from "vue";
import Vuex from "vuex";
import { requestWyy } from "../request/app";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 音乐的地址
    // 刷新之后播放器保留上一首
    musicUrl: sessionStorage.getItem("musicUrl"),
    // 将正在播放歌曲名存入seesion
    musicName: sessionStorage.getItem("musicName"),

    // 登入的相关信息
    login: {
      // 拿取session中的数据，转换成json
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      token: sessionStorage.getItem("token"),
      // 登录状态
      isLogin: sessionStorage.getItem("isLogin"),
    },
    ref: {
      audio: "",
      video: "",
    },
  },
  getters: {
    formatDate() {
      return function(val) {
        const all = val / 1000;
        const m = (parseInt(all / 60) + "").padStart(2, "0");
        const s = (parseInt(all % 60) + "").padStart(2, "0");
        return m + ":" + s;
      };
    },
    // 有参数具体到分秒，没有就分到日
    formatDay() {
      return function(val, str) {
        const dt = new Date(val);
        const year = (dt.getFullYear() + "").padStart(2, "0");
        const month = (dt.getMonth() + 1 + "").padStart(2, "0");
        const date = (dt.getDate() + "").padStart(2, "0");
        const hours = (dt.getHours() + "").padStart(2, "0");
        const minutes = (dt.getMinutes() + "").padStart(2, "0");
        const seconds = (dt.getSeconds() + "").padStart(2, "0");
        if (str == "xxxx-mm-dd") {
          return `${year}-${month}-${date}`;
        } else {
          return `${year}-${month}-${date}-${hours}:${minutes}:${seconds}`;
        }
      };
    },
  },
  actions: {
    // 异步操作写在actions里
    aPlay({ commit }, songMsg) {
      requestWyy({
        url: "/song/url",
        params: { id: songMsg.id },
      }).then(({ data: { data } }) => {
        commit("PLAY", { data, name: songMsg.name });
      });
    },
  },
  mutations: {
    // 播放歌曲
    PLAY(state, obj) {
      const { data, name } = obj;
      if (data[0].url) {
        // 将正在播放歌曲名存入seesion
        sessionStorage.setItem("musicName", name);
        // 播放歌曲后，将网页标题改成歌曲名
        state.musicName = name;
        // 刷新之后播放器保留上一首
        sessionStorage.setItem("musicUrl", data[0].url);
        state.musicUrl = data[0].url;
      } else {
        this.$message.error("无版权");
      }
    },
    // audio播放
    playAudio(state) {
      document.title = `▶ ${state.musicName}`;
      // 音乐播放暂停mv
      if (state.ref.video) {
        state.ref.video.pause();
      }
    },
    // video播放
    playVideo(state) {
      // mv播放暂停音乐
      if (state.ref.audio) {
        state.ref.audio.pause();
      }
    },
    // 登录
    logIn(state) {
      state.login.isLogin = true;
      sessionStorage.setItem("isLogin", true);
    },
    // 登出
    logOut(state) {
      state.login.isLogin = false;
      sessionStorage.removeItem("isLogin");
    },
  },

  modules: {},
});
