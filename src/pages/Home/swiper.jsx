import React, { useEffect, useState } from "react";
import { Swiper, Image } from 'antd-mobile'
import { EnvironmentOutline, DownFill, SearchOutline } from 'antd-mobile-icons'
import { getHomeSwiper } from '@/api/home'
import { baseURL } from '@/utils/request'
import { connect } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Storage from '@/utils/storage'

// 顶部搜索模块
const Search = (props) => {
    const cityName = Storage.get('location').label

    // 路由跳转
    const navigate = useNavigate()

    const handClick = () => {
        console.log('Search：', props);
    }

    return (
        <div className="search_box">
            <div className="search_left flex_ pd-lr-10">
                <span className="mg-r-3" onClick={() => navigate('/cityList')}>{cityName}</span>
                <DownFill fontSize={10} />
                <div className="click_search flex_ctr" onClick={handClick}>
                    <SearchOutline fontSize={18} />
                    <span className="mg-l-5">请输入小区或地址</span>
                </div>
            </div>
            <EnvironmentOutline fontSize={25} color='#FFFFFF' onClick={() => navigate('/map')} />
        </div>
    )
}


// 轮播图模块
const SwiperMain = (props) => {
    const [swiperImg, setSwiperImg] = useState([])

    useEffect(() => {
        getSwiper()
    }, [])

    const getSwiper = async () => {
        try {
            let res = await getHomeSwiper()
            setSwiperImg(res.data.body)
        } catch (err) { }
    }

    // 加个判断渲染解决 Swiper 组件警告初始渲染时必须有一个子组件
    if (swiperImg.length > 0) return (
        <Swiper loop autoplay>
            {swiperImg.map(item => (
                <Swiper.Item key={item.id}>
                    <div className="swiper_item">
                        <Image src={baseURL + item.imgSrc} width="100%" height="100%" />
                    </div>
                </Swiper.Item>))}
        </Swiper>
    )
}

const SwiperModul = (props) => {

    return (
        <div className="swiper_box">
            <SwiperMain></SwiperMain>
            <Search></Search>
        </div>
    )
}

/**
 * 这个函数要有一个返回值，返回的是 state
 * @param {*} state 
 * @returns 
 */
const mapStateToProps = (state) => {
    return state.locationData
}

// 接收方，所以要实现 connect 第一个参数
export default connect(mapStateToProps)(SwiperModul)