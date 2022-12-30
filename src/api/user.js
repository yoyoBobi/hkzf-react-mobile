// 用户相关的接口
import $http from '@/utils/request'

// 用户注册接口
export function userRegistered(params) {
    return $http({ url: '/user/registered', method: 'post', data: params })
}

// 用户登录接口
export function userLogin(params) {
    return $http({ url: '/user/login', method: 'post', data: params })
}

// 获取用户的信息资料
export function getUserInfo(params) {
    return $http({ url: '/user', method: 'get', userInfo: params })
}

// 更新用户的数据
export function updateUserInfo(params) {
    return $http({ url: '/user', method: 'patch', data: params })
}

// 查看收藏列表
export function getUserFavoritesList(params) {
    return $http({ url: '/user/favorites', method: 'get', data: params })
}

// 房屋是否收藏
export function isUserFavorites(params) {
    return $http({ url: '/user/favorites/' + params, method: 'get' })
}

// 添加收藏
export function addUserFavorites(params) {
    return $http({ url: '/user/favorites/' + params, method: 'post' })
}

// 删除收藏
export function deleteUserFavorites(params) {
    return $http({ url: '/user/favorites/' + params, method: 'delete' })
}

// 发布房源
export function upUserHouses(params) {
    return $http({ url: '/user/houses', method: 'post', data: params })
}

// 查看已发布的房源列表
export function getUserHousesList(params) {
    return $http({ url: '/user/houses', method: 'get', data: params })
}

// 上下架房源
export function handUserHouses(params) {
    return $http({ url: '/user/houses/' + params, method: 'patch' })
}

// 用户登出接口
export function userLogout(params) {
    return $http({ url: '/user/logout', method: 'post', data: params })
}

// 房屋图像上传
export function uploadImage(params) {
    return $http({ url: '/houses/image', method: 'post', data: params, contentType: 'file' })
}



