import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/index.scss';
import App from '@/App';
import reportWebVitals from '@/reportWebVitals';
import store from '@/store'
import { Provider } from 'react-redux';
import { AliveScope } from 'react-activation'
import "@/assets/iconfont/iconfont.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode，严格模式，开启会触发两次 useEffect 调用，执行2次是为了模拟立即卸载组件和重新挂载组件
  // <React.StrictMode>
  <AliveScope>
    <Provider store={store}>
      <App />
    </Provider>
  </AliveScope>
  // </React.StrictMode>
);
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
