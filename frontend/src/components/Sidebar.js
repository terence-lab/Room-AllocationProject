import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/rooms',
      icon: <HomeOutlined />,
      label: 'Rooms',
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: 'Courses',
    },
    {
      key: '/lecturers',
      icon: <UserOutlined />,
      label: 'Lecturers',
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'Students & Groups',
    },
    {
      key: '/allocations',
      icon: <CalendarOutlined />,
      label: 'Allocations',
    },
    {
      key: '/timetable',
      icon: <ScheduleOutlined />,
      label: 'Timetable',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo">
        KABALE UNIV
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
