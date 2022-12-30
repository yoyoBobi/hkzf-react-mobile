import React, { useEffect, useState } from "react"
import { CompassOutline } from 'antd-mobile-icons'
import style from './map.module.css'

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

// 由于父组件 setState 值发生改变，从而使子组件重复无效渲染降低用户体验，React.memo 阻止子组件无效重复渲染
// 第二个参数 (prevProps, nextProps) => prevProps.nowTime === nextProps.nowTime，对比 新旧值 是否重新渲染，true 禁止重新渲染，false 将重新渲染

const MapModule = React.memo(props => {
    // 定义地图数据变量
    const [map, setMap] = useState(null)
    // 监听 props 变化
    useEffect(() => {
        // 判断对象中是否存在某属性，防止组件渲染时数据未获取到而出现报错
        if (props.data.hasOwnProperty('community')) initMap()
    }, [props])
    // 监听到 map 数据变化后再进行创建覆盖物
    useEffect(() => {
        if (map != null) RenderHouses()
    }, [map])
    // 初始化地图
    const initMap = () => {
        const { longitude, latitude } = props.data.coord

        // 创建地图实例
        let mapSet = new window.BMapGL.Map("houses_map")
        // 添加缩放控件
        let zoomCtrl = new window.BMapGL.ZoomControl();
        mapSet.addControl(zoomCtrl);
        // 设置中心点坐标
        let point = new window.BMapGL.Point(longitude, latitude);
        // 地图初始化，同时设置地图展示级别
        mapSet.centerAndZoom(point, 17);
        // 取消地图双击缩放
        mapSet.disableDoubleClickZoom()

        setMap(mapSet)
    }
    // 渲染覆盖物
    const RenderHouses = () => {
        const { longitude, latitude } = props.data.coord
        // 创建覆盖物
        const cover = new window.BMapGL.Label('', {
            position: new window.BMapGL.Point(longitude, latitude),
            offset: new window.BMapGL.Size(-35, -35)
        })

        // 设置房源覆盖物内容
        cover.setContent(`
            <div class="${style.rect}">
                <span >${props.data.community}</span>
                <i class="${style.arrow}"></i>
            </div>
        `)
        // 设置样式
        cover.setStyle(labelStyle)
        // 添加覆盖物到地图中
        map.addOverlay(cover)
    }

    const handlerReset = () => {
        const { longitude, latitude } = props.data.coord
        // 设置中心点坐标
        let point = new window.BMapGL.Point(longitude, latitude);
        // 地图初始化，同时设置地图展示级别
        map.centerAndZoom(point, 17);
    }

    return (
        <div className="mg-t-10">
            <div className="pd-10 flex_bet">
                <span>小区：{props.data.community}</span>
                <CompassOutline fontSize={22} onClick={handlerReset} />
            </div>
            <div id="houses_map"></div>
        </div>
    )
})

export default MapModule