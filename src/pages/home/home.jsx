import React from 'react'
import './home.less'
import bg from '../../images/bg.jpg'

/*
Home路由组件
 */
export default function Home(props) {
    return (
        <div>
            <div className="home">
                欢迎使用后台管理系统
            </div>
            <img src={bg} alt="bg" className="bg"/>
        </div>

    )
}
