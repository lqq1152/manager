import React, {Component} from 'react'
import {
    Card,
    Table,
    Button,
    Icon,
    message,
    Modal
} from 'antd'


import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'

import LinkButton from "../../component/link-button/link-button";
import CategoryForm from './categoryform'
/*
商品分类路由
 */
export default class Category extends Component {

    state = {
        loading: false, // 是否正在获取数据中
        categorys: [], // 分类列表
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 不显示, 1: 显示添加, 2: 显示更新
    }

    /*
    初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标签
                    <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                )
            }
        ]
    }


    /*
    异步获取分类列表显示
    parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
     */
    getCategorys = async () => {

        // 在发请求前, 显示loading
        this.setState({loading: true})
        // 发异步ajax请求, 获取数据
        const result = await reqCategorys()
        // 在请求完成后, 隐藏loading
        this.setState({loading: false})

        if (result.status === 0) {
            // 取出分类数组
            const categorys = result.data
            // 更新分类状态
            this.setState({
                categorys
            })
        } else {
            message.error('获取分类列表失败')
        }
    }

    /*
    响应点击取消: 隐藏确定框
     */
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    /*
    显示添加的确认框
     */
    showAdd = () => {
        this.category = null
        this.setState({
            showStatus: 1
        })
    }

    /*
    显示修改的确认框
     */
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }

    /*
    添加/更新分类
     */
    addOrUpdateCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 隐藏确认框
                this.setState({
                    showStatus: 0
                })

                // 清除输入数据
                this.form.resetFields()

                // 收集数据
                const {categoryName} = values
                const category = this.category
                let result
                if (category) {
                    const categoryId = category._id
                    result = await reqUpdateCategory({categoryId, categoryName})
                } else {
                    result = await reqAddCategory(categoryName)
                }
                if (result.status === 0) {
                    // 重新获取当前分类列表显示
                    this.getCategorys()
                } else {
                    message.error(result.msg)
                }
            }
        })
    }

    /*
    为第一次render()准备数据
     */
    componentWillMount() {
        this.initColumns()
    }

    /*
    执行异步任务: 发异步ajax请求
     */
    componentDidMount() {
        // 获取分类列表显示
        this.getCategorys()
    }

    render() {

        // 读取状态数据
        const {categorys, loading, showStatus} = this.state
        // 读取指定的分类
        const category = this.category || {} // 如果还没有指定一个空对象

        let modalTitle
        if (showStatus === 1) {
            modalTitle = '添加分类'
        } else if (showStatus === 2) {
            modalTitle = '更新分类'
        }

        // Card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )

        return (
            <Card extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    loading={loading}
                    dataSource={categorys}
                    columns={this.columns}
                    pagination={{defaultPageSize: 3, showQuickJumper: true}}
                />

                <Modal
                    title={modalTitle}
                    visible={showStatus !== 0}
                    onOk={this.addOrUpdateCategory}
                    onCancel={this.handleCancel}
                >
                    <CategoryForm
                        categoryName={category.name}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>
            </Card>
        )
    }
}
