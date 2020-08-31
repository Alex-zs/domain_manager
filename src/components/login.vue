<template>
  <div>
    <el-main>
      <div class="login-container">
        <el-form class="login-form" label-position="left">
          <div class="title-container">
            <h3 class="title">ITStudio 域名管理</h3>
          </div>

          <el-form-item>
      <span class="svg-container">
       <i class="el-icon-user-solid"></i>
      </span>
            <el-input
                placeholder="邮箱"
                type="text"
                name="email"
                v-model="loginForm.email"
            ></el-input>
            <label class="email-suffix">@itstudio.club</label>
          </el-form-item>

          <el-form-item class="validate-code-input">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
            <el-input
                v-model="loginForm.captcha"
                placeholder="验证码"
                name="password"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="getCaptchaLoading" @click="getCaptcha">获取验证码</el-button>
          </el-form-item>

          <div id="vaptchaContainer" style="display: none">
            <!--vaptcha-container是用来引入VAPTCHA的容器，下面代码为预加载动画，仅供参考-->
            <div class="vaptcha-init-main">
              <div class="vaptcha-init-loading">
                <a href="/" target="_blank">
                  <img src="https://r.vaptcha.net/public/img/vaptcha-loading.gif" />
                </a>
                <span class="vaptcha-text">Vaptcha启动中...</span>
              </div>
            </div>
          </div>

          <el-form-item>
            <el-button type="primary" :loading="loginLoading" style="width: 100%;" @click="clickLogin">登录</el-button>
          </el-form-item>

        </el-form>
      </div>
    </el-main>
    <el-footer class="footer">@{{new Date().getFullYear()}}  爱特工作室</el-footer>
  </div>

</template>

<script>
import {vaptcha} from "@/util/vaptcha";

export default {
  name: "Login",
  data() {
    return{
      loginForm: {
        email: "",
        captcha:""
      },
      token: '',
      getCaptchaLoading: false,
      loginLoading: false
    }
  },
  methods: {
    // 检查邮箱是否填写
    validEmail() {
      if (this.$data.loginForm.email.length === 0) {
        this.$message({
          showClose: true,
          message: '请先填写邮箱',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    // 检查验证码是否填写
    validCaptcha() {
      if (this.$data.loginForm.captcha.length === 0) {
        this.$message({
          showClose: true,
          message: '请填写验证码',
          type: 'warning'
        });
        return false;
      }
      return true;
    },
    // 获取验证码
    getCaptcha() {
      if (!this.validEmail()) {
        return ;
      }
      // 检查图形验证码是否完成
      if(this.$data.token === "") {
        document.querySelectorAll(".vp-tip")[0].click();
      }else {
        // 发送验证码
        let data = {
          email: this.$data.loginForm.email,
          token: this.$data.token
        };
        this.getCaptchaLoading = true;
        this.$http.post("https://itstudio.club/domain/login", data).then((res) => {
          this.getCaptchaLoading = false;
          if (res.data.status === 1) {
            this.$message({
              showClose: true,
              message: '验证码已发送，请查收',
              type: 'success'
            });
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    },

    // 点击登录
    clickLogin() {
      if(this.validEmail() && this.validCaptcha()) {
        // 一旦点击登录，抹去图形验证token
        this.token = '';
        this.loginLoading = true;
        this.$http.post("https://itstudio.club/domain/login/verify", this.loginForm).then((res) => {
          this.loginLoading = false;
          if (res.data.status === 1) {
            this.$router.push({path: '/records'})
          }else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      }
    }
  },
  mounted() {
    document.body.style.backgroundColor = '#283443';
    vaptcha().then((vaptcha) => {
      vaptcha({
        vid: '5efdf07186e8ce893ab1c50e', // 验证单元id
        type: 'click', // 显示类型 点击式
        scene: 1, // 场景值 默认0
        offline_server: 'xxxxx', // 离线模式服务端地址
        container: '#vaptchaContainer', // 容器，可为Element 或者 selector
        lang: 'zh-CN'
      }).then((obj) => {
        obj.render();
        obj.listen('pass', () => {
          this.$data.token = obj.getToken();
          this.getCaptcha();
        })
      })
    });
  }
}
</script>

<style lang="scss">

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

body{
  background-color: $bg;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 45%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 18px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 340px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .email-suffix{
      font-size: 20px;
      text-align: center;
      color: $dark_gray;
    }

    .validate-code-input{
      width: 200px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 7px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 10px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.footer {
  width: 100%;
  text-align: center;
  bottom: 0;
  color: $light_gray;
  position: absolute;
}
</style>


