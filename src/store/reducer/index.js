
// 默认值
const initState = {
    // 默认定位信息
    locationData: {
        lat: '',    // 纬度
        lng: '',    // 经度
        label: "北京",
        value: ""
    }
}

// reducer 要接收 action 然后进行逻辑处理
// 判断发送过来的 action 是不是我们需要的
// 如果是我们需要的，就 return 一个新的 state
exports.reducer = (state = initState, action) => {
    console.log('reducer：', state, action);
    switch (action.type) {
        case 'location_action':
            return Object.assign({}, state, action)

        default:
            return state
    }
}