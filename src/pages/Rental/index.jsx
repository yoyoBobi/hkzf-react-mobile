import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getUserHousesList } from '@/api/user'
import HousesList from "@/components/houses-list";
import './index.scss'


// 我的出租主体模块
const Rental = (props) => {

    const navigate = useNavigate()
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getHousesList()
    }, [])

    // 获取已发布房源的列表
    const getHousesList = async () => {
        try {
            let res = await getUserHousesList()

            setDataList(res.data.body)
        } catch (err) { }
    }

    return (
        <div className='rental_box flex_col'>
            <NavBar onBack={() => navigate(-1)} right={<span onClick={() => navigate('/user/publish')}>发布房源</span>}>我的出租</NavBar>
            <div className='list_box pd-lr-10'>
                <HousesList list={dataList}></HousesList>
            </div>
        </div>
    )
}

export default Rental