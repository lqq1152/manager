import React, {Component} from 'react'


import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd'

import menuConfig from '../../config/menuConfig'

import './leftnav.less'

const SubMenu = Menu.SubMenu;

/*
左侧导航组件
 */
class LeftNav extends Component {

    /*
    根据指定菜单数据列表产生<Menu>的子节点数组
    使用 reduce() + 递归
    */
    getMenuNodes = (menuList) => {

        // 得到当前请求的path
        const path = this.props.location.pathname;

        return menuList.reduce((pre, item) => {
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
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ));

                // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
                if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                    this.openKey = item.key
                }
            }
            return pre
        }, [])
    };

    /*
    根据指定菜单数据列表产生<Menu>的子节点数组
    使用 map() + 递归
    */
    getMenuNodes2 = (menuList) => {

        // 得到当前请求的path
        const path = this.props.location.pathname

        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
                if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) {
                    this.openKey = item.key
                }
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    };

    /*
    在第一次render()之前执行一次
    一般可以在此同步为第一次render()准备数据
     */
    componentWillMount() {
        // this.menuNodes = this.getMenuNodes(menuConfig)
        this.menuNodes = this.getMenuNodes2(menuConfig)
    }

    render() {
        // 得到当前请求路径, 作为选中菜单项的key
        const selectKey = this.props.location.pathname;
        const openKey = this.openKey;

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
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/*
withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 新组件会向被包装组件传递history/location/match属性
 */
export default withRouter(LeftNav)
/*
2个问题:
  1). 自动选中对应的菜单项
  2). 有可能需要自动菜单项
 */
