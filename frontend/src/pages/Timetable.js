import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  Table,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Badge,
  Tag,
  Space,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Timetable = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom && selectedDay) {
      fetchTimetable();
    }
  }, [selectedRoom, selectedDay]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms/');
      const data = Array.isArray(response.data.results) ? response.data.results : response.data;
      setRooms(data);
      if (data.length > 0) {
        setSelectedRoom(data[0].room_id);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const fetchTimetable = async () => {
    if (!selectedRoom || !selectedDay) return;

    setLoading(true);
    try {
      const response = await api.get(`/allocations/timetable/?room_id=${selectedRoom}&day=${selectedDay}`);
      setTimetableData(response.data.allocations || []);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      setTimetableData([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllocationForTimeSlot = (timeSlot) => {
    const [startTime] = timeSlot.split('-');
    const allocation = timetableData.find(alloc => {
      return alloc.start_time <= startTime && alloc.end_time > startTime;
    });
    return allocation;
  };

  const generateFullWeekTimetable = () => {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        fixed: 'left',
        width: 120,
        render: (time) => (
          <Text strong style={{ fontSize: '12px' }}>{time}</Text>
        ),
      },
      ...days.map(day => ({
        title: day,
        dataIndex: day,
        key: day,
        width: 150,
        render: (_, record) => {
          const allocation = record[day];
          if (!allocation) return null;
          
          return (
            <div style={{ 
              padding: '4px', 
              backgroundColor: '#e6f7ff', 
              border: '1px solid #91d5ff',
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              <div><strong>{allocation.session?.primary_course?.course_code}</strong></div>
              <div>{allocation.session?.primary_course?.course_name}</div>
              <div style={{ color: '#666' }}>{allocation.start_time}-{allocation.end_time}</div>
            </div>
          );
        },
      })),
    ];

    const dataSource = timeSlots.map(timeSlot => {
      const row = { time: timeSlot };
      
      days.forEach(day => {
        // For now, we'll only show data for the selected room and day
        if (day === selectedDay) {
          row[day] = getAllocationForTimeSlot(timeSlot);
        } else {
          row[day] = null;
        }
      });
      
      return row;
    });

    return { columns, dataSource };
  };

  const { columns, dataSource } = generateFullWeekTimetable();

  if (!selectedRoom) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Timetable View</Title>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <Card size="small">
            <Space>
              <Text strong>Room:</Text>
              <Select
                value={selectedRoom}
                onChange={setSelectedRoom}
                style={{ width: 200 }}
                placeholder="Select room"
              >
                {rooms.map(room => (
                  <Option key={room.room_id} value={room.room_id}>
                    {room.room_id} ({room.building_name || 'N/A'})
                  </Option>
                ))}
              </Select>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Space>
              <Text strong>Day:</Text>
              <Select
                value={selectedDay}
                onChange={setSelectedDay}
                style={{ width: 150 }}
                placeholder="Select day"
              >
                {days.map(day => (
                  <Option key={day} value={day}>{day}</Option>
                ))}
              </Select>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Space>
              <CalendarOutlined />
              <Text>Room: <strong>{selectedRoom}</strong></Text>
              <ClockCircleOutlined />
              <Text>Day: <strong>{selectedDay}</strong></Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title={`Weekly Timetable - Room ${selectedRoom}`}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: 1200 }}
            size="small"
            rowKey="time"
          />
        )}
      </Card>

      <Card title={`${selectedDay} Schedule Details`} style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : timetableData.length > 0 ? (
          <Table
            dataSource={timetableData}
            rowKey="allocation_id"
            pagination={false}
            size="small"
            columns={[
              {
                title: 'Time',
                key: 'time',
                render: (_, record) => `${record.start_time} - ${record.end_time}`,
              },
              {
                title: 'Course',
                key: 'course',
                render: (_, record) => (
                  <div>
                    <Text strong>{record.session?.primary_course?.course_code}</Text>
                    <br />
                    <Text type="secondary">{record.session?.primary_course?.course_name}</Text>
                  </div>
                ),
              },
              {
                title: 'Lecturer',
                key: 'lecturer',
                render: (_, record) => record.session?.lecturer?.full_name || 'N/A',
              },
              {
                title: 'Groups',
                key: 'groups',
                render: (_, record) => {
                  // This would need to be implemented based on your API structure
                  return <Tag color="blue">Multiple Groups</Tag>;
                },
              },
              {
                title: 'Status',
                key: 'status',
                render: () => <Badge status="success" text="Scheduled" />,
              },
            ]}
          />
        ) : (
          <Empty 
            description={`No allocations found for ${selectedDay} in room ${selectedRoom}`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default Timetable;
