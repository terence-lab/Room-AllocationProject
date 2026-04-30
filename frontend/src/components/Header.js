import React from 'react';
import { Layout, Typography, Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <AntHeader style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
        Room Allocation System
      </Text>
      <Space>
        <Text>Welcome, {user?.full_name || 'User'}</Text>
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          arrow
        >
          <Avatar 
            icon={<UserOutlined />} 
            style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
