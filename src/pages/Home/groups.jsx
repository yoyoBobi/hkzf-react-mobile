import { RightOutline } from 'antd-mobile-icons'
import { Image } from 'antd-mobile'
import { getHomeGroups } from '@/api/home'
import { useEffect, useState } from 'react'
import { baseURL } from '@/utils/request'
import Storage from '@/utils/storage'

// 租房小组列表模块
const List = () => {
    const [list, setList] = useState([])


    useEffect(() => {
        getGroups()
    }, [])

    const getGroups = async () => {
        try {
            let res = await getHomeGroups({ area: Storage.get('location').value })
            setList(res.data.body)
        } catch (err) { }
    }

    return (
        <div className='list_box'>
            {list.map(item => (
                <div className='list_item  mg-t-10 pd-10' key={item.id}>
                    <div className='flex_ctr'>
                        <div className='flex_col'>
                            <span>{item.title}</span>
                            <span className='mg-t-3'>{item.desc}</span>
                        </div>
                        <Image src={baseURL + item.imgSrc} lazy width={56} height={56} style={{ borderRadius: 28 }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

// 租房小组主体模块
const groups = (props) => {
    const handFn = () => {
        console.log(1111, props);
    }


    return (
        <div className="groups_box">
            {/* 顶部标题 */}
            <div className="top_title flex_ctr">
                <span>租房小组</span><span onClick={handFn}>更多<RightOutline /></span>
            </div>
            <List></List>
        </div>
    )
}

export default groups