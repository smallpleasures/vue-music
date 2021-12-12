<template>
  <div class="top">
    <div class="logo">
      Music
      <span>Hub</span>
    </div>
    <div class="histroy">
      <span class="el-icon-arrow-left" @click="back"></span>
      <span class="el-icon-arrow-right" @click="forward"></span>
    </div>
    <el-input
      type="text"
      class="search"
      v-model="inputVal"
      @keyup.enter.native="toResult"
      placeholder="请输入歌名或歌手"
      prefix-icon="el-icon-search"
      size="small"
      clearable
    ></el-input>
    <div v-if="$store.state.login.isLogin" class="user">
      <!-- 登入成功后显示这个 -->
      <el-dropdown>
        <span class="el-dropdown-link pointer">
          <img
            @click="myHome"
            :src="$store.state.login.userInfo.avatarUrl"
            alt=""
          />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            >欢迎你，{{
              $store.state.login.userInfo.nickname
            }}</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-user" @click.native="myHome"
            >我的主页</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-switch-button" @click.native="outUser"
            >退出</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-button class="login" type="primary" @click="toLogin" size="mini" v-else
      >登入</el-button
    >
    <!-- <button @click="test">test</button> -->
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "Top",

  data() {
    return {
      // 搜索的关键词
      inputVal: sessionStorage.getItem("inputVal"),
      // 当前登录状态，因为要v-if显示隐藏
    };
  },
  watch: {},
  methods: {
    // 前进后退
    back() {
      this.$router.back();
    },
    forward() {
      this.$router.forward();
    },
    toResult() {
      // 非空判断
      if (this.inputVal.trim()) {
        sessionStorage.setItem("inputVal", this.inputVal);

        this.$router.push({
          name: "Result",
          query: {
            // 发送搜索词给result
            title: this.inputVal,
          },
        });
      } else {
        this.$message.warning("请输入信息");
      }
    },

    toLogin() {
      // 跳转登入页面
      this.$router.replace("/login");
    },

    // 用户退出
    outUser() {
      this.$confirm("确定退出账号吗?", "提示", {
        confirmButtonText: "对",
        cancelButtonText: "手滑了",
        type: "warning",
      })
        .then(() => {
          requestWyy({
            url: "/logout",
          });
          // 登录状态取消

          this.$store.commit("logOut");

          // 退出
          this.$store.state.login.userInfo = [];
          this.$store.state.login.token = "";
          sessionStorage.removeItem("userInfo");
          sessionStorage.removeItem("token");
          // // 跳转到首页
          this.$router.replace("/discover");
          this.$message({
            type: "success",
            message: "你成功退出！",
          });
          // this.$router.go(0);
        })
        .catch(() => {
          // 取消退出
          this.$message({
            type: "info",
            message: "没退呢",
          });
        });
    },
    // 用户主页
    myHome() {
      this.$router.push({
        path: "/myhome",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.top {
  position: relative;
  min-width: 1200px;
  min-height: 60px;
  height: 10%;
  display: flex;
  align-items: center;
  background-color: rgb(249, 249, 249);
  .logo {
    margin-left: 10px;
    background-color: rgb(55, 55, 55);
    border-radius: 10px;
    width: 120px;
    height: 50px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 550;
    span {
      background-color: #409eff;
      color: #000;
      border-radius: 10px;
      padding: 5px;
    }
  }
  .histroy {
    position: absolute;
    top: 50%;
    left: 150px;

    span {
      font-size: 20px;
      margin-right: 15px;
      padding: 5px;
      border-radius: 100px;
      background-color: rgb(237, 237, 237);

      &:hover {
        cursor: pointer;
        background-color: #ccc;
      }
    }
  }
  .search {
    position: absolute;
    right: 100px;
    width: 200px;
  }
  .login,
  .user {
    position: absolute;
    right: 40px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 100px;
    }
  }
}
</style>