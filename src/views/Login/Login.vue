<template>
  <div class="login">
    <div class="box">
      <span>使用账号 登录官网</span>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <el-input type="text" v-model="ruleForm.user" autocomplete="off" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <div class="geetest"></div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Storage from "@/Utils/storage.js";
export default {
  data() {
    let validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user: "",
        pass: ""
      },
      rules: {
        user: [{ validator: validateUser, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //验证通过 获取用户名和密码
          let { user, pass } = this.ruleForm;
          //向后端发送请求
          const res = await this.$axios.post("/api/login", { user, pass });
          // console.log(res);
          if (res.data.code === 200) {
            let { username, token, id } = res.data;
            // console.log(this.$route.query.next);
            // this.$store.state.login = true;
            //数据持久化存储 以便在请求拦截器中添加请求头设置token
            Storage.set("token", token);
            Storage.set("id", id);
            const result = await this.$axios.post("/api/cartList", {
              userId: id
            });
            Storage.set("cartList", result.data.cartList.cartList);
            // console.log(result.data.cartList.cartList);

            //改变vuex登陆状态
            this.$store.commit("ISLOGIN", { info: res.data, isLogin: true });
            this.$router.push({ path: this.$route.query.next });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  overflow: visible;
  background: #ededed;
  .box {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    position: absolute;
    top: 200px;
    left: 50%;
    padding: 50px 50px 50px 10px;
    margin-left: -225px;
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 18px 20px -10px rgba(0, 0, 0, 0.04),
      0 10px 20px -10px rgba(0, 0, 0, 0.04);
    text-align: center;
    form {
      margin-top: 30px;
    }
    span {
      color: #333;
      font-weight: 400;
    }
  }
}
</style>