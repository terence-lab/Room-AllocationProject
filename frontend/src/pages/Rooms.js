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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRooms();
    fetchFaculties();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rooms/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setRooms(data);
    } catch (error) {
      message.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await api.get('/faculties/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setFaculties(data);
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
    }
  };

  const handleAdd = () => {
    setEditingRoom(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRoom(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (roomId) => {
    try {
      await api.delete(`/rooms/${roomId}/`);
      message.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      message.error('Failed to delete room');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.room_id}/`, values);
        message.success('Room updated successfully');
      } else {
        await api.post('/rooms/', values);
        message.success('Room created successfully');
      }
      setModalVisible(false);
      fetchRooms();
    } catch (error) {
      message.error('Failed to save room');
    }
  };

  const columns = [
    {
      title: 'Room ID',
      dataIndex: 'room_id',
      key: 'room_id',
    },
    {
      title: 'Building',
      dataIndex: 'building_name',
      key: 'building_name',
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a, b) => a.capacity - b.capacity,
    },
    {
      title: 'Type',
      dataIndex: 'room_type',
      key: 'room_type',
    },
    {
      title: 'Owner Faculty',
      dataIndex: ['owner_faculty', 'faculty_name'],
      key: 'owner_faculty',
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
            title="Are you sure you want to delete this room?"
            onConfirm={() => handleDelete(record.room_id)}
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
          <Title level={2}>Room Management</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Room
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Rooms"
              value={rooms.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lecture Rooms"
              value={rooms.filter(r => r.room_type === 'Lecture Room').length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Laboratories"
              value={rooms.filter(r => r.room_type === 'Laboratory').length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Capacity"
              value={rooms.reduce((sum, room) => sum + room.capacity, 0)}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="room_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} rooms`,
          }}
        />
      </Card>

      <Modal
        title={editingRoom ? 'Edit Room' : 'Add Room'}
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
            name="room_id"
            label="Room ID"
            rules={[{ required: true, message: 'Please input room ID!' }]}
          >
            <Input placeholder="e.g., LAB101" />
          </Form.Item>

          <Form.Item
            name="building_name"
            label="Building Name"
          >
            <Input placeholder="e.g., Science Block" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: 'Please input room capacity!' }]}
          >
            <InputNumber
              min={1}
              max={500}
              placeholder="Number of seats"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="room_type"
            label="Room Type"
            rules={[{ required: true, message: 'Please select room type!' }]}
          >
            <Select placeholder="Select room type">
              <Option value="Lecture Room">Lecture Room</Option>
              <Option value="Laboratory">Laboratory</Option>
              <Option value="Seminar Hall">Seminar Hall</Option>
              <Option value="Auditorium">Auditorium</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="owner_faculty"
            label="Owner Faculty"
          >
            <Select placeholder="Select faculty (optional)" allowClear>
              {faculties.map(faculty => (
                <Option key={faculty.faculty_id} value={faculty.faculty_id}>
                  {faculty.faculty_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRoom ? 'Update' : 'Create'}
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

export default Rooms;
