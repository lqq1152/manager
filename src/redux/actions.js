/*
包含n个用来创建action的工厂函数(action creator)
 */
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'

import {reqLogin} from '../api'
import storageUtils from "../utils/storageUtils";

/*
设置头部标题的同步action
 */
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle})

/*
接收用户的同步action
 */
export const receiveUser = (user) => ({type: RECEIVE_USER, user})

/*
显示错误信息的同步action
 */
export const showErrorMsg = (errorMsg) => ({type: SHOW_ERROR_MSG, errorMsg})

/*
退出登陆的同步action
 */
export const logout = () => {
    storageUtils.removeUser()
    return {type: RESET_USER}
}

/*
登陆的异步action
 */
export const login = (username, password) => {
    return async dispatch => {
        const result = await reqLogin(username, password)
        if (result.status === 0) {
            const user = result.data
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        } else {
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
    }
}
