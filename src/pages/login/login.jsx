import React from 'react';
import {Form, Icon, Input, Button, Checkbox,message} from 'antd';



import './login.less'
import {reqLogin} from "../../api/index";
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from "react-router-dom";



 class Login extends React.Component {

    handleSubmit = e => {
        //阻止时间默认行为（不提交表单）
        e.preventDefault();
        this.props.form.validateFields(async (err, {username,password}) => {
            if (!err) {
                console.log(username, password);
                const result = await reqLogin(username,password);
                if(result.status === 0) {
                    // 提示登录成功
                    message.success('登录成功', 2);
                    // 保存用户登录信息
                    memoryUtils.user = result.data;
                    //保存storage
                    storageUtils.saveUser(result.data);
                    // // 跳转到主页面
                    this.props.history.replace('/')
                } else {
                    // 登录失败, 提示错误
                    message.error(result.msg)
                }
            } else {
                console.log('检验失败!')
            }
        });

            };

    render() {

        if (memoryUtils.user && memoryUtils.user._id) {

            return <Redirect to='/'/>
        }

        const {getFieldDecorator} = this.props.form;
        return <div className="login">
            {/*<img src={bg} alt="bg"/>*/}
            <div className="login-header">
                <h1>后台管理系统</h1>
            </div>
            <div className="login-content">
                <h1>用户登录</h1>
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: '请输入用户名!'},
                                    {min: 4, message: '用户名大于4位!'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '必须输入字母数字下划线!'}],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'},
                                    {min: 4, message: '密码大于4位!'},
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '必须输入字母数字下划线!'}],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>Remember me</Checkbox>)}
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

        </div>
    }
}

const weLogin = Form.create()(Login);
export default weLogin;