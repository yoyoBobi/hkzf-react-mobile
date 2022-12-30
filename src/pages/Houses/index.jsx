import { getHousesDetail } from '@/api/house'
import { isUserFavorites, addUserFavorites, deleteUserFavorites } from '@/api/user'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { Swiper, Image, NavBar, Button, Ellipsis, Dialog, ImageViewer } from 'antd-mobile'
import { SendOutline, CheckShieldOutline, StarOutline, StarFill } from 'antd-mobile-icons'
import { baseURL } from '@/utils/request'
import { useLocation, useNavigate } from 'react-router-dom'
import HouseConfig from '@/components/houses-config'
import MapModule from './map'
import Storage from '@/utils/storage'
import './index.scss'

// 轮播图模块
const SwiperModul = React.memo(props => {
    // 加个判断渲染解决 Swiper 组件警告初始渲染时必须有一个子组件
    if (props.data.length > 0) {
        // 重构图片数据数组
        const demoImages = props.data.map(item => baseURL + item)

        const lookImage = (index) => {
            // 点击图片查看
            ImageViewer.Multi.show({ images: demoImages, defaultIndex: index })
        }


        return (
            <Swiper loop autoplay style={{ '--height': '250px' }}>
                {props.data.map((item, index) => (
                    <Swiper.Item key={item} onClick={() => lookImage(index)}>
                        <Image src={baseURL + item} width="100%" height="100%" />
                    </Swiper.Item>))}
            </Swiper>
        )
    }
})

// 房屋信息模块
const HouseInfo = React.memo(props => {
    // 判断是否空对象
    const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
    if (isEmpty(props.data)) return
    return (
        <div className='info_box pd-10'>
            <div className='pd-b-10'>
                <h3>{props.data.title}</h3>
                <div className='mg-t-5'>
                    {props.data.tags.map((tag, index) => {
                        return <span className={['tag_', 'tag_' + index].join(' ')} key={tag}>{tag}</span>
                    })}
                </div>
            </div>
            <div className='among_content flex_ pd-tb-10'>
                <div className='flex_col'>
                    <span className='time'>{props.data.price}</span>
                    <span>租金</span>
                </div>
                <div className='flex_col'>
                    <span>{props.data.roomType}</span>
                    <span>房型</span>
                </div>
                <div className='flex_col'>
                    <span>{props.data.size}平米</span>
                    <span>面积</span>
                </div>
            </div>
            <div className='bottom_content flex_ pd-t-10'>
                <div>
                    <span>装修：</span><span>精装</span>
                </div>
                <div>
                    <span>朝向：</span><span>{props.data.oriented[0]}</span>
                </div>
                <div>
                    <span>楼层：</span><span>{props.data.floor}</span>
                </div>
                <div>
                    <span>类型：</span><span>普通住宅</span>
                </div>
            </div>
        </div>
    )
})

// 房屋概括
const HousesMsg = React.memo(props => {
    return (
        <div className='houses_msg mg-t-10 pd-10'>
            <h3 className='pd-b-10'>房源概括</h3>
            <div className='house_owner flex_ pd-tb-10'>
                <Image src={baseURL + '/img/avatar.png'} width={54} height={54} fit='cover' style={{ borderRadius: 27 }} />
                <div className='houses_W flex_col'>
                    <span>只因女士</span>
                    <div className='mg-t-5'>
                        <CheckShieldOutline fontSize={15} />
                        <span className='mg-l-3'>已认证房主</span>
                    </div>
                </div>
                <Button color='primary' size='mini' fill='outline'>发送消息</Button>
            </div>
            <Ellipsis direction='end' expandText='展开' collapseText='收起' rows={4} content={props.data} />
        </div>
    )
})

const navBarBg2 = {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    color: '#333',
    borderBottom: '1px solid #eee'
}
const navBarBg1 = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#FFF'
}

const Houses = () => {
    // 获取路由传参
    const paramsState = useLocation()

    const [dataInfo, setDataInfo] = useState({})
    // 定义父元素 HTMLDivElement
    const [dom, setDom] = useState(null)
    // 动态改变导航栏样式
    const [navStyle, setNavStyle] = useState(navBarBg1)
    // 辨别是否已收藏
    const [isCollect, setIsCollect] = useState(false)

    useEffect(() => {
        getHousesDetailInfo()
        if (Storage.get('token')) isFavorites()
    }, [])
    // 获取房屋详细信息
    const getHousesDetailInfo = async () => {
        try {
            let res = await getHousesDetail(paramsState.state.code)
            setDataInfo(res.data.body)
        } catch (err) { }
    }
    // 请求房屋是否被用户收藏
    const isFavorites = async () => {
        try {
            let res = await isUserFavorites(paramsState.state.code)
            setIsCollect(res.data.body.isFavorite)
        } catch (err) { }
    }

    // 监听 父元素 滚动位置
    const handleOnScroll = () => {
        // 通过滚动条的位置改变导航栏的样式
        if (dom.scrollTop > 30) setNavStyle(navBarBg2)
        else setNavStyle(navBarBg1)
    }
    // 添加或者删除收藏操作
    const handlerCollect = async () => {
        try {
            if (!Storage.get('token')) {
                Dialog.confirm({
                    content: '您还未登录，是否确认去登录？',
                    onConfirm: async () => {
                        navigate('/login', { state: { type: 'back' } })
                    },
                })
                return
            }
            // 判断收藏状态，进行添加或者删除操作
            if (isCollect) {
                // 删除收藏
                let res = await deleteUserFavorites(paramsState.state.code)
                setIsCollect(false)
            } else {
                // 添加收藏
                let res = await addUserFavorites(paramsState.state.code)
                setIsCollect(true)
            }
        } catch (err) { }
    }

    // 路由跳转
    const navigate = useNavigate()

    return (
        <div className='houses_box'>
            <div className='top_content' ref={dom => setDom(dom)} onScrollCapture={handleOnScroll}>
                <NavBar right={<SendOutline fontSize={20} />} onBack={() => navigate(-1)}
                    style={navStyle}>{dataInfo.community}</NavBar>

                <SwiperModul data={dataInfo.houseImg || []}></SwiperModul>

                <HouseInfo data={dataInfo}></HouseInfo>

                <MapModule data={dataInfo || {}}></MapModule>

                <div className='houses_config_content'>
                    <h3 className='pd-b-10'>房屋配套</h3>
                    <HouseConfig configItem={dataInfo.supporting || []}></HouseConfig>
                </div>

                <HousesMsg data={dataInfo.description}></HousesMsg>
            </div>
            <div className='nvb_bottom_content'>
                <div onClick={handlerCollect}>
                    {isCollect ? <StarFill color='#5aabfd' fontSize={18} /> : <StarOutline fontSize={18} />}
                    <span className='mg-l-3'>收藏</span>
                </div>
                <div className='among_'><span>在线咨询</span></div>
                <div className='right_'><span>电话预约</span></div>
            </div>
        </div>
    )
}

export default Houses;