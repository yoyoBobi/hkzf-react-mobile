
// 楼层
let floor = [
    {
        label: "高楼层",
        value: "FLOOR|1"
    },
    {
        label: "中楼层",
        value: "FLOOR|2"
    },
    {
        label: "低楼层",
        value: "FLOOR|3"
    }
];

// 合租和整租
let line = [
    {
        label: "不限",
        value: "null"
    },
    {
        label: "整租",
        value: true
    },
    {
        label: "合租",
        value: false
    }
];

// 朝向
let oriented = [
    {
        label: "东",
        value: "ORIEN|141b98bf-1ad0-11e3"
    },
    {
        label: "西",
        value: "ORIEN|103fb3aa-e8b4-de0e"
    },
    {
        label: "南",
        value: "ORIEN|61e99445-e95e-7f37"
    },
    {
        label: "北",
        value: "ORIEN|caa6f80b-b764-c2df"
    },
    {
        label: "东南",
        value: "ORIEN|dfb1b36b-e0d1-0977"
    },
    {
        label: "东北",
        value: "ORIEN|67ac2205-7e0f-c057"
    },
    {
        label: "西南",
        value: "ORIEN|2354e89e-3918-9cef"
    },
    {
        label: "西北",
        value: "ORIEN|80795f1a-e32f-feb9"
    }
]
// 价格
let price = [
    {
        label: "不限",
        value: "null"
    },
    {
        label: "1000及以下",
        value: "PRICE|1000"
    },
    {
        label: "1000 - 2000",
        value: "PRICE|2000"
    },
    {
        label: "2000 - 3000",
        value: "PRICE|3000"
    },
    {
        label: "3000 - 4000",
        value: "PRICE|4000"
    },
    {
        label: "4000 - 5000",
        value: "PRICE|5000"
    },
    {
        label: "5000 - 7000",
        value: "PRICE|7000"
    },
    {
        label: "7000以上",
        value: "PRICE|100001"
    }
];

// 房屋类型
let roomType = [
    {
        label: "一室",
        value: "ROOM|d4a692e4-a177-37fd"
    },
    {
        label: "二室",
        value: "ROOM|d1a00384-5801-d5cd"
    },
    {
        label: "三室",
        value: "ROOM|20903ae0-c7bc-f2e2"
    },
    {
        label: "四室",
        value: "ROOM|ce2a5daa-811d-2f49"
    },
    {
        label: "四室+",
        value: "ROOM|2731c38c-5b19-ff7f"
    }
]

// 房屋亮点
const characteristic = [
    {
        label: "精装",
        value: "CHAR|1d9bf0be-284f-93dd"
    },
    {
        label: "随时看房",
        value: "CHAR|ee11187b-a631-beef"
    },
    {
        label: "近地铁",
        value: "CHAR|76eb0532-8099-d1f4"
    },
    {
        label: "集中供暖",
        value: "CHAR|f56b9ad7-a97c-b28f"
    },
    {
        label: "双卫生间",
        value: "CHAR|51ae05f0-7c7a-c24b"
    },
    {
        label: "公寓",
        value: "CHAR|2d9fb1b2-dbf9-eb64"
    },
    {
        label: "独立卫生间",
        value: "CHAR|c3d3e453-c3fa-d4af"
    },
    {
        label: "押一付一",
        value: "CHAR|f838b575-9196-bf13"
    },
    {
        label: "独立阳台",
        value: "CHAR|479e8f8a-f193-9605"
    },
    {
        label: "月租",
        value: "CHAR|3870eb95-3f80-e5f8"
    },
    {
        label: "限女生",
        value: "CHAR|014e0e46-2147-8785"
    },
    {
        label: "限男生",
        value: "CHAR|7121e024-499d-c929"
    },
    {
        label: "新上",
        value: "CHAR|41e8322b-3846-d721"
    }
]

const tabsList = [
    {
        key: 'roomType',
        title: '户型',
    },
    {
        key: 'oriented',
        title: '朝向',
    },
    {
        key: 'floor',
        title: '楼层',
    },
    {
        key: 'characteristic',
        title: '房屋亮点',
    }
]

export default {
    floor,
    line,
    oriented,
    price,
    roomType,
    characteristic,
    tabsList
}