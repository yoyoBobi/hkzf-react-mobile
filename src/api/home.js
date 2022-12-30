// 主要负责首页
import $http from '@/utils/request'

// 首页轮播图
export function getHomeSwiper(params) {
    return $http({ url: '/home/swiper', method: 'get', params: params })
}

// 租房小组
export function getHomeGroups(params) {
    return $http({ url: '/home/groups', method: 'get', params: params })
}

// 咨询
export function getHomeNews(params) {
    return $http({ url: '/home/news', method: 'get', params: params })
}

