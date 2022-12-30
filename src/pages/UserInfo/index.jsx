import { NavBar, List, ImageUploader, Button, Dialog, Input, ActionSheet, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { updateUserInfo, uploadImage, getUserInfo } from '@/api/user'
import { useState } from 'react'
import { baseURL } from '@/utils/request'
import Storage from '@/utils/storage'
import './index.scss'

const UserInfo = () => {
    const userInfo = Storage.get('userInfo')
    const navigate = useNavigate()
    const [fileList, setFileList] = useState([{ url: baseURL + userInfo.avatar }])
    // 用户更新表单数据
    const [formData, setFormData] = useState(userInfo)
    // 定义弹窗输入框数据
    const [value, setValue] = useState('')
    // 定义整合弹窗数据
    const [dialogData, setDialogData] = useState({
        visible: false, title: '小区名称', key: ''
    })
    const [actionSheetShow, setSctionSheetShow] = useState(false)
    const actions = [
        { text: '男', key: '1' },
        { text: '女', key: '0' }
    ]

    // 图片上传操作
    const mockUpload = async (file) => {
        try {
            let res = await uploadImage({ file: file })

            return { url: baseURL + res.data.body[0], }
        } catch (err) { }
    }

    // 对话框操作
    const handlerItem = (key, data, title, type = 1) => {
        setDialogData({ visible: true, title: title, key: key })
        setValue(data)
    }
    // 头像图片上传回调
    const uploadOnchange = (val) => {
        console.log(2222, val);
        setFileList([val[1]])
        // 更新表单数据
        let avatar = [val[1]].map(e => e.url.replace(baseURL, ''))
        setFormData(Object.assign({}, formData, { avatar: avatar.join('') }))
    }
    // 保存修改个人资料
    const handlerConfirm = () => {
        console.log(111111, formData)
        Dialog.confirm({
            title: '提示',
            content: '是否确认修改个人资料？',
            onConfirm: async () => {
                try {
                    let res = await updateUserInfo(formData)
                    Toast.show({
                        content: '修改成功', icon: 'success',
                        duration: 1500, maskClickable: false
                    })
                    // 获取用户信息
                    let info = await getUserInfo()
                    // 缓存用户信息
                    Storage.set('userInfo', info.data.body)

                } catch (err) { }
            },
        })
    }

    return (
        <div className='user_info_box'>
            <NavBar onBack={() => navigate(-1)}>个人资料</NavBar>
            <List>
                <List.Item extra={
                    <div className='uploadImg pd-tb-10'>
                        <ImageUploader deletable={false} maxCount={2} style={{ '--cell-size': '60px' }}
                            value={fileList} onChange={uploadOnchange} upload={mockUpload} children={
                                <Button size='mini' color='primary'>修改头像</Button>
                            }>
                        </ImageUploader>
                    </div>
                }>
                    <span className='list_span'>头像</span>
                </List.Item>
                <List.Item extra={formData.nickname} onClick={() => handlerItem('nickname', formData.nickname, '用户名')}>
                    <span className='list_span'>用户名</span>
                </List.Item>
                <List.Item extra={formData.gender === '1' ? '男' : '女'} onClick={() => setSctionSheetShow(true)}>
                    <span className='list_span'>性别</span>
                </List.Item>
                <List.Item extra={formData.phone} onClick={() => handlerItem('phone', formData.phone || '', '手机号')}>
                    <span className='list_span'>手机号</span>
                </List.Item>
            </List>

            <div className='mg-t-80 pd-lr-20'>
                <Button block shape='rounded' color='primary' onClick={handlerConfirm}>保 存</Button>
            </div>

            <Dialog visible={dialogData.visible} title={dialogData.title} content={
                <div className='pd-5 mg-t-12' style={{ border: '1px solid #eee', borderRadius: '3px' }}>
                    <Input placeholder='请输入内容' style={{ '--text-align': 'center' }} value={value} onChange={val => setValue(val)} />
                </div>}
                actions={[
                    {
                        key: 'cancel',
                        text: '取消',
                        style: { color: '#999' },
                        onClick: () => setDialogData(Object.assign({}, dialogData, { visible: false }))
                    },
                    {
                        key: 'confirm',
                        text: '确定',
                        onClick: () => {
                            // 更新表单数据
                            let data = Object.assign({}, formData)
                            data[dialogData.key] = dialogData.key === 'phone' ? Number(value) : value
                            setFormData(data)
                            // 关闭弹窗
                            setDialogData(Object.assign({}, dialogData, { visible: false }))
                        }
                    }
                ]}>
            </Dialog>

            <ActionSheet
                extra='请选择你性别'
                cancelText='取消'
                visible={actionSheetShow}
                actions={actions}
                onClose={() => setSctionSheetShow(false)}
                onAction={val => {
                    setFormData(Object.assign({}, formData, { gender: val.key }))
                    setSctionSheetShow(false)
                }}
            />
        </div>
    )
}

export default UserInfo