import React, {useState} from 'react';
import {Switch, NavLink, useLocation} from 'react-router-dom';

import TTURoute from '../components/routing/TTURoute';
import { RouteDefinition, routes } from '../routes';

import logo from '../assets/png/ece-logo-white.png';
import {Col, Layout, Menu, Row, Typography, Image, message} from "antd";
import {
	BarsOutlined,
	BuildOutlined,
	CalendarOutlined,
	DollarCircleOutlined, FireOutlined,
	HomeOutlined,
	IdcardOutlined,
	LogoutOutlined,
	PlusOutlined, RiseOutlined,
	SettingOutlined,
	ShoppingCartOutlined,
	SolutionOutlined, ThunderboltOutlined, ToolOutlined, UsergroupAddOutlined,
	UserOutlined
} from '@ant-design/icons';
import AuthService from "../services/AuthService";

const authService = AuthService.getService();

const SidebarLayout = () => {
	const currentLocation = useLocation();

	const handleLogout = () => {
		message.success('You have successfully logged out.');

		authService.clearTokens();
	}

	// @ts-ignore
	return (
		<Layout style={{height: '100vh'}}>
			<Layout.Sider>
				<div style={{padding: '10px'}}>
					<Image
						src={logo}
						preview={false}
					/>
				</div>
				<Menu
					theme={'dark'}
					defaultSelectedKeys={['1']}
					mode={'inline'}
					selectedKeys={[currentLocation.pathname]}
				>
					<Menu.Item key={'/'} icon={<HomeOutlined />}>
						<NavLink to={'/'}>Home</NavLink>
					</Menu.Item>
					<Menu.Item key={'/order'} icon={<ShoppingCartOutlined />}>
						<NavLink to={'/order'}>Order</NavLink>
					</Menu.Item>
					<Menu.Item key={'/budget'} icon={<DollarCircleOutlined />}>
						<NavLink to={'/budget'}>Budget</NavLink>
					</Menu.Item>
					<Menu.Item key={'/equipment'} icon={<BuildOutlined />}>
						<NavLink to={'/equipment'}>Equipment</NavLink>
					</Menu.Item>
					<Menu.Item key={'/naughty'} icon={<FireOutlined />}>
						<NavLink to={'/naughty'}>Naughty List</NavLink>
					</Menu.Item>
					<Menu.SubMenu key={'33cf1bb2-a1b7-40c9-ad70-210577a1fe02'} icon={<SettingOutlined />} title={'Management'}>
						<Menu.Item key={'/admin/users'} icon={<UserOutlined />}>
							<NavLink to={'/admin/users'}>Users</NavLink>
						</Menu.Item>
						<Menu.Item key={'/admin/roles'} icon={<UsergroupAddOutlined />}>
							<NavLink to={'/admin/roles'}>Roles</NavLink>
						</Menu.Item>
					</Menu.SubMenu>
					<Menu.Item key={'/certs'} icon={<SolutionOutlined />}>
						<NavLink to={'/certs'}>Certifications</NavLink>
					</Menu.Item>
					<Menu.Item key={'/stutools'} icon={<ToolOutlined />}>
						<NavLink to={'/stutools'}>Student Tools</NavLink>
					</Menu.Item>
					{
						authService.checkAccess('ppEventMgr') || authService.checkAccess('ppEventView') || authService.checkAccess('ppSwipe') ?
							<Menu.SubMenu key={'1fe4de91-7598-4cbb-87cf-955eba951764'} icon={<ThunderboltOutlined />} title={'Pro Points'}>
								{
									authService.checkAccess('ppSwipe') ?
										<Menu.Item key={'/pp/swipe'} icon={<IdcardOutlined/>}>
											<NavLink to={'/pp/swipe'}>Swipe</NavLink>
										</Menu.Item>
									:
										null
								}

								{
									authService.checkAccess('ppEventMgr') || authService.checkAccess('ppEventView') ?
										<Menu.Item key={'/pp/events'} icon={<CalendarOutlined />}>
											<NavLink to={'/pp/events'}>Events</NavLink>
										</Menu.Item>
									:
										null
								}
							</Menu.SubMenu>
						:
							null
					}
					<Menu.Item key={'/metrics'} icon={<RiseOutlined />}>
						<NavLink to={'/metrics'}>Metrics</NavLink>
					</Menu.Item>
					<Menu.Item
						key={3}
						icon={<LogoutOutlined />}
						onClick={handleLogout}
					>
						Log out
					</Menu.Item>
				</Menu>
			</Layout.Sider>
			<Layout>
				<Layout.Header style={{padding: '8px 16px'}}>
					<Typography.Title style={{color: '#FFFFFF'}}>ECE Stockroom</Typography.Title>
				</Layout.Header>
				<Layout.Content style={{margin: '0 0 0 16px'}}>
					<div style={{minHeight: '360px', height: '100%', overflow: 'auto'}}>
						<Switch>
							{
								routes.map((route: RouteDefinition, key) => {
									if(route.permissionKey) {
										if(authService.checkAccess(route.permissionKey)) {
											return (
												<TTURoute
													path={route.path}
													component={route.component}
													key={key}
												/>
											);										}
									} else {
										return (
											<TTURoute
												path={route.path}
												component={route.component}
												key={key}
											/>
										);
									}
								})
							}
						</Switch>
					</div>
				</Layout.Content>
				<Layout.Footer>
					<Row justify={'space-between'}>
						<Col>
							<Typography.Text>
								Stuff 1
							</Typography.Text>
						</Col>
						<Col>
							<Typography.Text>
								Stuff 2
							</Typography.Text>
						</Col>
					</Row>
				</Layout.Footer>
			</Layout>
		</Layout>
	);
}

export default SidebarLayout;