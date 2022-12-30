import { Image } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { getHomeNews } from '@/api/home'
import { baseURL } from '@/utils/request'
import { connect } from 'react-redux'
import Storage from '@/utils/storage'

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

    return list.map((item, index) =>
        <div key={item.id}>
            <Line index={index}></Line>
            <div className='news_item flex_ctr mg-t-15'>
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
    return (
        <div className="home_news_box pd-15">
            <h4>最新资讯</h4>
            <NewsList data={props}></NewsList>
        </div>
    )
}

/**
 * 这个函数要有一个返回值，返回的是 state
 * @param {*} state 
 * @returns 
 */
const mapStateToProps = (state) => {
    return state.locationData
}

// 接收方，所以要实现 connect 第一个参数
export default connect(mapStateToProps)(News)