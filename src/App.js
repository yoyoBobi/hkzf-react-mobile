import React, { useEffect, useReducer } from 'react';
import SetRoutes from '@/router'
import { getAreaInfo } from '@/api/area'
import { connect } from 'react-redux'
import Storage from '@/utils/storage'
import { getUserInfo } from '@/api/user'
import { Dialog } from 'antd-mobile'


const App = (props) => {
  // 函数组件没有直接能用的hook，自己创建一个无意义state，仅用来用作强制重新渲染页面
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    initAreaInfo()
    updateUserInfo()
  }, [])

  // 在每次打开 好客租房时更新用户数据
  const updateUserInfo = async () => {
    try {
      // 判断本地是否存在 token
      if (Storage.get('token')) {
        // 获取用户信息
        let info = await getUserInfo()
        // 更新缓存用户信息
        Storage.set('userInfo', info.data.body)
      }
    } catch (err) { }
  }

  // 初始化项目时获取用户定位信息状态管理
  const initAreaInfo = () => {
    const myCity = new window.BMapGL.LocalCity();
    myCity.get(async res => {
      try {
        let msg = await getAreaInfo({ area: res.name }), valueCode = ''

        // redux 缓存定位信息
        // props.initLocation(Object.assign({}, res.center, msg.data.body))
        // 本地缓存定位信息，注意接口问题：请求获取对应的城市数据都是返回上海市的数据
        if (res.name.indexOf(msg.data.body.value) !== -1) valueCode = msg.data.body.value
        // 判断本地是否存在定位缓存
        if (Storage.get('location')) {
          // 判断本地定位缓存是否与当前位置相同
          if (res.name.indexOf(Storage.get('location').value) === -1) {
            Dialog.confirm({
              content: '当前地址与位置不一致，是否切换到' + res.name,
              onConfirm: async () => {
                Storage.set('location', Object.assign({}, res.center, { label: res.name, value: valueCode }))
                // 重新渲染页面
                forceUpdate()
              },
            })
          }
        } else {
          Storage.set('location', Object.assign({}, res.center, { label: res.name, value: valueCode }))
          // 重新渲染页面
          forceUpdate()
        }
      } catch (err) { }
    })
  }

  return (
    <SetRoutes></SetRoutes>
  )
}


/**
 * 这个函数要有一个返回值，返回值是一个对象，把方法挂载到 props 上
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = (dispatch) => {
  return {
    // 状态管理缓存，初始化用户定位信息
    initLocation: (res) => {
      // 利用 dsipatch 发送一个 action
      // 传递 action 对象 我们要定义一个 type 属性
      dispatch({ type: 'location_action', locationData: res })
    }
  }
}

// 发送方，所以要实现 connect 第二个参数
export default connect(null, mapDispatchToProps)(App) 