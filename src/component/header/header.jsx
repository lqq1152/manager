import React, {useEffect, useState} from 'react'
import {Modal} from 'antd'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import {reqWeather} from '../../api'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './header.less'
import LinkButton from "../link-button/link-button";

/*
头部组件使用HOOK组件
 */
function Header(props) {

    const [sysTime, setSysTime] = useState(formateDate(Date.now()));
    const [dayPictureUrl, setDayPictureUrl] = useState('');
    const [weather, setWeather] = useState('');

    async function getWeather() {
        const {dayPictureUrl, weather} = await reqWeather('成都');
        setDayPictureUrl(dayPictureUrl);
        setWeather(weather);
    }

    useEffect(() => {
        getWeather()
    }, []);
    useEffect(() => {
        let intervalId = setInterval(() => {
            setSysTime(formateDate(Date.now()))
        }, 1000);
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const user = memoryUtils.user

    // 得到当前请求的路径
    const path = props.location.pathname
    // 得到对应的标题

    const [title, setTitle] = useState('')

    useEffect(() => {
            menuList.forEach(menu => {
                if (menu.key === path) {
                    setTitle(menu.title)
                } else if (menu.children) {
                    menu.children.forEach(item => {
                        if (path.indexOf(item.key) === 0) {
                            setTitle(item.title)
                        }
                    })
                }
            })
        }
    );

    function logout(props) {

        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK')
                // 移除保存的user
                storageUtils.removeUser()
                memoryUtils.user = {}
                // 跳转到login
                props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    return (
        <div className="header">
            <div className="header-top">
                <span>欢迎, {user.username}</span>
                <LinkButton onClick={() => logout(props)}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">{title}</div>
                <div className="header-bottom-right">
                    <span>{sysTime}</span>
                    <img src={dayPictureUrl} alt="weather"/>
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )


}

// class Header extends Component {
//
//     state = {
//         sysTime: formateDate(Date.now()),
//         dayPictureUrl: '', // 天气图片的url
//         weather: ''
//     };
//
//
//     /*
//     发异步ajax获取天气数据并更新状态
//      */
//     getWeather = async () => {
//         const {dayPictureUrl, weather} = await reqWeather('成都')
//         this.setState({
//             dayPictureUrl,
//             weather
//         })
//     }
//
//     /*
//     启动循环定时器, 每隔1s更新一次sysTime
//      */
//     getSysTime = () => {
//         this.intervalId = setInterval(() => {
//             this.setState({
//                 sysTime: formateDate(Date.now())
//             })
//         }, 1000)
//     }
//
//     /*
//     退出登陆
//      */
//     logout = () => {
//         Modal.confirm({
//             content: '确定退出吗?',
//             onOk: () => {
//                 console.log('OK')
//                 // 移除保存的user
//                 storageUtils.removeUser()
//                 memoryUtils.user = {}
//                 // 跳转到login
//                 this.props.history.replace('/login')
//             },
//             onCancel() {
//                 console.log('Cancel')
//             },
//         })
//     }
//
//     /*
//     根据请求的path得到对应的标题
//      */
//     getTitle = (path) => {
//         let title
//         menuList.forEach(menu => {
//             if (menu.key === path) {
//                 title = menu.title
//             } else if (menu.children) {
//                 menu.children.forEach(item => {
//                     if (path.indexOf(item.key) === 0) {
//                         title = item.title
//                     }
//                 })
//             }
//         })
//
//         return title
//     }
//
//     componentDidMount() {
//         this.getSysTime()
//         this.getWeather()
//     }
//
//     componentWillUnmount() {
//         // 清除定时器
//         clearInterval(this.intervalId)
//     }
//
//     render() {
//         const {sysTime, dayPictureUrl, weather} = this.state
//
//         // 得到当前用户
//         const user = memoryUtils.user
//
//         // 得到当前请求的路径
//         const path = this.props.location.pathname
//         // 得到对应的标题
//         const title = this.getTitle(path)
//
//         return (
//             <div className="header">
//                 <div className="header-top">
//                     <span>欢迎, {user.username}</span>
//                     <LinkButton onClick={this.logout}>退出</LinkButton>
//                 </div>
//                 <div className="header-bottom">
//                     <div className="header-bottom-left">{title}</div>
//                     <div className="header-bottom-right">
//                         <span>{sysTime}</span>
//                         <img src={dayPictureUrl} alt="weather"/>
//                         <span>{weather}</span>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }

export default withRouter(Header)
