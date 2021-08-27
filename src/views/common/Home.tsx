import React, {useEffect} from 'react';

import {Alert, Breadcrumb, Button, Space, Typography} from "antd";
import Announcements from "../../components/home/Announcements";
import {PlusOutlined} from "@ant-design/icons";
import AuthService from "../../services/AuthService";

const authService = AuthService.getService();

const Home = () => {
	return (
		<>
			<Breadcrumb style={{margin: '16px 0'}}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
			</Breadcrumb>

			<div className={'view-container'}>
				<Space direction={'vertical'} style={{width: '100%'}}>
					<Alert
						type={'info'}
						message={'Welcome! This site is intended for use by stockroom staff, lab professors, and students. If you come across any issues or features you would like to see implemented, please submit a ticket!'}
						style={{textAlign: 'left'}}
					/>

					{
						authService.checkAccess('announceView') ?
							<>
								<Typography.Title level={2}>Announcements</Typography.Title>

								<Announcements/>
							</>
							:
							null
					}

				</Space>
			</div>
		</>
	);
}

export default Home;