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
  BookOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setCourses(data);
    } catch (error) {
      message.error('Failed to fetch courses');
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
    setEditingCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (courseCode) => {
    try {
      await api.delete(`/courses/${courseCode}/`);
      message.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      message.error('Failed to delete course');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.course_code}/`, values);
        message.success('Course updated successfully');
      } else {
        await api.post('/courses/', values);
        message.success('Course created successfully');
      }
      setModalVisible(false);
      fetchCourses();
    } catch (error) {
      message.error('Failed to save course');
    }
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'course_code',
      key: 'course_code',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Department',
      dataIndex: 'dept_name',
      key: 'dept_name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
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
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record.course_code)}
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
          <Title level={2}>Course Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Course
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Courses"
              value={courses.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Departments"
              value={departments.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Avg Courses per Dept"
              value={departments.length > 0 ? Math.round(courses.length / departments.length) : 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="course_code"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} courses`,
          }}
        />
      </Card>

      <Modal
        title={editingCourse ? 'Edit Course' : 'Add Course'}
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
            name="course_code"
            label="Course Code"
            rules={[{ required: true, message: 'Please input course code!' }]}
          >
            <Input placeholder="e.g., CSC101" />
          </Form.Item>

          <Form.Item
            name="course_name"
            label="Course Name"
            rules={[{ required: true, message: 'Please input course name!' }]}
          >
            <Input placeholder="e.g., Introduction to Computer Science" />
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
                {editingCourse ? 'Update' : 'Create'}
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

export default Courses;
