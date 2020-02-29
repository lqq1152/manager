/*
reducer函数模块: 根据当前state和指定action返回一个新的state
 */
import {combineReducers} from 'redux'

import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERROR_MSG,
    RESET_USER
} from './action-types'
import storageUtils from "../utils/storageUtils";

/*
管理headTitle状态数据的reducer
 */
const initHeadTitle = '首页'

function headTitle(state = initHeadTitle, action) {
    console.log('headTitle()', state, action)
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

/*
管理user状态数据的reducer
 */
const initUser = storageUtils.getUser()

function user(state = initUser, action) {
    console.log('user()', state, action)
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR_MSG:
            return {...state, errorMsg: action.errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

/*
向外暴露合并后产生的总reducer函数
总的state的结构:
  {
    headerTitle: '',
    user: {}
  }
 */
export default combineReducers({
    headTitle,
    user,
})
