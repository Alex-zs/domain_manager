import VueRouter from "vue-router";
import App from "@/App";
import Login from "@/components/login";
import record_list from "@/components/record_list";

//定义路由
const routes = [
    {path:'/',component:App},
    { path: '/login', component: Login},
    { path: '/records', component: record_list}
]
//创建 router 实例，然后传 routes 配置
const router=new VueRouter({
    routes
});

export default router
