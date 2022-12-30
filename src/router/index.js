/**
 * 路由封装
 */
import { BrowserRouter as Router, useRoutes, Navigate } from 'react-router-dom';
import { history } from '@/utils/history'
// React.lazy 动态加载页面或者组件，建议配合 Suspense 使用再进行渲染
import { lazy, Suspense } from 'react'
// 缓存页面插件
import KeepAlive from 'react-activation'
// 缓存的页面不能使用懒加载导入
import Map from "@/pages/Map";
import List from "@/pages/List";

const Login = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Login/register'))
const Index = lazy(() => import('@/pages/Index'))
const Home = lazy(() => import('@/pages/Home'))
const News = lazy(() => import('@/pages/News'))
const User = lazy(() => import('@/pages/User'))
const UserInfo = lazy(() => import('@/pages/UserInfo'))
const CityList = lazy(() => import('@/pages/CityList'))
const Houses = lazy(() => import('@/pages/Houses'))
const Favorites = lazy(() => import('@/pages/Favorites'))
const Rental = lazy(() => import('@/pages/Rental'))
const Publish = lazy(() => import('@/pages/Publish'))

const GetRoutes = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: <Navigate to="/home" />,
        },
        {
            path: '/login',
            title: "用户登录",
            element: <Login />,
        },
        {
            path: '/register',
            title: "用户注册",
            element: <Register />,
        },
        {
            path: "/home",
            title: "首页",
            element: <Index />,
            children: [
                {
                    path: "/home", title: "首页", element: <Home />,
                },
                {
                    path: "/home/List", title: "找房", element: <KeepAlive name="List" ><List /></KeepAlive>,
                },
                {
                    path: "/home/news", title: "咨询", element: <News />,
                },
                {
                    path: "/home/user", title: "我的", element: <User />,
                }
            ]
        },
        {
            path: '/map',
            title: "百度地图",
            element: <KeepAlive name="Map" ><Map /></KeepAlive>,
        },
        {
            path: '/cityList',
            title: "城市列表",
            element: <CityList />,
        },
        {
            path: '/houses',
            title: "房屋详情",
            element: <Houses />,
        },
        {
            path: '/user/favorites',
            title: "我的收藏",
            element: <Favorites />,
        },
        {
            path: '/user/rental',
            title: "我的出租",
            element: <Rental />,
        },
        {
            path: '/user/publish',
            title: "发布房源",
            element: <Publish />,
        },
        {
            path: '/user/userInfo',
            title: "个人资料",
            element: <UserInfo />,
        }
    ]);
    return routes
}

const SetRoutes = () => {
    return (
        <Router history={history}>
            {/* React.lazy 动态加载页面或者组件，建议配合 Suspense 使用再进行渲染 */}
            <Suspense>
                <GetRoutes />
            </Suspense>
        </Router>
    )
}

export default SetRoutes;
