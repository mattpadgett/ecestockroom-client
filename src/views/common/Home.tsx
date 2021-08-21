import React, {useEffect} from 'react';

import {Breadcrumb, Typography} from "antd";

const Home = () => {
	return (
		<>
			<Breadcrumb style={{margin: '16px 0'}}>
				<Breadcrumb.Item>Home</Breadcrumb.Item>
			</Breadcrumb>
			<Typography.Title level={4}>This ECE Stockroom is better than yours!</Typography.Title>
		</>
	);
}

export default Home;