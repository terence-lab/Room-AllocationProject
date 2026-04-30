import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Table, Spin } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    rooms: 0,
    courses: 0,
    lecturers: 0,
    allocations: 0,
  });
  const [recentAllocations, setRecentAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, coursesRes, lecturersRes, allocationsRes] = await Promise.all([
        api.get('/rooms/'),
        api.get('/courses/'),
        api.get('/lecturers/'),
        api.get('/allocations/'),
      ]);

      setStats({
        rooms: roomsRes.data.count || roomsRes.data.length || 0,
        courses: coursesRes.data.count || coursesRes.data.length || 0,
        lecturers: lecturersRes.data.count || lecturersRes.data.length || 0,
        allocations: allocationsRes.data.count || allocationsRes.data.length || 0,
      });

      // Get recent allocations
      const allocationsData = Array.isArray(allocationsRes.data.results) 
        ? allocationsRes.data.results 
        : Array.isArray(allocationsRes.data) 
          ? allocationsRes.data 
          : [];

      setRecentAllocations(allocationsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const allocationColumns = [
    {
      title: 'Room',
      dataIndex: ['room', 'room_id'],
      key: 'room',
    },
    {
      title: 'Course',
      dataIndex: ['session', 'primary_course', 'course_code'],
      key: 'course',
    },
    {
      title: 'Day',
      dataIndex: 'day_of_week',
      key: 'day',
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => `${record.start_time} - ${record.end_time}`,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Rooms"
              value={stats.rooms}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={stats.courses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Lecturers"
              value={stats.lecturers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Allocations"
              value={stats.allocations}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Allocations">
        <Table
          columns={allocationColumns}
          dataSource={recentAllocations}
          rowKey="allocation_id"
          pagination={false}
          locale={{ emptyText: 'No allocations found' }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
