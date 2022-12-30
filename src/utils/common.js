
/**
 * 验证手机格式
 */
function mobile(value) {
    return /^1[3-9]\d{9}$/.test(value)
}
/**
 * 去除空格
 * @param {*} str，字符串
 * @param {*} pos，除去位置，默认 all 全部
 */
export function trim(str, pos = 'both') {
    if (pos == 'both') {
        return str.replace(/^\s+|\s+$/g, "");
    } else if (pos == "left") {
        return str.replace(/^\s*/, '');
    } else if (pos == 'right') {
        return str.replace(/(\s*$)/g, "");
    } else if (pos == 'all') {
        return str.replace(/\s+/g, "");
    } else {
        return str;
    }
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export function queryParams(data = {}, isPrefix = true, arrayFormat = 'brackets') {
    let prefix = isPrefix ? '?' : ''
    let _result = []
    if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1) arrayFormat = 'brackets';
    for (let key in data) {
        let value = data[key]
        // 去掉为空的参数
        if (['', undefined, null].indexOf(value) >= 0) {
            continue;
        }
        // 如果值为数组，另行处理
        if (value.constructor === Array) {
            // e.g. {ids: [1, 2, 3]}
            switch (arrayFormat) {
                case 'indices':
                    // 结果: ids[0]=1&ids[1]=2&ids[2]=3
                    for (let i = 0; i < value.length; i++) {
                        _result.push(key + '[' + i + ']=' + value[i])
                    }
                    break;
                case 'brackets':
                    // 结果: ids[]=1&ids[]=2&ids[]=3
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value)
                    })
                    break;
                case 'repeat':
                    // 结果: ids=1&ids=2&ids=3
                    value.forEach(_value => {
                        _result.push(key + '=' + _value)
                    })
                    break;
                case 'comma':
                    // 结果: ids=1,2,3
                    let commaStr = "";
                    value.forEach(_value => {
                        commaStr += (commaStr ? "," : "") + _value;
                    })
                    _result.push(key + '=' + commaStr)
                    break;
                default:
                    value.forEach(_value => {
                        _result.push(key + '[]=' + _value)
                    })
            }
        } else {
            _result.push(key + '=' + value)
        }
    }
    return _result.length ? prefix + _result.join('&') : ''
}
/**
 * 节流原理：在一定时间内，只能触发一次
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
let timer, flag;
function throttle(func, wait = 500, immediate = true) {
    if (immediate) {
        if (!flag) {
            flag = true;
            // 如果是立即执行，则在wait毫秒内开始时执行
            typeof func === 'function' && func();
            timer = setTimeout(() => {
                flag = false;
            }, wait);
        }
    } else {
        if (!flag) {
            flag = true
            // 如果是非立即执行，则在wait毫秒内的结束处执行
            timer = setTimeout(() => {
                flag = false
                typeof func === 'function' && func();
            }, wait);
        }

    }
};
/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 * 
 * @param {Function} func 要执行的回调函数 
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行 
 * @return null
 */
let timeout = null;
function debounce(func, wait = 500, immediate = false) {
    // 清除定时器
    if (timeout !== null) clearTimeout(timeout);
    // 立即执行，此类情况一般用不到
    if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(function () {
            timeout = null;
        }, wait);
        if (callNow) typeof func === 'function' && func();
    } else {
        // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
        timeout = setTimeout(function () {
            typeof func === 'function' && func();
        }, wait);
    }
}

// 判断是否空对象
export const isEmpty = obj => Reflect.ownKeys(obj).length === 0 && obj.constructor === Object

export default {
    queryParams,
    trim,
    debounce,
    throttle,
    mobile,
    isEmpty
};
