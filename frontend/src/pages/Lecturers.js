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
  Switch,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLecturers();
    fetchDepartments();
  }, []);

  const fetchLecturers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/lecturers/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setLecturers(data);
    } catch (error) {
      message.error('Failed to fetch lecturers');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleAdd = () => {
    setEditingLecturer(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingLecturer(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (lecturerId) => {
    try {
      await api.delete(`/lecturers/${lecturerId}/`);
      message.success('Lecturer deleted successfully');
      fetchLecturers();
    } catch (error) {
      message.error('Failed to delete lecturer');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingLecturer) {
        await api.put(`/lecturers/${editingLecturer.lecturer_id}/`, values);
        message.success('Lecturer updated successfully');
      } else {
        await api.post('/lecturers/', values);
        message.success('Lecturer created successfully');
      }
      setModalVisible(false);
      fetchLecturers();
    } catch (error) {
      message.error('Failed to save lecturer');
    }
  };

  const columns = [
    {
      title: 'Lecturer ID',
      dataIndex: 'lecturer_id',
      key: 'lecturer_id',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Department',
      dataIndex: 'dept_name',
      key: 'dept_name',
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
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this lecturer?"
            onConfirm={() => handleDelete(record.lecturer_id)}
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
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>Lecturer Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Lecturer
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Lecturers"
              value={lecturers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Lecturers"
              value={lecturers.filter(l => l.is_active).length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Inactive Lecturers"
              value={lecturers.filter(l => !l.is_active).length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Departments"
              value={departments.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={lecturers}
          rowKey="lecturer_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} lecturers`,
          }}
        />
      </Card>

      <Modal
        title={editingLecturer ? 'Edit Lecturer' : 'Add Lecturer'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="lecturer_id"
            label="Lecturer ID"
            rules={[{ required: true, message: 'Please input lecturer ID!' }]}
          >
            <Input placeholder="e.g., LEC001" />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input placeholder="e.g., Dr. John Smith" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="lecturer@university.edu" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
          >
            <Input placeholder="+256 123 456 789" />
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
            name="is_active"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingLecturer ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Lecturers;
