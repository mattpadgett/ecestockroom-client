import React, {useEffect, useState} from "react";
import {
	Alert,
	Breadcrumb,
	Button, DatePicker,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	Select,
	Space,
	Table,
	Typography
} from "antd";
import Announcements from "../../components/home/Announcements";
import AuthService from "../../services/AuthService";
import {Link} from "react-router-dom";
import {api} from "../../App";
import {format} from "date-fns";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import moment from "moment/moment";

const authService = AuthService.getService();

const PPEvents = () => {
	const [ppEvents, setPPEvents] = useState<any>();
	const [isPPEventsLoading, setIsPPEventsLoading] = useState(true);

	const [editEventForm] = Form.useForm();
	const [loadedEditEvent, setLoadedEditEvent] = useState<any>();
	const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
	const [isEditEventSaving, setIsEditEventSaving] = useState(false);

	const [newEventForm] = Form.useForm();
	const [isNewEventModalVisible, setIsNewEventModalVisible] = useState(false);
	const [isNewEventSaving, setIsNewEventSaving] = useState(false);

	const handleSaveEditEvent = (values: any) => {
		setIsEditEventSaving(true);

		let ppEvent = loadedEditEvent;

		ppEvent.type = values.type;
		ppEvent.name = values.name;
		ppEvent.eventUtc = values.eventUtc.utc().toDate().toISOString();
		ppEvent.hourlyPointRate = values.hourlyPointRate;
		ppEvent.status = values.status;

		api.put(`/ppevent/${ppEvent.id}`, ppEvent)
			.then((response) => {
				message.success('Successfully saved changes!');
				loadPPEvents();
				setIsEditEventSaving(false);
				setIsEditEventModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save event details at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsEditEventSaving(false);
				setIsEditEventModalVisible(false);
			})
	}

	const handleSaveNewEvent = (values: any) => {
		setIsNewEventSaving(true);

		let ppEvent = {
			type: values.type,
			name: values.name,
			eventUtc: values.eventUtc.toISOString(),
			hourlyPointRate: values.hourlyPointRate,
			status: 'Active'
		};

		api.post(`/ppevent`, ppEvent)
			.then((response) => {
				message.success('Successfully added new event!');
				loadPPEvents();
				newEventForm.resetFields();
				setIsNewEventSaving(false);
				setIsNewEventModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save the new event at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsNewEventSaving(false);
				setIsNewEventModalVisible(false);
			})
	}

	const handleShowNewEventModal = () => {
		setIsNewEventModalVisible(true);
	}

	const handleShowEditEventModal = (eventId: string) => {
		api.get(`/ppevent/${eventId}`)
			.then((response) => {
				setLoadedEditEvent(response.data);

				setIsEditEventModalVisible(true);
			})
			.catch(() => {
				message.error('Could not load event details at this time. Please try again later. If this error persists, please submit a ticket.');
			})
			.finally(() => {
				editEventForm.resetFields();
			})
	}

	const loadPPEvents = () => {
		setIsPPEventsLoading(true);

		api.get(`/ppevent`)
			.then((response) => {
				setPPEvents(response.data);

				setIsPPEventsLoading(false);
			})
			.catch(() => {
				message.error('Could not load pro points events at this time. Please try again later. If this error persists, please submit a ticket.');

				setIsPPEventsLoading(false);
			})
	}

	useEffect(() => {
		loadPPEvents();
	}, [])

	return (
		<>
			<Breadcrumb style={{margin: '16px 0'}}>
				<Breadcrumb.Item>
					<Link to={'/'}>Home</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Pro Points</Breadcrumb.Item>
				<Breadcrumb.Item>Events</Breadcrumb.Item>
			</Breadcrumb>

			<div className={'view-container'}>
				<Space direction={'vertical'} style={{width: '100%'}}>
					<Typography.Title level={2}>Pro Points Events</Typography.Title>

					{
						authService.checkAccess('ppEventMgr') &&
							<div style={{textAlign: 'left'}}>
								<Button icon={<PlusOutlined />} onClick={() => {handleShowNewEventModal()}}>Add Event</Button>
							</div>
					}

					<Table
						columns={[
							{title: 'Type', key: 'type', dataIndex: 'type'},
							{title: 'Name', key: 'name', dataIndex: 'name'},
							{title: 'Hourly Point Rate', key: 'hourlyPointRate', dataIndex: 'hourlyPointRate'},
							{
								title: 'Date/Time',
								key: 'eventUtc',
								dataIndex: 'eventUtc',
								render: (text: string, record: any) => (
									<Typography.Text>{format(new Date(record.eventUtc), 'MMMM dd, yyyy \'at\' hh:mm aa')}</Typography.Text>
								)
							},
							{title: 'Status', key: 'status', dataIndex: 'status'},
							...authService.checkAccess('ppEventMgr') ?
								[{
									title: 'Action',
									render: (text: string, record: any) => (
										<Button
											icon={<EditOutlined />}
											onClick={() => {handleShowEditEventModal(record.id)}}
										>
											Edit
										</Button>
									)
								}]
							:
								[]
						]}
						loading={isPPEventsLoading}
						bordered={true}
						dataSource={ppEvents}
					/>
				</Space>
			</div>

			<Modal
				title={'Edit Event'}
				visible={isEditEventModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isEditEventSaving}}
				onOk={() => {
					editEventForm
						.validateFields()
						.then((values: any) => {
							handleSaveEditEvent(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsEditEventModalVisible(false);
					editEventForm.resetFields();
				}}
			>
				<Form
					form={editEventForm}
					layout={'vertical'}
					requiredMark={false}
					initialValues={{
						type: loadedEditEvent?.type,
						name: loadedEditEvent?.name,
						eventUtc: moment(loadedEditEvent?.eventUtc),
						hourlyPointRate: loadedEditEvent?.hourlyPointRate,
						status: loadedEditEvent?.status
					}}
				>
					<Form.Item
						name={'type'}
						label={'Type'}
					>
						<Select>
							<Select.Option value={'Tutorial'}>Tutorial</Select.Option>
							<Select.Option value={'Sport'}>Sport</Select.Option>
							<Select.Option value={'Company'}>Company</Select.Option>
							<Select.Option value={'Volunteer'}>Volunteer</Select.Option>
							<Select.Option value={'Tailgate'}>Tailgate</Select.Option>
							<Select.Option value={'Other'}>Other</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label={'Name'}
						name={'name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Event Date/Time'}
						name={'eventUtc'}
						rules={[{required: true, message: 'Event Date/Time cannot be empty.'}]}
					>
						<DatePicker showTime={true} format={'MM/DD/YYYY hh:mm A'} inputReadOnly={true}/>
					</Form.Item>

					<Form.Item
						label={'Hourly Point Rate'}
						name={'hourlyPointRate'}
						rules={[{required: true, message: 'Hourly Point Rate cannot be empty.'}]}
					>
						<InputNumber min={1} max={10}/>
					</Form.Item>
					<Form.Item
						name={'status'}
						label={'Status'}
					>
						<Select>
							<Select.Option value={'Active'}>Active</Select.Option>
							<Select.Option value={'Inactive'}>Inactive</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={'New Event'}
				visible={isNewEventModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isNewEventSaving}}
				onOk={() => {
					newEventForm
						.validateFields()
						.then((values: any) => {
							handleSaveNewEvent(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsNewEventModalVisible(false);
					newEventForm.resetFields();
				}}
			>
				<Form
					form={newEventForm}
					layout={'vertical'}
					requiredMark={false}
				>
					<Form.Item
						name={'type'}
						label={'Type'}
					>
						<Select>
							<Select.Option value={'Tutorial'}>Tutorial</Select.Option>
							<Select.Option value={'Sport'}>Sport</Select.Option>
							<Select.Option value={'Company'}>Company</Select.Option>
							<Select.Option value={'Volunteer'}>Volunteer</Select.Option>
							<Select.Option value={'Tailgate'}>Tailgate</Select.Option>
							<Select.Option value={'Other'}>Other</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						label={'Name'}
						name={'name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Event Date/Time'}
						name={'eventUtc'}
						rules={[{required: true, message: 'Event Date/Time cannot be empty.'}]}
					>
						<DatePicker showTime={true} format={'MM/DD/YYYY hh:mm A'} inputReadOnly={true}/>
					</Form.Item>

					<Form.Item
						label={'Hourly Point Rate'}
						name={'hourlyPointRate'}
						rules={[{required: true, message: 'Hourly Point Rate cannot be empty.'}]}
					>
						<InputNumber min={1} max={10} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default PPEvents;