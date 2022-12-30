import React from "react";
import SwiperModul from "./swiper";
import Groups from './groups'
import News from './news'
import { Image } from 'antd-mobile'
import NavImg1 from '@/assets/image/nav-1.png'
import NavImg2 from '@/assets/image/nav-2.png'
import NavImg3 from '@/assets/image/nav-3.png'
import NavImg4 from '@/assets/image/nav-4.png'
import './index.scss'

// 首页菜单模块
const Navbtn = () => {
    const list = [
        { name: '整租', imgSrc: NavImg1 },
        { name: '合租', imgSrc: NavImg2 },
        { name: '地图找房', imgSrc: NavImg3 },
        { name: '去出租', imgSrc: NavImg4 },
    ]

    return (
        <div className="menu_box flex_ctr">
            {list.map(item => (
                <div className="flex_col" key={item.name}>
                    <Image src={item.imgSrc} lazy width={48} height={48} style={{ borderRadius: 24 }} />
                    <span className="mg-t-3">{item.name}</span>
                </div>
            ))}
        </div>
    )
}


// 首页主体模块
const Home = () => {
    return (
        <div className="home_box">
            <SwiperModul></SwiperModul>
            <Navbtn></Navbtn>
            <Groups></Groups>
            <News></News>
        </div>
    )
}

export default Home