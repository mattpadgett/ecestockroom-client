import {
	Breadcrumb,
	Button,
	DatePicker,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Radio,
	Select,
	Space,
	Table,
	Typography
} from "antd";
import {Link} from "react-router-dom";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import moment from "moment/moment";
import React, {useEffect, useState} from "react";
import {api} from "../../App";

const PPSwipe = () => {
	const [swipeForm] = Form.useForm();
	const [ppEvents, setPPEvents] = useState<any>();
	const [isPPEventsLoading, setIsPPEventsLoading] = useState(true);

	const [selectedPPEvent, setSelectedPPEvent] = useState<any>();
	const [selectedMode, setSelectedMode] = useState<any>();

	const [enteredTechId, setEnteredTechId] = useState('');

	const handleTechIdChange = (event: any) => {
		setEnteredTechId(event.target.value);
	}

	useEffect(() => {
		const delay = setTimeout(() => {
			if(enteredTechId.startsWith(';') && enteredTechId.endsWith('?')) {
				swipeForm.setFieldsValue({
					['techId']: enteredTechId.substring(1, 9)
				});

				swipeForm.submit();
			}
		}, 250);

		return () => clearTimeout(delay);
	}, [enteredTechId]);

	const loadPPEvents = () => {
		setIsPPEventsLoading(true);

		api.get(`/ppevent/daily`)
			.then((response) => {
				setPPEvents(response.data);

				setIsPPEventsLoading(false);
			})
			.catch(() => {
				message.error('Could not load pro points events at this time. Please try again later. If this error persists, please submit a ticket.');

				setIsPPEventsLoading(false);
			})
	}

	const handleSwipe = (values: any) => {
		api.get(`/ppswipe/${selectedMode}/${values.techId}/${selectedPPEvent}`)
			.then((response) => {
				message.success(`Successfully checked ${selectedMode}!`, 5);
			})
			.catch((error) => {
				message.error(`Could not process check in/out. Reason: ${error.response.data.detail}`, 7);
			})

		swipeForm.resetFields();
		swipeForm.getFieldInstance(['techId']).focus();
	}

	useEffect(() => {
		loadPPEvents();
	}, []);

	return (
		<>
			<Breadcrumb style={{margin: '16px 0'}}>
				<Breadcrumb.Item>
					<Link to={'/'}>Home</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Pro Points</Breadcrumb.Item>
				<Breadcrumb.Item>Swipe</Breadcrumb.Item>
			</Breadcrumb>

			<div className={'view-container'}>
				<Space direction={'vertical'} style={{width: '100%'}}>
					<Typography.Title level={2}>Pro Points Swipe</Typography.Title>

					<Form
						form={swipeForm}
						layout={'vertical'}
						requiredMark={false}
						style={{width: '45%', margin: 'auto', padding: '16px'}}
						className={'shadow-box'}
						onFinish={handleSwipe}
					>
						<Form.Item
							label={'Event'}
						>
							<Select placeholder={'Select an event'} loading={isPPEventsLoading} onChange={(value: any) => {setSelectedPPEvent(value)}}>
								{
									ppEvents?.map((element: any) => (
										<Select.Option value={element.id}>{`[${element.type}] ${element.name}`}</Select.Option>
									))
								}
							</Select>
						</Form.Item>
						<Form.Item
							label={'Mode'}
						>
							<Radio.Group buttonStyle={'solid'} onChange={(value: any) => {setSelectedMode(value.target.value)}}>
								<Radio.Button value={'in'}>In</Radio.Button>
								<Radio.Button value={'out'}>Out</Radio.Button>
							</Radio.Group>
						</Form.Item>
						{
							selectedMode && selectedPPEvent &&
								<>
									<Form.Item
										label={'Tech ID (12345678)'}
										help={'Omit the R. Only enter the 8 numerical digits in the Tech ID.'}
										name={'techId'}
										rules={[{required: true, min: 8, max: 8}]}
									>
										<Input onChange={handleTechIdChange}/>
									</Form.Item>
									<Form.Item style={{textAlign: 'left'}}>
										<Button htmlType={'submit'} type={'primary'}>Go</Button>
									</Form.Item>
								</>
						}
					</Form>

				</Space>
			</div>
		</>
	);
}

export default PPSwipe;