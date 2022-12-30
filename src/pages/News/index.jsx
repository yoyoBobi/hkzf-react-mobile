import { Image, NavBar } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { getHomeNews } from '@/api/home'
import { baseURL } from '@/utils/request'
import Storage from '@/utils/storage'
import './index.scss'
import { useNavigate } from 'react-router-dom'

// 咨询列表
const NewsList = (props) => {
    const [list, setList] = useState([])


    useEffect(() => {
        getNews()
    }, [])

    const getNews = async () => {
        try {
            let res = await getHomeNews({ area: Storage.get('location').value })
            setList(res.data.body)
        } catch (err) { }
    }

    // 咨询列表中间线条
    const Line = (data) => {
        if (data.index !== 0) return <div className='news_line'></div>
    }

    const navigate = useNavigate()

    return list.map((item, index) =>
        <div key={item.id}>
            <Line index={index}></Line>
            <div className='news_item flex_ctr'>
                <Image src={baseURL + item.imgSrc} lazy width={100} height={80} style={{ borderRadius: 5 }} />
                <div className='item_right flex_col mg-l-10'>
                    <div><span style={{ fontWeight: '600' }}>{item.title}</span></div>
                    <div className='flex_bet'>
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </div>
                </div>
            </div>
        </div>)
}

// 咨询模块主体
const News = (props) => {

    const navigate = useNavigate()

    return (
        <div className='news_box'>
            <NavBar onBack={() => navigate(-1)}>咨询</NavBar>
            <div className="news_item_box pd-15">
                <NewsList data={props}></NewsList>
            </div>
        </div>
    )
}

export default News