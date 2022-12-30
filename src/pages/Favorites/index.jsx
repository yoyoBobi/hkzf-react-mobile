import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getUserFavoritesList } from '@/api/user'
import HousesList from "@/components/houses-list";
import './index.scss'


// 我的收藏主体模块
const Favorites = (props) => {

    const navigate = useNavigate()
    const [dataList, setDataList] = useState([])

    useEffect(() => {
        getFavoritesList()
    }, [])
    // 获取收藏列表
    const getFavoritesList = async () => {
        try {
            let res = await getUserFavoritesList()

            setDataList(res.data.body)
        } catch (err) { }
    }

    return (
        <div className='favorites_box flex_col'>
            <NavBar onBack={() => navigate(-1)}>我的收藏</NavBar>
            <div className='list_box pd-lr-10'>
                <HousesList list={dataList}></HousesList>
            </div>
        </div>
    )
}

export default Favorites