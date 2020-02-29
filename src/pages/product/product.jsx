import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './pruduct.less'

/*
管理的商品管理路由组件
 */
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product' exact component={ProductHome}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Route path='/product/add-update' component={ProductAddUpdate}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}
