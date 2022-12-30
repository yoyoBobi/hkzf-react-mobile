import { createStore } from 'redux'

// 导入 reducer 处理函数
import { reducer } from './reducer'

// 构建 store
const store = createStore(reducer)

export default store