import React from 'react';
import {Form, Icon, Input, Button} from 'antd';
import './login.less'



export default class Login extends React.Component {

    handleSubmit = e => {
        //阻止时间默认行为（不提交表单）
        e.preventDefault();
        // this.props.form.validateFields((err, values) => {
        //     if (!err) {
        //         console.log('Received values of form: ', values);
        //     }
        // });
    };

    render() {
        // const {getFieldDecorator} = this.props.form;
        return <div className="login">
            {/*<img src={bg} alt="bg"/>*/}
            <div className="login-header">
                <h2>后台管理系统</h2>
            </div>
            <div className="login-content">
                <h1>用户登录</h1>
                <div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>

                                <Input
                                    prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Username"
                                />

                        </Form.Item>
                        <Form.Item>

                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"
                                />

                        </Form.Item>
                        <Form.Item>

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