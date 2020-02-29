/*
* 接口请求函数
* 函数返回值是promise
* */

import jsonp from 'jsonp'

import ajax from './ajax'


export const reqLogin=(username,password)=>ajax({

    url:'./login',
    data:{username,password},
    method:'POST'
});

/*
通过jsonp请求获取天气信息
 */
export function reqWeather(city) {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    return new Promise((resolve, reject) => {
        jsonp(url, {
            param: 'callback'
        }, (error, response) => {
            if (!error && response.status === 'success') {
                const {dayPictureUrl, weather} = response.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                alert('获取天气信息失败')
            }
        })
    })
}

// 获取分类的列表
export const reqCategorys = () => ajax({url: '/manage/category/list'})

// 添加分类
export const reqAddCategory = (categoryName) => ajax({url: '/manage/category/add',data: {categoryName}, method:'POST'})

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax({ url:'/manage/category/update', data:{categoryId, categoryName}, method:'POST'})
// 根据分类ID获取分类
export const reqCategory = (categoryId) => ajax.get('/manage/category/info',{params:{categoryId}})

export const reqProduct = (productId) => ajax.get('/manage/product/info',{params:productId})
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax.get('/manage/product/list',{params:{pageNum, pageSize}})

// 根据ID/Name搜索产品分页列表
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => ajax({url:'/manage/product/search',data: {
    pageNum,
    pageSize,
    [searchType]: searchName,
}})

// 添加/更新商品
export const reqAddOrUpdateProduct = (product) => ajax({url:'/manage/product/' + (product._id ? 'update' : 'add'),data: product, method:'POST'})

// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax({url:'/manage/product/updateStatus', data:{
    productId,
    status
}, method:'POST'})

// 删除图片
export const reqDeleteImg = (name) => ajax({url:'/manage/img/delete',data: {name}, method:'POST'});

// 获取所有角色的列表
export const reqRoles = () => ajax.get('/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax.post( '/manage/role/add', {roleName})
// 添加角色
export const reqUpdateRole = (role) => ajax.post( '/manage/role/update', role)

// 获取所有用户的列表
export const reqUsers = () => ajax.get( '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax.post( '/manage/user/delete', {userId})
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax.post( '/manage/user/'+(user._id ? 'update' : 'add'), user)
