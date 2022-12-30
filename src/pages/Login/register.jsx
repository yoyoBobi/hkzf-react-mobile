import { NavBar, Input, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useState } from 'react'
import { userRegistered } from '@/api/user'
import Common from '@/utils/common'
import './index.scss'

const Register = () => {
    // 定义密码框显示隐藏
    const [eyePwd, setEyePwd] = useState('password')
    // 定义记住密码开关
    const [savePwd, setSavePwd] = useState(false)
    // 账户
    const [username, setUsername] = useState('')
    // 密码
    const [password, setPassword] = useState('')
    // 确认密码
    const [restPwd, setRestPwd] = useState('')

    const navigate = useNavigate()

    // 用户注册
    const handlerRegister = async () => {
        console.log(11111111111)
        try {
            console.log(11111, Common.mobile(Common.trim(username, 'all')), Common.trim(username));
            // if (!Common.mobile(Common.trim(username, 'all'))) {
            //     Toast.show({ content: '请输入正确的手机号' })
            //     return
            // }
            if (!password || !restPwd || password !== restPwd) {
                Toast.show({ content: '注册密码与确认密码不一致，且不能为空' })
                return
            }

            let registerData = { username: Common.trim(username, 'all'), password: password }
            // 用户登录获取 token
            let res = await userRegistered(registerData)

            Toast.show({
                icon: 'success', content: '注册成功',
                afterClose: () => {
                    navigate(-1)
                }
            })

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
            <NavBar onBack={() => navigate(-1)}>用户注册</NavBar>
            <div className='login_content flex_col  pd-lr-40'>

                <div className='input_item'>
                    <Input value={username} placeholder='账号/手机号' clearable onChange={(e) => {
                        setUsername(e)
                        //usernameChange(e)
                    }} />
                </div>

                <div className='input_item mg-t-10 flex_ctr'>
                    <Input type={eyePwd} value={password} placeholder='设置密码' clearable onChange={(e) => setPassword(Common.trim(e, 'all'))} />
                    <div onClick={() => setEyePwd(eyePwd == 'password' ? 'text' : 'password')}>
                        {eyePwd === 'password' ? <EyeInvisibleOutline fontSize={22} /> : <EyeOutline fontSize={22} />}
                    </div>
                </div>

                <div className='input_item mg-t-10 flex_ctr'>
                    <Input type={eyePwd} value={restPwd} placeholder='确认密码' clearable onChange={(e) => setRestPwd(Common.trim(e, 'all'))} />
                    <div onClick={() => setEyePwd(eyePwd == 'password' ? 'text' : 'password')}>
                        {eyePwd === 'password' ? <EyeInvisibleOutline fontSize={22} /> : <EyeOutline fontSize={22} />}
                    </div>
                </div>

                <div className='btn_login flex_ctr mg-t-40 mg-b-10' onClick={handlerRegister}>
                    <span>立即注册</span>
                </div>
            </div>
        </div>
    )
}

export default Register;