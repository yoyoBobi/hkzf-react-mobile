import React from "react";
/**告诉 React Router 嵌套的内容应该放到哪里 */
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppOutline, FileOutline, CompassOutline, UserOutline } from 'antd-mobile-icons'
import { useAliveController } from 'react-activation'
import { TabBar } from 'antd-mobile'
import './index.scss'
import { useEffect } from "react";

// TabBar 数据
const tabs = [
    {
        key: '/home',
        title: '首页',
        icon: <AppOutline />,
    },
    {
        key: '/home/list',
        title: '找房',
        icon: <CompassOutline />,
    },
    {
        key: '/home/news',
        title: '咨询',
        icon: <FileOutline />,
    },
    {
        key: '/home/user',
        title: '我的',
        icon: <UserOutline />,
    },
]


const Home = () => {
    // navigator.geolocation.getCurrentPosition(position => {
    // 经度 : longitude
    // 纬度 : latitude
    // 准确度 : accuracy
    // 海拔 : altitude
    // 海拔准确度 : altitudeAcuracy
    // 行进方向 : heading
    // 地面速度 : speed
    // 请求的时间: new Date(position.timestamp)
    // })
    useEffect(() => {
        // 手机端滑动返回首页时卸载缓存的地图页面
        dropScope('Map')
    }, [])

    // 页面缓存控制方法
    const { dropScope } = useAliveController()
    // 获取地址栏参数
    const location = useLocation()
    // 路由跳转
    const navigate = useNavigate()

    return (
        <div className="index_box">
            <div className="item_box">
                {/* 子路由的存放位置 */}
                <Outlet></Outlet>
            </div>
            <div className="bottom_box">
                <TabBar activeKey={location.pathname} onChange={val => {
                    navigate(val)
                    dropScope('List')
                }
                }>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            </div>
        </div>
    )
}

export default Home