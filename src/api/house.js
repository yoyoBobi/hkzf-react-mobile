// 房屋相关的一些接口
import $http from '@/utils/request'

// 根据条件查询房屋
export function getHousesList(params) {
    return $http({ url: '/houses', method: 'get', params: params })
}

// 查询房屋具体信息
export function getHousesDetail(params) {
    return $http({ url: '/houses/' + params, method: 'get' })
}

// 获取房屋查询条件
export function getHousesCondition(params) {
    return $http({ url: '/houses/condition', method: 'get', params: params })
}

// 发布房屋所需的条件
export function getHousesParams(params) {
    return $http({ url: '/houses/params', method: 'get', params: params })
}

