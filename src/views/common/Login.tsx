import { useState, useEffect } from 'react';

import axios from 'axios';

import logo from '../../assets/png/ece-logo-black.png';

import {Row, Col, Image, Typography, Form, Input, Button, Space, Layout, message} from 'antd';
import {ClusterOutlined, UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import AuthService from "../../services/AuthService";
import Link from 'antd/lib/typography/Link';

const authService = AuthService.getService();

const Login = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form] = Form.useForm();

	const handleLogin = (values: any) => {
		setIsSubmitting(true);

		axios.get('/user/login', {
			params: {
				username: values.username,
				password: values.password,
			}
		})
		.then((response) => {
			authService.setTokens({accessToken: response.data.authToken, refreshToken: response.data.refreshToken});
			message.success('Successfully logged in.');

			setIsSubmitting(false);
			form.resetFields();
		})
		.catch((error) => {
			message.error('There was a problem logging in. Please try again later. If this error persists, please contact the application administrator.', 7)

			form.resetFields();
			setIsSubmitting(false);
		});
	}

	return (
		<Layout style={{height: '100vh'}}>
			<Layout.Content style={{backgroundColor: 'var(--dark-gray)'}}>
				<Row justify={'center'} align={'middle'} style={{height: '100%'}}>
					<Row gutter={32} className={'shadow-box'} style={{width: '50%'}}>
						<Col className={'gutter-row'} span={12} style={{textAlign: 'center'}}>
							<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
								<div>
								<Typography.Title>ECE Stockroom</Typography.Title>
								<Image
									src={logo}
									preview={false}
								/>
								</div>
							</div>
						</Col>
						<Col className={'gutter-row'} span={12} style={{textAlign: 'center'}}>
							<Typography.Title level={4}>Login</Typography.Title>
							<Form
								form={form}
								requiredMark={false}
								layout={'vertical'}
								onFinish={handleLogin}
							>
								<Form.Item

									name={'username'}
									rules={[{ required: true, message: 'Please provide a username.'}]}
								>
									<Input
										prefix={<UserOutlined className="site-form-item-icon" />}
										placeholder="Username"
										autoFocus={true}
									/>
								</Form.Item>

								<Form.Item
									name={'password'}
									rules={[{ required: true, message: 'Please provide a password.'}]}
								>
									<Input
										prefix={<LockOutlined className="site-form-item-icon" />}
										type="password"
										placeholder="Password"
									/>
								</Form.Item>

								<Form.Item style={{marginBottom: '8px'}}>
									<Space>
										<Button type={'primary'} htmlType={'submit'} loading={isSubmitting}>Login</Button>
										<Button type={'primary'} htmlType={'button'} onClick={() => {window.open('https://youtu.be/dQw4w9WgXcQ', '_blank')}} disabled={isSubmitting}>Register</Button>
									</Space>
								</Form.Item>
								<Form.Item style={{margin: '0'}}>
									<Link href={'https://youtu.be/dQw4w9WgXcQ'} target={'_blank'}>Forgot password?</Link>
								</Form.Item>
							</Form>
						</Col>
					</Row>
				</Row>
			</Layout.Content>
			<Layout.Footer style={{backgroundColor: 'var(--off-white-shadow-light)'}}>
				<Row justify={'space-between'}>
					<Col>
						<Typography.Text>
							{`Application Administrator: `}
							<Typography.Link
								href={'mailto:richard.woodcock@ttu.edu?subject=I Need Help: ECE Stockroom Website'}
							>
								{`Richard Woodcock `}
								<MailOutlined/>
							</Typography.Link>
						</Typography.Text>
					</Col>
					<Col>
						<Typography.Text>{`\u00a9 Texas Tech University ${new Date().getFullYear()}`}</Typography.Text>
					</Col>
				</Row>
			</Layout.Footer>
		</Layout>
	);
}

export default Login;