import React from 'react'
import PropTypes from 'prop-types'
import {Upload, Icon, Modal, message} from 'antd'

import {BASE_IMG_PATH, UPLOAD_IMG_NAME} from '../../utils/constants'
import {reqDeleteImg} from '../../api'

/*
管理商品图片的组件(上传/删除图片)
 */
export default class PicturesWall extends React.Component {

    static propTypes = {
        imgs: PropTypes.array
    }

    constructor (props) {
        super(props)
        let fileList = []
        // 如果传入了imgs, 生成一个对应的fileList
        const imgs = this.props.imgs
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done', // loading: 上传中, done: 上传完成, remove: 删除
                url: BASE_IMG_PATH + img,
            }))
        }
        //初始化状态
        this.state = {
            previewVisible: false, // 是否显示大图预览
            previewImage: '', // 大图的url
            fileList: fileList // 所有需要显示的图片信息对象的数组
        }
    }

    /*
    得到当前已上传的图片文件名的数组
     */
    getImgs = () => this.state.fileList.map(file => file.name)

    /*
    关闭大图预览
     */
    handleCancel = () => this.setState({previewVisible: false})

    /*
    预览大图
     */
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl, // 需要显示的大图的url
            previewVisible: true,
        })
    }

    /*
    file: 当前操作文件信息对象
    fileList: 所有文件信息对象的数组
     */
    handleChange = async ({file, fileList}) => {
        console.log('handleChange()', file, fileList)
        // 如果上传图片完成
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传成功了')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传失败了')
            }
        } else if (file.status === 'removed') { // 删除图片
            const result = await reqDeleteImg(file.name)
            if(result.status===0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        // 更新fileList状态
        this.setState({fileList})
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div>上传图片</div>
            </div>
        )

        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"
                    name= {UPLOAD_IMG_NAME}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {uploadButton}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        )
    }
}
