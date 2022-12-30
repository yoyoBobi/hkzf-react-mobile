import { useNavigate } from "react-router-dom"
import { Image } from 'antd-mobile'
import { baseURL } from '@/utils/request'
import './index.scss'

const HousesList = (props) => {
    const navigate = useNavigate()
    const dataList = props.list || []

    return dataList.map((item, index) => (
        <div className="houses-list-map_box flex_" key={index}
            onClick={() => navigate('/houses', { state: { code: item.houseCode } })}>
            <Image src={baseURL + item.houseImg} lazy width={106} height={80} />
            <div className='right_content flex_col mg-l-10'>
                <h3>{item.title}</h3>
                <div style={{ fontSize: '12px', color: '#afb2b3' }}>{item.desc}</div>
                <div>
                    {item.tags.map((tag, index) => {
                        return <span className={['tag_', 'tag_' + index].join(' ')} key={tag}>{tag}</span>
                    })}
                </div>
                <div className="price_">
                    <span>{item.price}</span> 元/月
                </div>
            </div>
        </div>
    ))
}

export default HousesList