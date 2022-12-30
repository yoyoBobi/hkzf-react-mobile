import { connect } from 'react-redux'
import { NavBar, IndexBar, List } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { getAreaCityList, getAreaHot } from '@/api/area'
import { useEffect } from 'react'
import { useState } from 'react'
import Storage from '@/utils/storage'
import './index.scss'

const CityList = (props) => {
    const locationData = Storage.get('location')
    // 路由跳转
    const navigate = useNavigate()

    const [cityList, setCityList] = useState({})
    const [cityIndex, setCityIndex] = useState([])

    // 监听 props 更新，重新请求 
    useEffect(() => {
        getCityList()
    }, [props])


    // 获取城市列表数据
    const getCityList = async () => {
        try {
            let res = await Promise.all([getAreaCityList({ level: 1 }), getAreaHot()])

            // 重构城市列表，插入当前定位和热门城市信息
            let initCityList = formatCityData(res[0].data.body).cityList
            initCityList['热'] = res[1].data.body
            initCityList['#'] = [{ label: locationData.label, value: locationData.value }]
            let initCityIndex = formatCityData(res[0].data.body).cityIndex
            initCityIndex.unshift({ name: '当前定位', value: '#' }, { name: '热门城市', value: '热' })

            setCityList(initCityList)
            setCityIndex(initCityIndex)
        } catch (err) { }
    }

    // 城市列表数据格式化
    const formatCityData = list => {
        const cityList = {}
        const cityIndex = []
        // 遍历 list 数组
        list.forEach(item => {
            // 获取每个城市的首字母
            const first = item.short.substr(0, 1)
            // 判断 cityList 中是否有该分类
            if (cityList[first.toUpperCase()]) {
                // 如果有，直接往该数据里 push，toUpperCase方法把字母小写转为大写
                cityList[first.toUpperCase()].push(item)
            } else {
                // 如果没有，就先创建一个数组，然后把当前城市信息添加到数组中
                cityList[first.toUpperCase()] = [item]
            }
        });

        // 获取索引数据，然后进行格式化
        Object.keys(cityList).sort().forEach(item => {
            cityIndex.push({ name: item, value: item })
        })

        return {
            cityIndex,
            cityList
        }
    }

    const handlerCity = (val) => {
        var myGeo = new window.BMapGL.Geocoder();
        // 根据各市地名解析出经纬度
        myGeo.getPoint(val.label, function (point) {
            console.log(2222222, point)
            if (point) {
                // 更新 redux 的状态管理数据 
                // props.initCity({
                //     label: val.label,
                //     value: val.value,
                //     lat: point.lat,
                //     lng: point.lng
                // })
                // 更新本地缓存的数据
                Storage.set('location', {
                    label: val.label,
                    value: val.value,
                    lat: point.lat,
                    lng: point.lng
                })
                navigate(-1)
            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, val.label)
    }

    return (
        <div className='cityList_box flex_col'>
            <NavBar onBack={() => navigate(-1)}>城市选择</NavBar>
            <div className='list_box'>
                <IndexBar>
                    {cityIndex.map(val => {
                        const { name, value } = val
                        return (
                            <IndexBar.Panel index={value} title={name} key={value}>
                                <List>
                                    {cityList[value].map(item => (
                                        <List.Item arrow={false} key={item.value} onClick={() => handlerCity(item)}>{item.label}</List.Item>
                                    ))}
                                </List>
                            </IndexBar.Panel>
                        )
                    })}
                </IndexBar>
            </div>
        </div>
    )
}

export default CityList

//  以下为 redux  
/**
 * 这个函数要有一个返回值，返回值是一个对象，把方法挂载到 props 上
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
    return {
        // 状态管理缓存，初始化用户定位信息
        initCity: (res) => {
            // 利用 dsipatch 发送一个 action
            // 传递 action 对象 我们要定义一个 type 属性
            dispatch({ type: 'location_action', locationData: res })
        }
    }
}

/**
 * 这个函数要有一个返回值，返回的是 state
 * @param {*} state 
 * @returns 
 */
const mapStateToProps = (state) => {
    return state.locationData
}

// 发送方，所以要实现 connect 第二个参数
// export default connect(mapStateToProps, mapDispatchToProps)(CityList) 