import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Select,
  TimePicker,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const Allocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [form] = Form.useForm();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const recurrenceOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-Weekly' },
    { value: 'one-time', label: 'One Time' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allocationsRes, roomsRes, sessionsRes] = await Promise.all([
        api.get('/allocations/'),
        api.get('/rooms/'),
        api.get('/lecture-sessions/'),
      ]);

      const allocationsData = Array.isArray(allocationsRes.data.results) ? allocationsRes.data.results : allocationsRes.data;
      const roomsData = Array.isArray(roomsRes.data.results) ? roomsRes.data.results : roomsRes.data;
      const sessionsData = Array.isArray(sessionsRes.data.results) ? sessionsRes.data.results : sessionsRes.data;

      setAllocations(allocationsData);
      setRooms(roomsData);
      setSessions(sessionsData);
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAllocation(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingAllocation(record);
    form.setFieldsValue({
      ...record,
      start_time: moment(record.start_time, 'HH:mm'),
      end_time: moment(record.end_time, 'HH:mm'),
    });
    setModalVisible(true);
  };

  const handleDelete = async (allocationId) => {
    try {
      await api.delete(`/allocations/${allocationId}/`);
      message.success('Allocation deleted successfully');
      fetchData();
    } catch (error) {
      message.error('Failed to delete allocation');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        start_time: values.start_time.format('HH:mm'),
        end_time: values.end_time.format('HH:mm'),
      };

      if (editingAllocation) {
        await api.put(`/allocations/${editingAllocation.allocation_id}/`, formattedValues);
        message.success('Allocation updated successfully');
      } else {
        await api.post('/allocations/', formattedValues);
        message.success('Allocation created successfully');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Failed to save allocation');
    }
  };

  const columns = [
    {
      title: 'Allocation ID',
      dataIndex: 'allocation_id',
      key: 'allocation_id',
    },
    {
      title: 'Room',
      dataIndex: ['room', 'room_id'],
      key: 'room',
      render: (roomId, record) => `${roomId} (${record.room?.building_name || 'N/A'})`,
    },
    {
      title: 'Course',
      dataIndex: ['session', 'primary_course', 'course_code'],
      key: 'course',
    },
    {
      title: 'Day',
      dataIndex: 'day_of_week',
      key: 'day_of_week',
      sorter: (a, b) => a.day_of_week.localeCompare(b.day_of_week),
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Recurrence',
      dataIndex: 'recurrence_pattern',
      key: 'recurrence_pattern',
      render: (pattern) => {
        const option = recurrenceOptions.find(opt => opt.value === pattern);
        return option ? option.label : pattern;
      },
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
            title="Are you sure you want to delete this allocation?"
            onConfirm={() => handleDelete(record.allocation_id)}
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
          <Title level={2}>Room Allocations</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Allocation
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Allocations"
              value={allocations.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Available Rooms"
              value={rooms.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Sessions"
              value={sessions.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Weekly Allocations"
              value={allocations.filter(a => a.recurrence_pattern === 'weekly').length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={allocations}
          rowKey="allocation_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} allocations`,
          }}
        />
      </Card>

      <Modal
        title={editingAllocation ? 'Edit Allocation' : 'Add Allocation'}
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
            name="allocation_id"
            label="Allocation ID"
            rules={[{ required: true, message: 'Please input allocation ID!' }]}
          >
            <Input placeholder="e.g., ALLOC001" />
          </Form.Item>

          <Form.Item
            name="session_id"
            label="Lecture Session"
            rules={[{ required: true, message: 'Please select lecture session!' }]}
          >
            <Select placeholder="Select lecture session" showSearch filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {sessions.map(session => (
                <Option key={session.session_id} value={session.session_id}>
                  {session.session_id} - {session.primary_course?.course_code || 'N/A'}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="room_id"
            label="Room"
            rules={[{ required: true, message: 'Please select room!' }]}
          >
            <Select placeholder="Select room" showSearch filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {rooms.map(room => (
                <Option key={room.room_id} value={room.room_id}>
                  {room.room_id} ({room.building_name || 'N/A'}) - {room.capacity} seats
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="day_of_week"
            label="Day of Week"
            rules={[{ required: true, message: 'Please select day!' }]}
          >
            <Select placeholder="Select day">
              {days.map(day => (
                <Option key={day} value={day}>{day}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start_time"
                label="Start Time"
                rules={[{ required: true, message: 'Please select start time!' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end_time"
                label="End Time"
                rules={[{ required: true, message: 'Please select end time!' }]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="recurrence_pattern"
            label="Recurrence Pattern"
            rules={[{ required: true, message: 'Please select recurrence pattern!' }]}
          >
            <Select placeholder="Select recurrence pattern">
              {recurrenceOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAllocation ? 'Update' : 'Create'}
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

export default Allocations;
