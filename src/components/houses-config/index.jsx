import { Grid } from 'antd-mobile'
import { useState } from "react";
import { useEffect } from "react";
import './index.scss'

const HouseConfig = (props) => {
    const [houseConfig, sethouseConfig] = useState([])

    useEffect(() => {
        sethouseConfig(props.configItem)
    }, [props])

    const data = [
        { label: '衣柜', icon: 'icon-shimuyigui' },
        { label: '洗衣机', icon: 'icon-xiyiji' },
        { label: '空调', icon: 'icon-kongdiao' },
        { label: '天然气', icon: 'icon-meiqitianranqi' },
        { label: '冰箱', icon: 'icon-bingxiang' },
        { label: '暖气', icon: 'icon-nuanqi-' },
        { label: '电视', icon: 'icon-dianshiji' },
        { label: '热水器', icon: 'icon-haofangtuo400iconfont2reshuiqi' },
        { label: '宽带', icon: 'icon-daikuan' },
        { label: '沙发', icon: 'icon-shafa' },
    ]

    const handlerItem = (val) => {
        // 判断 props 是否存在 handConfig 属性
        if (!props.hasOwnProperty('handConfig')) return
        // 对数组深拷贝
        let configItem = JSON.parse(JSON.stringify(houseConfig))
        // 判断数组中是否存在某个值，不存在就添加到数组中，否则删除
        if (configItem.indexOf(val.label) != -1) configItem.splice(configItem.indexOf(val.label), 1)
        else configItem.push(val.label)

        sethouseConfig(configItem)
        // 回调函数到父组件
        props.handConfig(configItem)
    }

    return (
        <Grid columns={5} gap={10}>
            {data.map(item =>
                <Grid.Item key={item.icon} className="flex_ctr flex_col" onClick={() => handlerItem(item)}>
                    <i className={['icon_fontSzie', 'iconfont', item.icon].join(' ')}
                        style={houseConfig.indexOf(item.label) == -1 ? { color: '#C0C4CC' } : { color: '#1677ff' }}></i>
                    <span className='config_span' style={houseConfig.indexOf(item.label) == -1 ? { color: '#C0C4CC' } : { color: '#1677ff' }}>
                        {item.label}
                    </span>
                </Grid.Item>
            )}
        </Grid>
    )
}

export default HouseConfig;