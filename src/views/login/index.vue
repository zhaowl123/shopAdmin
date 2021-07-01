<template>
  <div class="login-wrap" @keydown.enter="login">
    <div class="login-con">
      <el-card class="box-card">
        <template #header>
          <span class="login--header">登录</span>
        </template>
        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="请输入账号 admin or test"
              class="form--input"
            >
              <template #prefix>
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input
              v-model="form.passWord"
              show-password
              :minlength="3"
              :maxlength="18"
              placeholder="请输入密码 admin or test"
              class="form--input"
            >
              <template #prefix>
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              class="login--button"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { permissionStore } from "@/store/modules/permission";
import { appStore } from "@/store/modules/app";
import wsCache from "@/cache";
import { ElNotification } from "element-plus";
import axios from 'axios'
import { loginApi } from "@/views/login/api";
import { t } from "element-plus/lib/locale";

interface FormModule {
  userName: string;
  passWord: string;
}
interface RulesModule {
  userName: any[];
  passWord: any[];
}

export default defineComponent({
  name: "Login",
  setup() {
    const { push, addRoute, currentRoute } = useRouter();
    const loginForm = ref<HTMLElement | null>(null);
    const loading = ref<boolean>(false);
    const redirect = ref<string>("");
    watch(
      () => {
        return currentRoute.value;
      },
      (route) => {
        redirect.value = (route.query && route.query.redirect) as string;
      },
      {
        immediate: true,
      }
    );
    const form = reactive<FormModule>({
      userName: "",
      passWord: "",
    });
    const rules = reactive<RulesModule>({
      userName: [{ required: true, message: "请输入账号" }],
      passWord: [{ required: true, message: "请输入密码" }],
    });
    async function login(): Promise<void> {
      const formWrap = unref(loginForm) as any;
      console.log(formWrap);
      if (!formWrap) return;
      loading.value = true;
      try {
        formWrap.validate(async (valid: boolean) => {
          if (valid) {
          //   axios.post("http://10.113.8.129:90/mock/104/login",{
          //     params : {
          //       // username=123456&password=892
          //       username:form.userName,
          //       password:form.passWord
          //     }
          //   }).then(res => {
          //     console.log(res)
          //     console.log("1111",res.data.data.roleName)
          //   })
          //  return;

            //export const loginApi = ({ data }: PropsData) => {
            const res = await loginApi({ params: form });
            // console.log(typeof JSON.stringify(res));
            // console.log("1111",res)
            // console.log("1111",res.data)
            // console.log("1111",res.data.roleName)

            if (res) {
              //这里暂且不用存数组，目前只有2个权限，路由数据写死即可 admin / 非admin
              wsCache.set(appStore.userInfo, res.data.roleName);
              permissionStore.GenerateRoutes().then(() => {
                // console.log(permissionStore.addRouters)
                permissionStore.addRouters.forEach(
                  async (route: RouteRecordRaw) => {
                    await addRoute(route.name!, route); // 动态添加可访问路由表
                  }
                );
                permissionStore.SetIsAddRouters(true);
                push({ path: redirect.value || "/" });
              });
            }

            /*
            wsCache.set(appStore.userInfo, form)
            permissionStore.GenerateRoutes().then(() => {
              permissionStore.addRouters.forEach(async(route: RouteRecordRaw) => {
                await addRoute(route.name!, route) // 动态添加可访问路由表
              })
              permissionStore.SetIsAddRouters(true)
              push({ path: redirect.value || '/' })
            })
            */
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } catch (err) {
        console.log(err);
      } finally {
        loading.value = false;
      }
    }

    ElNotification({
      title: "提示",
      message:
        "账号 admin 为 前端 控制路由权限，账号 test 为 后端 控制路由权限。密码与账号相同",
      duration: 60000,
    });

    return {
      loginForm,
      loading,
      redirect,
      form,
      rules,
      login,
    };
  },
});
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/img/login-bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  .box-card {
    width: 400px;
    .login--header {
      font-size: 24px;
      font-weight: 600;
    }
    .svg-container {
      color: #889aa4;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .form--input {
      width: 100%;
      @{deep}(.el-input__inner) {
        padding-left: 40px;
      }
    }
    .login--button {
      width: 100%;
    }
  }
  .login-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
  }
}
</style>
