import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Tabs,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const Students = () => {
  const [studentGroups, setStudentGroups] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinatorModalVisible, setCoordinatorModalVisible] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingCoordinator, setEditingCoordinator] = useState(null);
  const [form] = Form.useForm();
  const [coordinatorForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupsRes, coordinatorsRes, departmentsRes] = await Promise.all([
        api.get('/student-groups/'),
        api.get('/class-coordinators/'),
        api.get('/departments/'),
      ]);

      const groupsData = Array.isArray(groupsRes.data.results) ? groupsRes.data.results : groupsRes.data;
      const coordinatorsData = Array.isArray(coordinatorsRes.data.results) ? coordinatorsRes.data.results : coordinatorsRes.data;
      const departmentsData = Array.isArray(departmentsRes.data.results) ? departmentsRes.data.results : departmentsRes.data;

      setStudentGroups(groupsData);
      setCoordinators(coordinatorsData);
      setDepartments(departmentsData);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGroup = () => {
    setEditingGroup(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditGroup = (record) => {
    setEditingGroup(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await api.delete(`/student-groups/${groupId}/`);
      message.success('Student group deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete student group');
    }
  };

  const handleAddCoordinator = () => {
    setEditingCoordinator(null);
    coordinatorForm.resetFields();
    setCoordinatorModalVisible(true);
  };

  const handleEditCoordinator = (record) => {
    setEditingCoordinator(record);
    coordinatorForm.setFieldsValue(record);
    setCoordinatorModalVisible(true);
  };

  const handleDeleteCoordinator = async (coordinatorId) => {
    try {
      await api.delete(`/class-coordinators/${coordinatorId}/`);
      message.success('Coordinator deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete coordinator');
    }
  };

  const handleSubmitGroup = async (values) => {
    try {
      if (editingGroup) {
        await api.put(`/student-groups/${editingGroup.group_id}/`, values);
        message.success('Student group updated successfully');
      } else {
        await api.post('/student-groups/', values);
        message.success('Student group created successfully');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save student group');
    }
  };

  const handleSubmitCoordinator = async (values) => {
    try {
      if (editingCoordinator) {
        await api.put(`/class-coordinators/${editingCoordinator.coordinator_id}/`, values);
        message.success('Coordinator updated successfully');
      } else {
        await api.post('/class-coordinators/', values);
        message.success('Coordinator created successfully');
      }
      setCoordinatorModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save coordinator');
    }
  };

  const groupColumns = [
    {
      title: 'Group ID',
      dataIndex: 'group_id',
      key: 'group_id',
    },
    {
      title: 'Group Code',
      dataIndex: 'group_code',
      key: 'group_code',
    },
    {
      title: 'Study Mode',
      dataIndex: 'study_mode',
      key: 'study_mode',
      render: (mode) => mode === 'FT' ? 'Full Time' : 'Weekend/Evening',
    },
    {
      title: 'Approx. Size',
      dataIndex: 'approx_size',
      key: 'approx_size',
      sorter: (a, b) => a.approx_size - b.approx_size,
    },
    {
      title: 'Department',
      dataIndex: 'dept_name',
      key: 'dept_name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditGroup(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this group?"
            onConfirm={() => handleDeleteGroup(record.group_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const coordinatorColumns = [
    {
      title: 'Student Name',
      dataIndex: 'student_name',
      key: 'student_name',
      sorter: (a, b) => a.student_name.localeCompare(b.student_name),
    },
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id',
    },
    {
      title: 'Email',
      dataIndex: 'student_email',
      key: 'student_email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Programme',
      dataIndex: 'programme',
      key: 'programme',
    },
    {
      title: 'Year',
      dataIndex: 'year_of_study',
      key: 'year_of_study',
    },
    {
      title: 'Department',
      dataIndex: ['department', 'dept_name'],
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <span style={{ color: active ? '#52c41a' : '#f5222d' }}>
          {active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditCoordinator(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this coordinator?"
            onConfirm={() => handleDeleteCoordinator(record.coordinator_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Student Management</Title>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Student Groups"
              value={studentGroups.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Class Coordinators"
              value={coordinators.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={studentGroups.reduce((sum, group) => sum + group.approx_size, 0)}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Departments"
              value={departments.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="groups">
        <TabPane tab="Student Groups" key="groups">
          <Card
            title="Student Groups"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddGroup}
              >
                Add Group
              </Button>
            }
          >
            <Table
              columns={groupColumns}
              dataSource={studentGroups}
              rowKey="group_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} groups`,
              }}
            />
          </Card>
        </TabPane>
        <TabPane tab="Class Coordinators" key="coordinators">
          <Card
            title="Class Coordinators"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCoordinator}
              >
                Add Coordinator
              </Button>
            }
          >
            <Table
              columns={coordinatorColumns}
              dataSource={coordinators}
              rowKey="coordinator_id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} coordinators`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Student Group Modal */}
      <Modal
        title={editingGroup ? 'Edit Student Group' : 'Add Student Group'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitGroup}
        >
          <Form.Item
            name="group_id"
            label="Group ID"
            rules={[{ required: true, message: 'Please input group ID!' }]}
          >
            <Input placeholder="e.g., G1" />
          </Form.Item>

          <Form.Item
            name="group_code"
            label="Group Code"
            rules={[{ required: true, message: 'Please input group code!' }]}
          >
            <Input placeholder="e.g., CSC-FT-1" />
          </Form.Item>

          <Form.Item
            name="study_mode"
            label="Study Mode"
            rules={[{ required: true, message: 'Please select study mode!' }]}
          >
            <Select placeholder="Select study mode">
              <Option value="FT">Full Time</Option>
              <Option value="WK">Weekend/Evening</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="approx_size"
            label="Approximate Size"
            rules={[{ required: true, message: 'Please input approximate size!' }]}
          >
            <InputNumber
              min={1}
              max={500}
              placeholder="Number of students"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="dept_id"
            label="Department"
            rules={[{ required: true, message: 'Please select department!' }]}
          >
            <Select placeholder="Select department">
              {departments.map(dept => (
                <Option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingGroup ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Coordinator Modal */}
      <Modal
        title={editingCoordinator ? 'Edit Coordinator' : 'Add Coordinator'}
        open={coordinatorModalVisible}
        onCancel={() => setCoordinatorModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={coordinatorForm}
          layout="vertical"
          onFinish={handleSubmitCoordinator}
        >
          <Form.Item
            name="student_name"
            label="Student Name"
            rules={[{ required: true, message: 'Please input student name!' }]}
          >
            <Input placeholder="e.g., John Doe" />
          </Form.Item>

          <Form.Item
            name="student_email"
            label="Student Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="student@university.edu" />
          </Form.Item>

          <Form.Item
            name="student_id"
            label="Student ID"
            rules={[{ required: true, message: 'Please input student ID!' }]}
          >
            <Input placeholder="e.g., 2023/BCS/001" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
          >
            <Input placeholder="+256 123 456 789" />
          </Form.Item>

          <Form.Item
            name="programme"
            label="Programme"
          >
            <Input placeholder="e.g., Bachelor of Computer Science" />
          </Form.Item>

          <Form.Item
            name="year_of_study"
            label="Year of Study"
          >
            <InputNumber min={1} max={6} placeholder="Year" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dept_id"
            label="Department"
            rules={[{ required: true, message: 'Please select department!' }]}
          >
            <Select placeholder="Select department">
              {departments.map(dept => (
                <Option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date_appointed"
            label="Date Appointed"
            rules={[{ required: true, message: 'Please select appointment date!' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCoordinator ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setCoordinatorModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
