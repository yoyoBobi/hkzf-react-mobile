// 区域接口
import $http from '@/utils/request'

// 获取城市列表数据
export function getAreaCityList(params) {
    return $http({ url: '/area/city', method: 'get', params: params, loading: true })
}

// 热门城市
export function getAreaHot(params) {
    return $http({ url: '/area/hot', method: 'get', params: params })
}

// 根据城市名称查询该城市信息
export function getAreaInfo(params) {
    return $http({ url: '/area/info', method: 'get', params: params })
}

// 小区关键词查询
export function getAreaCommunity(params) {
    return $http({ url: '/area/community', method: 'get', params: params })
}

// 查询房源数据
export function getAreaMap(params) {
    return $http({ url: '/area/map', method: 'get', params: params, loading: true })
}

// 获取子级城市列表
export function getAreaChildList(params) {
    return $http({ url: '/area', method: 'get', params: params })
}

