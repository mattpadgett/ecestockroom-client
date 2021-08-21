import React, {useEffect, useState} from "react";
import {Breadcrumb, Button, Dropdown, Form, Input, List, Menu, message, Modal, Popconfirm,
	Select, Space, Spin, Tabs, Typography} from "antd";
import { Link } from "react-router-dom";
import { api } from "../../App";
import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SettingOutlined
} from "@ant-design/icons";
import AuthService from "../../services/AuthService";

const authService = AuthService.getService();

var ObjectID = require("bson-objectid");

const StudentTools = () => {
	const [toolGroups, setToolGroups] = useState<any>();
	const [isToolGroupsLoading, setIsToolGroupsLoading] = useState(true);

	const [editGroupForm] = Form.useForm();
	const [loadedEditGroup, setLoadedEditGroup] = useState<any>();
	const [isEditGroupModalVisible, setIsEditGroupModalVisible] = useState(false);
	const [isEditGroupSaving, setIsEditGroupSaving] = useState(false);

	const [newGroupForm] = Form.useForm();
	const [isNewGroupModalVisible, setIsNewGroupModalVisible] = useState(false);
	const [isNewGroupSaving, setIsNewGroupSaving] = useState(false);

	const [editToolForm] = Form.useForm();
	const [loadedEditTool, setLoadedEditTool] = useState<any>();
	const [isEditToolModalVisible, setIsEditToolModalVisible] = useState(false);
	const [isEditToolSaving, setIsEditToolSaving] = useState(false);

	const [newToolForm] = Form.useForm();
	const [isNewToolModalVisible, setIsNewToolModalVisible] = useState(false);
	const [isNewToolSaving, setIsNewToolSaving] = useState(false);

	const handleShowEditGroupModal = (groupId: string) => {
		api.get(`/tool/${groupId}`)
			.then((response) => {
				setLoadedEditGroup(response.data);

				setIsEditGroupModalVisible(true);
			})
			.catch(() => {
				message.error('Could not load group details at this time. Please try again later. If this error persists, please submit a ticket.');
			})
			.finally(() => {
				editGroupForm.resetFields();
			})
	}

	const handleSaveEditGroup = (values: any) => {
		setIsEditGroupSaving(true);

		let group = loadedEditGroup;

		group.name = values.name;
		group.status = values.status;

		api.put(`/tool/${group.id}`, group)
			.then((response) => {
				message.success('Successfully saved changes!');
				loadToolGroups();
				setIsEditGroupSaving(false);
				setIsEditGroupModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save group details at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsEditGroupSaving(false);
				setIsEditGroupModalVisible(false);
			})
	}

	const handleShowEditToolModal = (groupId: string, toolId: string) => {
		api.get(`/tool/${groupId}`)
			.then((response) => {
				let data = response.data.tools.find((element: any) => element.toolId === toolId);
				setLoadedEditGroup(response.data);
				setLoadedEditTool(data);

				setIsEditToolModalVisible(true);
			})
			.catch(() => {
				message.error('Could not load tool details at this time. Please try again later. If this error persists, please submit a ticket.');
			})
			.finally(() => {
				editToolForm.resetFields();
			})
	}

	const handleSaveEditTool = (values: any) => {
		setIsEditToolSaving(true);

		let group = loadedEditGroup;
		let tool = loadedEditGroup.tools.find((element: any) => element.toolId === loadedEditTool.toolId);

		tool.name = values.name;
		tool.description = values.description;
		tool.url = values.url;
		tool.status = values.status;

		api.put(`/tool/${group.id}`, group)
			.then((response) => {
				message.success('Successfully saved changes!');
				loadToolGroups();
				setIsEditToolSaving(false);
				setIsEditToolModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save tool details at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsEditToolSaving(false);
				setIsEditToolModalVisible(false);
			})
	}

	const handleShowNewGroupModal = () => {
		setIsNewGroupModalVisible(true);
	}

	const handleSaveNewGroup = (values: any) => {
		setIsNewGroupSaving(true);

		let group = {
			id: ObjectID().toHexString(),
			name: values.name,
			tools: [],
			createdUtc: new Date().toISOString(),
			status: 'Active'
		};

		api.post(`/tool`, group)
			.then((response) => {
				message.success('Successfully added new tool group!');
				loadToolGroups();
				newGroupForm.resetFields();
				setIsNewGroupSaving(false);
				setIsNewGroupModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save the new tool group at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsNewGroupSaving(false);
				setIsNewGroupModalVisible(false);
			})
	}

	const handleShowNewToolModal = (groupId: any) => {
		api.get(`/tool/${groupId}`)
			.then((response) => {
				setLoadedEditGroup(response.data);

				setIsNewToolModalVisible(true);
			})
			.catch(() => {
				message.error('Could not load group details at this time. Please try again later. If this error persists, please submit a ticket.');
			})
	}

	const handleSaveNewTool = (values: any) => {
		setIsNewToolSaving(true);

		let group = loadedEditGroup;
		group.tools.push({
			toolId: ObjectID().toHexString(),
			name: values.name,
			description: values.description,
			url: values.url,
			createdUtc: new Date().toISOString(),
			status: 'Active'
		});

		api.put(`/tool/${group.id}`, group)
			.then((response) => {
				message.success('Successfully saved new tool!');
				loadToolGroups();
				newToolForm.resetFields();
				setIsNewToolSaving(false);
				setIsNewToolModalVisible(false);
			})
			.catch(() => {
				message.error('Could not save the new tool at this time. Please try again later. If this error persists, please submit a ticket.');
				setIsNewToolSaving(false);
				setIsNewToolModalVisible(false);
			})
	}

	const handleDeleteTool = (groupId: string, toolId: string) => {
		api.get(`/tool/${groupId}`)
			.then((response) => {
				let group = response.data;

				group.tools = group.tools.filter((element: any) => element.toolId != toolId);

				api.put(`/tool/${group.id}`, group)
					.then((response) => {
						message.success('Successfully deleted tool!');
						loadToolGroups();
					})
					.catch(() => {
						message.error('Could not delete the tool at this time. Please try again later. If this error persists, please submit a ticket.');
					})
			})
			.catch(() => {
				message.error('Could not delete the tool at this time. Please try again later. If this error persists, please submit a ticket.');
			})
	}

	const handleDeleteToolGroup = (groupId: string) => {
		api.delete(`/tool/${groupId}`)
			.then((response) => {
				message.success('Successfully deleted tool group!');
				loadToolGroups();
			})
			.catch(() => {
				message.error('Could not delete the tool group at this time. Please try again later. If this error persists, please submit a ticket.');
			})
	}

	const loadToolGroups = () => {
		setIsToolGroupsLoading(true);

		api.get(`/tool`)
			.then((response) => {
				setToolGroups(response.data);

				setIsToolGroupsLoading(false);
			})
			.catch(() => {
				message.error('Could not load tools at this time. Please try again later. If this error persists, please submit a ticket.');

				setIsToolGroupsLoading(false);
			})
	}

	useEffect(() => {
		loadToolGroups();
	}, []);

	return (
		<>
			<Breadcrumb style={{margin: '16px 0'}}>
				<Breadcrumb.Item>
					<Link to={'/'}>Home</Link>
				</Breadcrumb.Item>
				<Breadcrumb.Item>Tools</Breadcrumb.Item>
			</Breadcrumb>

			<div style={{textAlign: 'center', paddingRight: '16px'}}>
				<Typography.Title level={2}>Tools</Typography.Title>

				{
					authService.checkAccess('stuToolMgr') ?
						<div style={{textAlign: 'left'}}>
							<Button icon={<PlusOutlined/>} onClick={() => {handleShowNewGroupModal()}}>New Group</Button>
						</div>
					:
						null
				}

				<Spin spinning={isToolGroupsLoading}>
					<Tabs defaultActiveKey={'1'}>
						{
							toolGroups?.map((group: any, i: any) => (
								<Tabs.TabPane tab={group.name} key={i}>
									<Space direction={'vertical'} style={{width: '100%', textAlign: 'left'}}>
										{
											authService.checkAccess('stuToolMgr') ?
												<Space direction={'horizontal'}>
													<Button icon={<PlusOutlined/>} onClick={() => {handleShowNewToolModal(group.id)}}>New Tool</Button>
													<Button icon={<EditOutlined/>} onClick={() => {handleShowEditGroupModal(group.id)}}>Edit</Button>
													<Popconfirm
														title={'Are you sure you want to delete this group?'}
														okText={'Yes'}
														cancelText={'No'}
														onConfirm={() => {
															handleDeleteToolGroup(group.id)
														}}
													>
														<Button icon={<DeleteOutlined/>} danger={true}>Delete</Button>
													</Popconfirm>
												</Space>
												:
												null
										}
										<List
											itemLayout={'horizontal'}
											bordered={true}
											dataSource={group.tools}
											renderItem={(item: any) => (
												<List.Item
													actions={[
														<Space direction={'horizontal'}>
															{
																authService.checkAccess('stuToolMgr') ?
																	<Dropdown
																		trigger={['click']}
																		overlay={(
																			<Menu>
																				<Menu.Item key={1} icon={<EditOutlined/>} onClick={() => {handleShowEditToolModal(group.id, item.toolId)}}>
																					Edit
																				</Menu.Item>
																				<Popconfirm
																					title={'Are you sure you want to delete this tool?'}
																					okText={'Yes'}
																					cancelText={'No'}
																					onConfirm={() => {
																						handleDeleteTool(group.id, item.toolId)
																					}}
																				>
																					<Menu.Item key={3} icon={<DeleteOutlined/>} danger={true}>
																						Delete
																					</Menu.Item>
																				</Popconfirm>
																			</Menu>
																		)}
																	>
																		<Button icon={<SettingOutlined/>}></Button>
																	</Dropdown>
																	:
																	null
															}
															<Button type={'primary'} onClick={() => {window.open(item.url, '_blank')}}>View</Button>
														</Space>
													]}
												>
													<List.Item.Meta
														title={item.name}
														description={item.description}
													/>
												</List.Item>
											)}
											style={{textAlign: 'left'}}
										/>
									</Space>
								</Tabs.TabPane>
							))
						}
					</Tabs>
				</Spin>
			</div>

			<Modal
				title={'Edit Tool Group'}
				visible={isEditGroupModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isEditGroupSaving}}
				onOk={() => {
					editGroupForm
						.validateFields()
						.then((values: any) => {
							handleSaveEditGroup(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsEditGroupModalVisible(false);
					editGroupForm.resetFields();
				}}
			>
				<Form
					form={editGroupForm}
					layout={'vertical'}
					requiredMark={false}
					initialValues={{
						name: loadedEditGroup?.name,
						status: loadedEditGroup?.status
					}}
				>
					<Form.Item
						name={'name'}
						label={'Name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
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
				title={'New Tool Group'}
				visible={isNewGroupModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isNewGroupSaving}}
				onOk={() => {
					newGroupForm
						.validateFields()
						.then((values: any) => {
							handleSaveNewGroup(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsNewGroupModalVisible(false);
					newGroupForm.resetFields();
				}}
			>
				<Form
					form={newGroupForm}
					layout={'vertical'}
					requiredMark={false}
				>
					<Form.Item
						name={'name'}
						label={'Name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={'Edit Tool'}
				visible={isEditToolModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isEditToolSaving}}
				onOk={() => {
					editToolForm
						.validateFields()
						.then((values: any) => {
							handleSaveEditTool(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsEditToolModalVisible(false);
					editToolForm.resetFields();
				}}
			>
				<Form
					form={editToolForm}
					layout={'vertical'}
					requiredMark={false}
					initialValues={{
						name: loadedEditTool?.name,
						description: loadedEditTool?.description,
						url: loadedEditTool?.url,
						status: loadedEditTool?.status
					}}
				>
					<Form.Item
						name={'name'}
						label={'Name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Description'}
						name={'description'}
						rules={[{required: true, message: 'Description cannot be empty.'}]}
					>
						<Input.TextArea
							allowClear={true}
							autoSize={true}
							showCount={true}
							maxLength={250}
						/>
					</Form.Item>
					<Form.Item
						name={'url'}
						label={'URL'}
						rules={[{required: true, message: 'URL cannot be empty.'}]}
					>
						<Input/>
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
				title={'New Tool'}
				visible={isNewToolModalVisible}
				okText={'Save'}
				okButtonProps={{loading: isNewToolSaving}}
				onOk={() => {
					newToolForm
						.validateFields()
						.then((values: any) => {
							handleSaveNewTool(values);
						})
						.catch(() => {})
				}}
				onCancel={() => {
					setIsNewToolModalVisible(false);
					newToolForm.resetFields();
				}}
			>
				<Form
					form={newToolForm}
					layout={'vertical'}
					requiredMark={false}
				>
					<Form.Item
						name={'name'}
						label={'Name'}
						rules={[{required: true, message: 'Name cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
					<Form.Item
						label={'Description'}
						name={'description'}
						rules={[{required: true, message: 'Description cannot be empty.'}]}
					>
						<Input.TextArea
							allowClear={true}
							autoSize={true}
							showCount={true}
							maxLength={250}
						/>
					</Form.Item>
					<Form.Item
						name={'url'}
						label={'URL'}
						rules={[{required: true, message: 'URL cannot be empty.'}]}
					>
						<Input/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}

export default StudentTools;