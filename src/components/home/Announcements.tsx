import {
	Button,
	Card,
	Dropdown,
	Form,
	Input,
	Menu,
	message,
	Modal,
	Popconfirm,
	Select,
	Space,
	Spin,
	Typography
} from "antd";
import React, {useEffect, useState} from "react";
import {api} from "../../App";
import {format} from 'date-fns';
import {DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined} from "@ant-design/icons";
import AuthService from "../../services/AuthService";

const authService = AuthService.getService();
var ObjectID = require("bson-objectid");

const Announcements = () => {
	const [announcements, setAnnouncements] = useState<any>();
	const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(true);

	const [editAnnouncementForm] = Form.useForm();
	const [loadedEditAnnouncement, setLoadedEditAnnouncement] = useState<any>();
	const [isEditAnnouncementModalVisible, setIsEditAnnouncementModalVisible] = useState(false);
	const [isEditAnnouncementSaving, setIsEditAnnouncementSaving] = useState(false);

	const [newAnnouncementForm] = Form.useForm();
	const [isNewAnnouncementModalVisible, setIsNewAnnouncementModalVisible] = useState(false);
	const [isNewAnnouncementSaving, setIsNewAnnouncementSaving] = useState(false);

	const handleSaveEditAnnouncement = (values: any) => {
		setIsEditAnnouncementSaving(true);

		let announcement = loadedEditAnnouncement;

		announcement.title = values.title;
		announcement.content = values.content;
		announcement.status = values.status;

		api.put(`/announcement/${announcement.id}`, announcement)
			.then((response) => {
				message.success('Successfully saved changes!');
				loadAnnouncements();
				setIsEditAnnouncementSaving(false);
				setIsEditAnnouncementModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save announcement details at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsEditAnnouncementSaving(false);
				setIsEditAnnouncementModalVisible(false);
			})
	}

	const handleSaveNewAnnouncement = (values: any) => {
		setIsNewAnnouncementSaving(true);

		let announcement = {
			title: values.title,
			content: values.content,
			createdUtc: new Date().toISOString(),
			status: 'Active'
		};

		api.post(`/announcement`, announcement)
			.then((response) => {
				message.success('Successfully added new announcement!');
				loadAnnouncements();
				newAnnouncementForm.resetFields();
				setIsNewAnnouncementSaving(false);
				setIsNewAnnouncementModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save the new announcement at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsNewAnnouncementSaving(false);
				setIsNewAnnouncementModalVisible(false);
			})
	}

	const handleShowNewAnnouncementModal = () => {
		setIsNewAnnouncementModalVisible(true);
	}

	const handleShowEditAnnouncementModal = (announcementId: string) => {
		api.get(`/announcement/${announcementId}`)
			.then((response) => {
				setLoadedEditAnnouncement(response.data);

				setIsEditAnnouncementModalVisible(true);
			})
			.catch(() => {
				message.error('Could not load announcement details at this time. Please try again later. If this error persists, please submit a ticket.');
			})
			.finally(() => {
				editAnnouncementForm.resetFields();
			})
	}

	const handleDeleteAnnouncement = (announcementId: string) => {
		api.delete(`/announcement/${announcementId}`)
			.then((response) => {
				message.success('Successfully deleted announcement!');
				loadAnnouncements();
			})
			.catch(() => {
				message.error('Could not delete the announcement at this time. Please try again later. If this error persists, please submit a ticket.');
			})
	}

	const loadAnnouncements = () => {
		setIsAnnouncementsLoading(true);

		api.get(`/announcement`)
			.then((response) => {
				setAnnouncements(response.data);

				setIsAnnouncementsLoading(false);
			})
			.catch(() => {
				message.error('Could not load announcements at this time. Please try again later. If this error persists, please submit a ticket.');

				setIsAnnouncementsLoading(false);
			})
	}

	useEffect(() => {
		loadAnnouncements();
	}, []);

	return (
		<>
			<Spin spinning={isAnnouncementsLoading}>
				<Space direction={'vertical'} style={{width: '100%'}}>
					{
						authService.checkAccess('announceMgr') ?
							<div style={{textAlign: 'center'}}>
								<Button icon={<PlusOutlined/>} onClick={() => {handleShowNewAnnouncementModal()}}>New Announcement</Button>
							</div>
						:
							null
					}

					{
						announcements?.map((announcement: any) => (
							<Card
								title={announcement.title}
								extra={(
									<Space>
										<Typography.Text>{format(new Date(announcement.createdUtc), 'MMMM dd, yyyy \'at\' hh:mm aa')}</Typography.Text>

										{
											authService.checkAccess('announceMgr') ?
												<Dropdown
													trigger={['click']}
													overlay={(
														<Menu>
															<Menu.Item key={1} icon={<EditOutlined/>} onClick={() => {handleShowEditAnnouncementModal(announcement.id)}}>
																Edit
															</Menu.Item>
															<Popconfirm
																title={'Are you sure you want to delete this announcement?'}
																okText={'Yes'}
																cancelText={'No'}
																onConfirm={() => {
																	handleDeleteAnnouncement(announcement.id)
																}}
															>
																<Menu.Item key={3} icon={<DeleteOutlined/>} danger={true}>
																	Delete
																</Menu.Item>
															</Popconfirm>
														</Menu>
													)}
												>
													<Button icon={<SettingOutlined/>} style={{float: 'right'}}/>
												</Dropdown>
												:
												null
										}
									</Space>
								)}
								style={{textAlign: 'left', maxWidth: '724px', margin: 'auto'}}
							>
								<Space direction={'vertical'} style={{width: '100%'}}>
									<Typography.Text>{announcement.content}</Typography.Text>
								</Space>
							</Card>
						))
					}
				</Space>
			</Spin>

			<Modal
				title={'Edit Announcement'}
				visible={isEditAnnouncementModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isEditAnnouncementSaving}}
				onOk={() => {
					editAnnouncementForm
						.validateFields()
						.then((values: any) => {
							handleSaveEditAnnouncement(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsEditAnnouncementModalVisible(false);
					editAnnouncementForm.resetFields();
				}}
			>
				<Form
					form={editAnnouncementForm}
					layout={'vertical'}
					requiredMark={false}
					initialValues={{
						title: loadedEditAnnouncement?.title,
						content: loadedEditAnnouncement?.content,
						status: loadedEditAnnouncement?.status
					}}
				>
					<Form.Item
						name={'title'}
						label={'Title'}
						rules={[{required: true, message: 'Title cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Content'}
						name={'content'}
						rules={[{required: true, message: 'Content cannot be empty.'}]}
					>
						<Input.TextArea
							allowClear={true}
							autoSize={true}
							showCount={true}
							maxLength={1000}
						/>
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
				title={'New Announcement'}
				visible={isNewAnnouncementModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isNewAnnouncementSaving}}
				onOk={() => {
					newAnnouncementForm
						.validateFields()
						.then((values: any) => {
							handleSaveNewAnnouncement(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsNewAnnouncementModalVisible(false);
					newAnnouncementForm.resetFields();
				}}
			>
				<Form
					form={newAnnouncementForm}
					layout={'vertical'}
					requiredMark={false}
				>
					<Form.Item
						name={'title'}
						label={'Title'}
						rules={[{required: true, message: 'Title cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Content'}
						name={'content'}
						rules={[{required: true, message: 'Content cannot be empty.'}]}
					>
						<Input.TextArea
							allowClear={true}
							autoSize={true}
							showCount={true}
							maxLength={250}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}

export default Announcements;