import { NavBar, List, Button, Dialog, Input, Popup, Selector, TextArea, ImageUploader, CheckList, Empty, Toast, SearchBar, Picker } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import paramsData from "@/pages/List/params";
import HousesConfig from '@/components/houses-config'
import { uploadImage, upUserHouses } from '@/api/user'
import { getAreaCommunity } from '@/api/area'
import { baseURL } from '@/utils/request'
import Storage from '@/utils/storage'
import './index.scss'

const TextMsg = (props) => {
    return (
        <span style={{ color: '#999' }}>{props.msg}</span>
    )
}

const Publish = (props) => {
    const navigate = useNavigate()
    // 发布表单数据
    const [dataForm, setDataForm] = useState({
        title: "",
        description: "",
        houseImg: "",
        oriented: "",
        supporting: "",
        price: "",
        roomType: "",
        size: "",
        floor: "",
        community: ""
    })
    // 定义弹窗输入框数据
    const [value, setValue] = useState('')
    // 定义整合弹窗数据
    const [dialogData, setDialogData] = useState({
        visible: false, title: '小区名称', key: ''
    })
    // 定义底部弹窗筛选数据
    const [popupData, setPopupData] = useState({
        visible: false, title: '户型', key: ''
    })
    // 默认上传图片数据
    const [fileList, setFileList] = useState([])
    // 底部小区选择弹窗
    const [communityShow, setCommunityShow] = useState(false)
    // 小区列表
    const [communityList, setCommunityList] = useState([])
    // 小区关键字
    const [communityValue, setCommunityValue] = useState('')
    // 小区名称
    const [communityName, setCommunityName] = useState('')
    // 小区默认值
    const [defaultValue, setDefaultValue] = useState('')

    const handleBack = () => {
        Dialog.confirm({
            title: '提示',
            content: '放弃发布房源？',
            confirmText: '继续编辑',
            cancelText: '放弃',
            onCancel: () => {
                navigate(-1)
            },
        })
    }

    // 对话框操作
    const handlerItem = (key, data, title, type = 1) => {
        if (type === 1) {
            setDialogData({ visible: true, title: title, key: key })
        } else {
            setPopupData({ visible: true, title: title, key: key })
        }
        setValue(data)
    }
    // 下拉弹窗确认选择回调
    const popupConfirm = (val = '') => {
        // 更新表单数据
        let data = Object.assign({}, dataForm)
        data[popupData.key] = val ? val : value
        setDataForm(data)
        // 关闭弹窗
        setPopupData(Object.assign({}, popupData, { visible: false }))
    }
    // 小区确认选择回调
    const communityConfirm = () => {
        let data = defaultValue.split(',')
        setDataForm(Object.assign({}, dataForm, { community: data[0] }))
        setCommunityName(data[1])
        setCommunityShow(false)
    }
    // 过滤
    const filter = (key, val) => {
        let res = paramsData[key].filter(item => item.value === val)
        return res[0].label
    }
    // 图片上传操作
    const mockUpload = async (file) => {
        try {
            let res = await uploadImage({ file: file })

            return { url: baseURL + res.data.body[0], }
        } catch (err) { }
    }
    // 图片上传或者删除成功后回调操作
    const onChangeImage = (val) => {
        setFileList(val)
        // 更新表单数据
        let houseImg = val.map(e => e.url.replace(baseURL, ''))
        setDataForm(Object.assign({}, dataForm, { houseImg: houseImg.join('|') }))
    }
    // 获取当前定位城市小区列表
    const getCommunityList = async () => {
        try {
            let res = await getAreaCommunity({ name: communityValue, id: Storage.get('location').value })

            setCommunityList(res.data.body)
        } catch (err) { }
    }
    // 确认发布
    const handlerConfirm = () => {
        console.log(2222, Object.values(dataForm))
        for (let key in dataForm) {
            if (!dataForm[key]) {
                Toast.show({ content: '还有未填写的房源信息' })
                return
            }
        }
        Dialog.confirm({
            title: '提示',
            content: '是否确认发布此房源信息？',
            onConfirm: async () => {
                try {
                    let res = await upUserHouses(dataForm)

                    Toast.show({
                        content: '发布成功',
                        icon: 'success',
                        duration: 1200,
                        maskClickable: false,
                        afterClose: () => { navigate(-1) }
                    })
                } catch (err) { }
            },
        })
    }

    return (
        <div className='publish_houses_box flex_col'>
            <NavBar onBack={handleBack}>发布房源</NavBar>

            <div className='content_box'>
                <List mode='card'>
                    <List.Item extra={communityName ? communityName : <TextMsg msg={'请输入小区名称'} />}
                        onClick={() => setCommunityShow(true)}>
                        <span className='list_span'>小区名称</span>
                    </List.Item>
                    <List.Item extra={dataForm.price ? dataForm.price + ' 元/月' : <TextMsg msg={'请输入租金/月'} />}
                        onClick={() => handlerItem('price', dataForm.price, '租金')}>
                        <span className='list_span'>租金</span>
                    </List.Item>
                    <List.Item extra={dataForm.size ? dataForm.size + '平米' : <TextMsg msg={'请输入建筑面积'} />}
                        onClick={() => handlerItem('size', dataForm.size, '建筑面积')}>
                        <span className='list_span'>建筑面积</span>
                    </List.Item>

                    <List.Item extra={dataForm.roomType ? filter('roomType', dataForm.roomType) : <TextMsg msg={'请选择'} />}
                        onClick={() => handlerItem('roomType', dataForm.roomType, '户型', 2)}>
                        <span className='list_span'>户型</span>
                    </List.Item>
                    <List.Item extra={dataForm.floor ? filter('floor', dataForm.floor) : <TextMsg msg={'请选择'} />}
                        onClick={() => handlerItem('floor', dataForm.floor, '所在楼层', 2)}>
                        <span className='list_span'>所在楼层</span>
                    </List.Item>
                    <List.Item extra={dataForm.oriented ? filter('oriented', dataForm.oriented) : <TextMsg msg={'请选择'} />}
                        onClick={() => handlerItem('oriented', dataForm.oriented, '朝向', 2)}>
                        <span className='list_span'>朝向</span>
                    </List.Item>

                    <List.Item><span className='list_span'>房屋标题</span></List.Item>
                    <List.Item>
                        <TextArea placeholder='请输入标题（例如：整租 小区名 2室 5000元）' value={dataForm.title} style={{ '--font-size': '15px' }}
                            onChange={val => { setDataForm(Object.assign({}, dataForm, { title: val })) }}
                        />
                    </List.Item>
                    <List.Item><span className='list_span'>房屋图像</span></List.Item>
                    <List.Item>
                        <ImageUploader value={fileList} onChange={onChangeImage} upload={mockUpload} />
                    </List.Item>
                    <List.Item><span className='list_span'>房屋配置</span></List.Item>
                    <List.Item>
                        <HousesConfig configItem={dataForm.supporting ? dataForm.supporting.split('|') : []}
                            handConfig={(val) => setDataForm(Object.assign({}, dataForm, { supporting: val.join('|') }))}></HousesConfig>
                    </List.Item>
                    <List.Item><span className='list_span'>房屋描述</span></List.Item>
                    <List.Item>
                        <TextArea placeholder='请输入房屋的描述信息' rows={4} value={dataForm.description} style={{ '--font-size': '15px' }}
                            onChange={val => { setDataForm(Object.assign({}, dataForm, { description: val })) }}
                        />
                    </List.Item>
                </List>
            </div>

            <div className="flex_">
                <div style={{ flex: 1 }}><Button block shape='rectangular' onClick={handleBack}>取 消</Button></div>
                <div style={{ flex: 1 }}>
                    <Button block color='primary' shape='rectangular' onClick={handlerConfirm}>提 交</Button>
                </div>
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
                            let data = Object.assign({}, dataForm)
                            data[dialogData.key] = value
                            setDataForm(data)
                            // 关闭弹窗
                            setDialogData(Object.assign({}, dialogData, { visible: false }))
                        }
                    }
                ]}>
            </Dialog>

            {/* <Popup visible={popupData.visible}>
                <div className='popup_form_box flex_col'>
                    <NavBar back='取消' onBack={() => setPopupData(Object.assign({}, popupData, { visible: false }))}
                        backArrow={false} right={<span style={{ fontSize: 15 }} onClick={() => popupConfirm()}>确认</span>}>{popupData.title}</NavBar>
                    <div className='content_box pd-10'>
                        <Selector options={paramsData[popupData.key]} defaultValue={[value]} columns={3}
                            onChange={(arr) => setValue(arr[0])} />
                    </div>
                </div>
            </Popup> */}

            <Picker title={popupData.title} columns={[paramsData[popupData.key]]} visible={popupData.visible}
                onClose={() => setPopupData(Object.assign({}, popupData, { visible: false }))}
                value={value} onConfirm={v => popupConfirm(v[0])} />


            <Popup visible={communityShow}>
                <div className='popup_form_box flex_col'>
                    <NavBar back='取消' onBack={() => setCommunityShow(false)}
                        backArrow={false} right={<span style={{ fontSize: 15 }} onClick={communityConfirm}>确认</span>}>小区名称</NavBar>
                    <div className='flex_ctr pd-10' style={{ border: '1px solid #eee' }}>
                        <SearchBar style={{ width: '100%' }} value={communityValue} onChange={val => setCommunityValue(val)} placeholder='请输入小区关键字'
                            clearOnCancel={false} cancelText='搜索' showCancelButton={() => true} onCancel={getCommunityList} />
                    </div>
                    <div className='content_box pd-10'>
                        {communityList.length <= 0 ?
                            <Empty description='暂无数据' /> :
                            <CheckList onChange={val => setDefaultValue(val[0])}>
                                {communityList.map(item => (
                                    <CheckList.Item key={item.community} value={item.community + ',' + item.communityName}>{item.communityName}</CheckList.Item>
                                ))}
                            </CheckList>
                        }
                    </div>
                </div>
            </Popup >
        </div >
    )
}

export default Publish