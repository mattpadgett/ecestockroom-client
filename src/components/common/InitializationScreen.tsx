import React from 'react';

import logo from '../../assets/png/double-t.png';
import {Col, Image, Layout, Row, Typography} from "antd";

const InitializationScreen = () => {
	return (
		<Layout style={{height: '100vh'}}>
			<Layout.Content style={{backgroundColor: 'var(--dark-gray)'}}>
				<Row justify={'center'} align={'middle'} style={{height: '100%'}}>
					<Col>
						<Row justify={'center'}>
							<Image
								src={logo}
								width={175}
								preview={false}
								className={'logo-grow-shrink'}
								style={{margin: 'auto'}}
							/>
						</Row>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}

export default InitializationScreen;