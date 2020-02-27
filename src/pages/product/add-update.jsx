import React, {PureComponent} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Button,
    message,
    Select
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import LinkButton from "../../component/link-button/link-button";

const {Item} = Form
const { TextArea } = Input
const { Option } = Select

/*
Product的添加和更新的子路由组件
 */
class ProductAddUpdate extends PureComponent {

    state = {
        categorys: [],
        product:{

        },
        isUpdate:null
    }

    constructor (props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    /*
    异步获取分类列表显示
    */
    getCategorys = async () => {
        const result = await reqCategorys()
        if (result.status===0) {
            const categorys = result.data

            this.setState({
                categorys
            })
        }
    }


    /*
    验证价格的自定义验证函数
     */
    validatePrice = (rule, value, callback) => {
        console.log(value, typeof value)
        if (value*1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证没通过
        }
    }

    submit = e => {
        e.preventDefault();
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                // 1. 收集数据, 并封装成product对象
                console.log(values);
                const {name, desc, price, categoryId} = values
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = { name, desc, price, categoryId, imgs, detail}

                // 如果是更新, 需要添加_id
                if(this.isUpdate) {
                    product._id = this.product._id
                }
                console.log("this====" ,  this.product  );
                console.log(product);
                // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)

                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
                }
            }
        })
    }

    componentDidMount () {
        this.getCategorys()
    }

    componentWillMount () {
        // 取出携带的state
        const product = this.props.location.state  // 如果是添加没值, 否则有值
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 保存商品(如果没有, 保存是{})
        this.product = product || {}
    }

    render() {

        const { categorys } = this.state
        const { isUpdate, product } = this
        const { categoryId, imgs, detail } = product

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },  // 左侧label的宽度
            wrapperCol: { span: 8 }, // 右侧包裹的宽度
        }

        // 头部左侧标题
        const title = (
            <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
        )

        const {getFieldDecorator} = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="商品名称">
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: '必须输入商品名称'}
                                ]
                            })(<Input placeholder='请输入商品名称'/>)
                        }
                    </Item>
                    <Item label="商品描述">
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: '必须输入商品描述'}
                                ]
                            })(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }} />)
                        }

                    </Item>
                    <Item label="商品价格">

                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: '必须输入商品价格'},
                                    {validator: this.validatePrice}
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='元'/>)
                        }
                    </Item>
                    <Item label="商品分类">
                        {
                            getFieldDecorator('categoryId', {
                                initialValue: categoryId || '',
                                rules: [
                                    {required: true, message: '必须指定商品分类'},
                                ]
                            })(
                                <Select
                                    placeholder='请选择商品分类'
                                >
                                    <Option value="">未选择</Option>
                                    {
                                        categorys.map(c => (
                                            <Option value={c._id} key={c._id}>{c.name}</Option>
                                        ))
                                    }
                                </Select>
                            )
                        }

                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)
