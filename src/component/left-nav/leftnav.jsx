import React, {useState,useEffect,useLayoutEffect} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import menuConfig from '../../config/menuConfig'

import './leftnav.less'
import memoryUtils from "../../utils/memoryUtils";

const SubMenu = Menu.SubMenu

/*
左侧导航组件
 */

function LeftNav(props) {
    /*
根据指定菜单数据列表产生<Menu>的子节点数组
使用 reduce() + 递归
*/
    const [menuSet,setMenuSet]=useState(new Set(memoryUtils.user.role.menus || []))

    function hasAuth (item) {
        const key = item.key;
        /*
        1. 如果菜单项标识为公开
        2. 如果当前用户是admin
        3. 如果菜单项的key在用户的menus中
         */
        if(item.isPublic || memoryUtils.user.username==='admin' || menuSet.has(key)) {
            return true
            // 4. 如果有子节点, 需要判断有没有一个child的key在menus中
        } else if(item.children){
            return !!item.children.find(child => menuSet.has(child.key))
        }
    }

    /*
    返回包含n个<Item>和<SubMenu>的数组
    */
    const [openKey,setOpenKey]=useState('');
    const path = props.location.pathname;


    function getMenuNodes  (list)  {

        // 得到当前请求的path


        return list.reduce((pre, item) => {
            if (hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    pre.push((
                        <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                            {
                                getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))

                    if(item.children.find(cItem => path.indexOf(cItem.key)===0)) {
                        setOpenKey(item.key)
                    }
                }
            }
            return pre
        }, [])
    }
    const [menuNodes,setMenuNodes]=useState(null);
    useEffect(()=>{
        setMenuNodes(getMenuNodes(menuConfig))
        console.log(menuNodes);
    },[]);


    const selectKey = props.location.pathname


    return (
        <div className="left-nav">
            <Link to='/home' className='logo-link'>

                <h1>后台管理</h1>
            </Link>

            <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[selectKey]}
                defaultOpenKeys={[openKey]}
            >
                {
                    menuNodes
                }
            </Menu>
        </div>
    )
}
// class LeftNav extends Component {
//
//     /*
//     根据指定菜单数据列表产生<Menu>的子节点数组
//     使用 reduce() + 递归
//     */
//     hasAuth = (item) => {
//         const key = item.key
//         const menuSet = this.menuSet
//         console.log(this);
//         /*
//         1. 如果菜单项标识为公开
//         2. 如果当前用户是admin
//         3. 如果菜单项的key在用户的menus中
//          */
//         if(item.isPublic || memoryUtils.user.username==='admin' || menuSet.has(key)) {
//             return true
//             // 4. 如果有子节点, 需要判断有没有一个child的key在menus中
//         } else if(item.children){
//             return !!item.children.find(child => menuSet.has(child.key))
//         }
//     }
//
//     /*
//     返回包含n个<Item>和<SubMenu>的数组
//     */
//     getMenuNodes = (list) => {
//
//         // 得到当前请求的path
//         const path = this.props.location.pathname
//
//         return list.reduce((pre, item) => {
//             if (this.hasAuth(item)) {
//                 if (!item.children) {
//                     pre.push((
//                         <Menu.Item key={item.key}>
//                             <Link to={item.key}>
//                                 <Icon type={item.icon}/>
//                                 <span>{item.title}</span>
//                             </Link>
//                         </Menu.Item>
//                     ))
//                 } else {
//                     pre.push((
//                         <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
//                             {
//                                 this.getMenuNodes(item.children)
//                             }
//                         </SubMenu>
//                     ))
//
//                     if(item.children.find(cItem => path.indexOf(cItem.key)===0)) {
//                         this.openKey = item.key
//                     }
//                 }
//             }
//             return pre
//         }, [])
//     }
//
//     componentWillMount () {
//         this.menuSet = new Set(memoryUtils.user.role.menus || [])
//         this.menuNodes = this.getMenuNodes(menuConfig)
//     }
//
//     render() {
//         // 得到当前请求路径, 作为选中菜单项的key
//         const selectKey = this.props.location.pathname
//         const openKey = this.openKey
//
//         return (
//             <div className="left-nav">
//                 <Link to='/home' className='logo-link'>
//
//                     <h1>后台管理</h1>
//                 </Link>
//
//                 <Menu
//                     mode="inline"
//                     theme="dark"
//                     selectedKeys={[selectKey]}
//                     defaultOpenKeys={[openKey]}
//                 >
//                     {
//                         this.menuNodes
//                     }
//                 </Menu>
//             </div>
//         )
//     }
// }
/*
withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 新组件会向被包装组件传递history/location/match属性
 */
export default withRouter(LeftNav)
/*
2个问题:
  1). 自动选中对应的菜单项
  2). 有可能需要自动菜单项
 */
