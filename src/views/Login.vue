<template>
  <div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="loginContainer"
      :rules="rules"
    >
      <h3 class="loginTitle">登入网易云音乐</h3>
      <!-- 登入相关输入框 -->
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="loginForm.username"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="checked" class="loginRemember"
          >记住我</el-checkbox
        >
        <el-button type="primary" style="width: 100%" @click="submitLogin"
          >登入</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { requestWyy } from "../request/app";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: localStorage.getItem("phone"),
        password: localStorage.getItem("pwd"),
      },
      //   表单验证
      rules: {
        username: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            type: "string",
            message: "请输入正确的手机号",
            len: 11,
            trigger: "blur",
          },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      // 记住用户
      checked: true,
    };
  },
  methods: {
    submitLogin() {
      // 表单验证
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // 调用请求
          requestWyy({
            url: "/login/cellphone",
            params: {
              phone: this.loginForm.username,
              password: this.loginForm.password,
            },
          })
            .then(({ data }) => {
              if (data.code == 200) {
                this.$message.success("登入成功");
                // 把登录状态变成true
                this.$store.commit("logIn");
                // 保存token
                this.$store.state.login.token = data.token;
                sessionStorage.setItem("token", this.$store.state.login.token);
                // 把用户信息存放到userInfo和session中;
                this.$store.state.login.userInfo = data.profile;
                sessionStorage.setItem("userInfo", [
                  JSON.stringify(data.profile),
                ]);
                // 登入完就返回主页
                this.$router.replace("/myhome");
                console.log(data.profile);
                // 判断有无勾选记住我
                if (this.checked) {
                  localStorage.setItem("phone", this.loginForm.username);
                  localStorage.setItem("pwd", this.loginForm.password);
                } else {
                  localStorage.removeItem("phone");
                  localStorage.removeItem("pwd");
                }
              } else if (data.code == 502) {
                this.$message.error(data.msg);
                console.log(this);
              } else {
                this.$message.error("账号不存在！");
              }
            })
            .catch(function (error) {
              // console.log(error.message);
              // alert("请再一次核对账号！");
            });
        } else {
          this.$message.error("请按要求输入所有字段");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.loginContainer {
  width: 400px;
  margin: 80px auto;
  padding: 15px 35px 15px 35px;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 0 25px #ccc;
  .loginTitle {
    margin: 0 auto 45px auto;
    text-align: center;
  }
  .loginRemember {
    text-align: left;
    margin: 0 0 10px 0;
  }
}
</style>