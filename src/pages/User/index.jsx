import { Image, Grid, Button, Dialog, Toast } from 'antd-mobile'
import Storage from '@/utils/storage'
import { baseURL } from '@/utils/request'
import { userLogout } from '@/api/user'
import { useNavigate } from 'react-router-dom'
import UserBg from '@/assets/image/user-bg.png'
import './index.scss'

const UserInfo = () => {
    // 获取本地用户缓存数据
    const userInfo = Storage.get('userInfo') || {}

    // 判断是否空对象
    const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object
    // 路由跳转
    const navigate = useNavigate()
    // 登录&&登出
    const handlerOut = () => {
        // 判断本地是否存在用户数据，没有则跳转到登录页面，否则弹出登录退出
        if (isEmpty(userInfo)) navigate('/login')
        else {
            Dialog.confirm({
                content: '是否确认退出登录？',
                onConfirm: async () => {
                    try {
                        // 登录退出请求
                        let res = await userLogout()

                        Toast.show({ icon: 'success', content: '退出成功' })
                        // 清楚用户数据缓存
                        Storage.clearUserInfo()

                        navigate('/login')
                    } catch (err) { }
                },
            })
        }

    }

    return (
        <div className='user_info mg-b-20'>
            <div className='bg_content'>
                <Image src={UserBg} width="100%" height={500} fit='cover' style={{ borderRadius: '0px 0px 500px 500px' }} />
            </div>
            <div className='user_content flex_ctr flex_col'>
                <div className='user_avater'>
                    <Image src={baseURL + userInfo.avatar} width={70} height={70} fit='cover' style={{ borderRadius: 35, boxShadow: '0 1px 1px #999' }} />
                </div>
                <div><span>{userInfo.nickname || '未登录'}</span></div>
                <Button block shape='rounded' size='small' color='primary' onClick={handlerOut}>
                    {isEmpty(userInfo) ? '点击登录' : '退出登录'}
                </Button>
            </div>
        </div>
    )
}


const User = () => {
    const navigate = useNavigate()

    const gridData = [
        { label: '我的收藏', icon: 'icon-shoucang', path: '/user/favorites' },
        { label: '我的出租', icon: 'icon-shouye', path: '/user/rental' },
        { label: '看房记录', icon: 'icon-11jilu-1', path: '' },
        { label: '成为房主', icon: 'icon-qiapian', path: '' },
        { label: '个人资料', icon: 'icon-geren', path: '/user/userInfo' },
        { label: '联系我们', icon: 'icon-kefu', path: '' }
    ]

    const handlerGrid = (val) => {
        if (!Storage.get('token')) {
            Dialog.confirm({
                content: '您还未登录，是否确认去登录？',
                onConfirm: async () => {
                    navigate('/login', { state: { type: 'back' } })
                },
            })
            return
        } else navigate(val)
    }

    return (
        <div className='info_box'>
            <UserInfo></UserInfo>

            <Grid columns={3} gap={20}>
                {gridData.map(item =>
                    <Grid.Item key={item.icon} className="flex_ctr flex_col" onClick={() => handlerGrid(item.path)}>
                        <i className={['iconfont', item.icon].join(' ')}></i>
                        <span className='mg-t-5'>{item.label}</span>
                    </Grid.Item>
                )}
            </Grid>
        </div>
    )
}

export default User