/**  
 * 缓存数据优化  
 * 使用方法 【  
 *     一、设置缓存  
 *         string    storage.set('k', 'string你好啊');  
 *         json      storage.set('k', { "b": "3" }, 2);  
 *         array     storage.set('k', [1, 2, 3]);  
 *         boolean   storage.set('k', true);  
 *     二、读取缓存  
 *         默认值    storage.get('k')  
 *         string    storage.get('k', '你好')  
 *         json      storage.get('k', { "a": "1" })  
 *     三、移除/清理    
 *         移除: storage.remove('k');  
 *         清理：storage.clear();   
 * 】  
 * @type {String}  
 */
/**  
 * 设置缓存   
 * @param  {[type]} k [键名]  
 * @param  {[type]} v [键值]  
 */
function set(k, v) {
    let data = JSON.stringify([new Date(), v])
    window.localStorage.setItem(k, data)
}

/**  
 * 获取缓存   
 * @param  {[type]} k   [键名]  
 * @param  {[type]} def [获取为空时默认]  
 */
function get(k, def) {
    let res = window.localStorage.getItem(k);
    if (res) {
        return JSON.parse(res)[1];
    } else {
        if (def == undefined || def == "") def = false;
        return def;
    }
}

/**  
 * 清楚某个缓存   
 * @param  {[type]} k   [键名]  
 */
function remove(k) {
    window.localStorage.removeItem(k)
}

/**  
 * 清楚所有缓存   
 */
function clear() {
    window.localStorage.clear()
}

/**  
 * 清楚用户数据缓存   
 */
function clearUserInfo() {
    remove('token')
    remove('userInfo')
}

export default {
    set,
    get,
    remove,
    clear,
    clearUserInfo
}
