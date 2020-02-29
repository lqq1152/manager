import React, {Component} from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'


import {BASE_IMG_PATH} from '../../utils/constants'
import {reqProduct} from '../../api'
import LinkButton from "../../component/link-button/link-button";

const Item = List.Item


/*
Product的详情子路由组件
 */
export default class ProductDetail extends Component {

    state = {
        categoryName: '', // 分类名称
    }

    async componentDidMount () {
        const {categoryId} = this.props.location.state.product
        console.log(this.props.location.state.product);
        console.log(categoryId);
        const result = await reqProduct(categoryId)
        console.log(result);
        const categoryName = result.data.name
        this.setState({ categoryName })
    }

    render() {

        // 读取携带过来的state数据
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const { categoryName } = this.state

        const title = (
            <span>
        <LinkButton>
          <Icon
              type='arrow-left'
              style={{marginRight: 10, fontSize: 20}}
              onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>商品详情</span>
      </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{ categoryName }</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
              {
                  imgs.map(img => (
                      <img
                          key={img}
                          src={BASE_IMG_PATH + img}
                          className="product-img"
                          alt="img"
                      />
                  ))
              }
            </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
                    </Item>

                </List>
            </Card>
        )
    }
}
