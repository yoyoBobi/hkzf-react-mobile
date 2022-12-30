import { NavBar, Input, Divider, Image, Toast } from 'antd-mobile'
import { useLocation, useNavigate } from 'react-router-dom'
import { EyeInvisibleOutline, EyeOutline, CheckCircleOutline, CheckCircleFill } from 'antd-mobile-icons'
import { useState } from 'react'
import { userLogin, getUserInfo } from '@/api/user'
import Storage from '@/utils/storage'
import Common from '@/utils/common'
import LogoImg from '@/assets/image/logo.png'
import WxLogin from '@/assets/image/wxLogin.png'
import { useEffect } from 'react'
import './index.scss'

const Login = () => {
    // 获取路由传参
    const paramsState = useLocation()
    // 定义密码框显示隐藏
    const [eyePwd, setEyePwd] = useState('password')
    // 定义记住密码开关
    const [savePwd, setSavePwd] = useState(false)
    // 账户
    const [username, setUsername] = useState()
    // 密码
    const [password, setPassword] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        if (Storage.get('savePwd')) {
            setSavePwd(true)
            setUsername(Storage.get('savePwd').username)
            setPassword(Storage.get('savePwd').password)
        }
    }, [])

    // 用户登录
    const handlerLogin = async () => {
        try {
            let { type = '' } = paramsState.state || {}
            if (!username || !password) {
                Toast.show({ content: '请输入手机号和密码' })
            } else {
                let loginData = { username: Common.trim(username, 'all'), password: password }
                // 用户登录获取 token
                let res = await userLogin(loginData)
                // 缓存用户的 token 信息到本地
                Storage.set('token', res.data.body.token)
                // 判断是否记住密码，缓存到本地，否则清除已缓存的密码
                if (savePwd) Storage.set('savePwd', loginData)
                else Storage.remove('savePwd')

                // 获取用户信息
                let info = await getUserInfo()
                // 缓存用户信息
                Storage.set('userInfo', info.data.body)

                if (type === 'back') navigate(-1)
                else navigate('/home/user')
            }

        } catch (err) { }
    }
    // 账号输入规则
    const usernameChange = (e) => {
        // 只能输入数字
        let phone = e.replace(/[^\d]/g, '')
        // 手机号 分隔
        setUsername(phone.replace(/\s/g, '').replace(/(^\d{3})(?=\d)/g, "$1 ").replace(/(\d{4})(?=\d)/g, "$1 "))
    }

    return (
        <div className="login_box flex_col">
            <NavBar onBack={() => navigate(-1)}></NavBar>
            <div className='login_content flex_col  pd-lr-40'>
                <div className='flex_col flex_ctr login_log'>
                    <Image src={LogoImg} width={70} height={70} fit='cover' style={{ borderRadius: 35 }} />
                    <span>好客租房</span>
                </div>

                <Divider>Welcome</Divider>

                <div className='input_item'>
                    <Input value={username} placeholder='账号/手机号' clearable onChange={(e) => {
                        setUsername(e)
                        // usernameChange(e)
                    }} />
                </div>

                <div className='input_item mg-t-10 flex_ctr'>
                    <Input type={eyePwd} value={password} placeholder='密码' onChange={(e) => setPassword(Common.trim(e, 'all'))} />
                    <div onClick={() => setEyePwd(eyePwd == 'password' ? 'text' : 'password')}>
                        {eyePwd === 'password' ? <EyeInvisibleOutline fontSize={22} /> : <EyeOutline fontSize={22} />}
                    </div>
                </div>

                <div className='save_register mg-t-5 flex_bet'>
                    <div className='flex_ctr' onClick={() => setSavePwd(!savePwd)}>
                        {savePwd ? <CheckCircleFill fontSize={16} style={{ color: '#1677ff' }} /> : <CheckCircleOutline fontSize={16} style={{ color: '#999' }} />}
                        <span className='mg-l-5'>记住密码</span>
                    </div>
                    <div onClick={() => navigate('/register')}>
                        <span style={{ color: '#1677ff' }}>立即注册~</span>
                    </div>
                </div>

                <div className='btn_login flex_ctr mg-t-40 mg-b-10' onClick={handlerLogin}>
                    <span>登录</span>
                </div>

                <Divider>其它登录方式</Divider>

                <div className='flex_ctr'>
                    <Image src={WxLogin} width={40} height={40} fit='cover' style={{ borderRadius: 20 }} />
                </div>
            </div>
        </div>
    )
}

export default Login;