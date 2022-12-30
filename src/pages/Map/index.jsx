import { NavBar, Popup, Image, SpinLoading } from 'antd-mobile'
import { CloseOutline } from 'antd-mobile-icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAreaMap } from '@/api/area'
import { getHousesList } from '@/api/house'
import Storage from '@/utils/storage'
import { useActivate, useUnactivate, useAliveController } from 'react-activation'
import HousesList from "@/components/houses-list";
import './index.scss'
import styles from './index.module.css'


// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

// 地图模块主体
const MapModule = (props) => {
    // 页面缓存控制方法
    const { dropScope } = useAliveController()
    // 定义地图数据变量
    const [map, setMap] = useState(null)
    // 定义弹出层显示隐藏
    const [visible, setVisible] = useState(false)
    // 定义房源列表数据
    const [housesList, setHousesList] = useState([])
    // 判断区房数据是否展示
    const [isAreaCover, setIsAreaCover] = useState(false)
    // 记录地图缩放大小
    // const [zoomSize, setZoomSize] = useState(11)
    // 路由跳转
    const navigate = useNavigate()
    // 获取本地缓存定位数据
    const locationData = Storage.get('location')

    // 缓存页面函数，激活时触发
    useActivate(() => {
        setVisible(true)
    })
    // 缓存页面函数，缓存时触发
    useUnactivate(() => {
        setVisible(false)
    })

    useEffect(() => {
        // 延时初始化，防止定位位置不准确，由于缓存页面卸载后再次初始化会出现定位位置不准确
        setTimeout(() => initMap(), 500);
    }, [])
    // 监听到 map 数据变化后再进行创建覆盖物
    useEffect(() => {
        if (map != null) getAreaHomeList(locationData.value)
    }, [map])
    // 初始化地图
    const initMap = () => {
        console.log('Map：', locationData)
        // 创建地图实例
        let mapSet = new window.BMapGL.Map("baidu_map")
        // 添加缩放控件
        let zoomCtrl = new window.BMapGL.ZoomControl();
        mapSet.addControl(zoomCtrl);
        // 设置中心点坐标
        let point = new window.BMapGL.Point(locationData.lng, locationData.lat);
        // 地图初始化，同时设置地图展示级别
        mapSet.centerAndZoom(point, 11);
        // 取消地图双击缩放
        mapSet.disableDoubleClickZoom()

        //监听地图缩放事件;
        mapSet.addEventListener("zoomend", function () {
            // setTimeout(() => {
            // let zoomSize = mapSet.getZoom();
            // console.log(4444, zoomSize, isAreaCover)
            // if (zoomSize < 14 && isAreaCover) {
            // setIsAreaCover(false)
            // getAreaHomeList(locationData.value, zoomSize)
            // }
            // }, 500)
        });

        setMap(mapSet)
    }


    // 渲染覆盖物入口
    // 1 接收区域 id 参数，获取该区域下的房源数据
    // 2 获取房源类型以及下级地图缩放级别
    const getAreaHomeList = async (id, size) => {
        try {
            let res = await getAreaMap({ id: id })

            setTimeout(() => {
                // 调用地图的 getZoom() 方法，来获取当前缩放级别
                const zoomSize = map.getZoom()
                // 遍历循环数据
                res.data.body.forEach(item => {
                    // 创建覆盖物
                    createCover(item, size ? size : zoomSize)
                })
            }, 700)
        } catch (err) { }
    }

    // 创建区、镇、市覆盖物
    const createCover = (home, zoomSize) => {
        // 解构赋值
        const { coord: { longitude, latitude }, value, label, count } = home
        // 创建坐标对象
        const areaPoint = new window.BMapGL.Point(longitude, latitude);
        // 创建覆盖物
        const cover = new window.BMapGL.Label('', {
            position: areaPoint,
            offset: new window.BMapGL.Size(-35, -35)
        })
        // 给 cover 对象添加一个唯一标识
        cover.id = value
        // 判断缩放级别渲染覆盖物
        if (zoomSize < 14) {    // 区或镇
            // 设置房源覆盖物内容
            cover.setContent(`
                <div class="${styles.bubble}">
                    <p class="${styles.name}">${label}</p>
                    <p>${count}套</p>
                </div>
            `)
        } else {    // 小区
            // 设置房源覆盖物内容
            cover.setContent(`
                <div class="${styles.rect}">
                <span class="${styles.housename}">${label}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
                </div>
            `)
        }
        // 设置样式
        cover.setStyle(labelStyle)
        // 添加单击事件
        cover.addEventListener('click', async e => {
            // console.log('cover：', zoomSize);
            // 根据市、镇、区 缩放地图
            if (zoomSize < 12) map.centerAndZoom(areaPoint, 13)   // 镇
            else if (zoomSize >= 12 && zoomSize < 14) {
                // 地图缩放，区
                map.centerAndZoom(areaPoint, 15)
            }

            if (zoomSize > 14) {
                // 获取当前被点击项
                const target = e.domEvent.changedTouches[0]
                map.panBy(window.innerWidth / 2 - target.clientX, (window.innerHeight - 330) / 2 - target.clientY)
                // 请求获取房屋列表
                getHouseList(value)
            } else {
                // 调用 getAreaHomeList 方法，获取该区域下的房源数据
                getAreaHomeList(value)

                // 清除当前覆盖物信息
                map.clearOverlays()
            }
        })
        // 添加覆盖物到地图中
        map.addOverlay(cover)
    }
    // 获取房源列表数据
    const getHouseList = async (id) => {
        try {
            // 显示弹出层
            setVisible(true)
            // 初始化列表
            setHousesList([])

            let res = await getHousesList({ cityId: id })
            // 模拟请求耗时过程
            setTimeout(() => setHousesList(res.data.body.list), 1000)
        } catch (err) { }
    }
    // 封装渲染房屋列表的方法
    const RenderHousesList = () => {
        if (housesList.length > 0) {
            return <HousesList list={housesList}></HousesList>
        } else {
            return (
                <div className='flex_col flex_ctr' style={{ height: '100%' }}>
                    <SpinLoading color='primary' />
                    <span className='mg-t-10' style={{ color: '#1677ff' }}>数据加载中...</span>
                </div>
            )
        }
    }

    // 返回到首页
    const backHome = () => {
        navigate(-1)
        // 返回到首页时卸载当前地图页面
        dropScope('Map')
    }
    // 重置房源操作
    const handlerRestHouses = () => {
        // 设置中心点坐标
        let point = new window.BMapGL.Point(locationData.lng, locationData.lat);
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 11);
        // 清除当前覆盖物信息
        map.clearOverlays()
        // 关闭底部弹窗
        setVisible(false)
        // 初始化房源
        getAreaHomeList(locationData.value)
    }

    return (
        <div className='map_box'>
            <NavBar right={<span onClick={handlerRestHouses}>重置房源</span>} onBack={backHome}>标题</NavBar>

            <div id="baidu_map"></div>

            <Popup mask={false} visible={visible} bodyStyle={{ minHeight: '50vh' }}>
                <div className='popup_box'>
                    <div className='nav_top'>
                        <NavBar backArrow={<CloseOutline onClick={() => { setVisible(false) }} style={{ fontSize: 20 }} />}
                            right={<span>更多房源</span>}>房屋列表</NavBar>
                    </div>
                    <div className='list_box'>
                        <RenderHousesList />
                    </div>
                </div>
            </Popup>
        </div >
    )
}

export default MapModule