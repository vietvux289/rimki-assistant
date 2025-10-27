import React from "react";
import { Layout, Dropdown, Space, message } from "antd";
import type { MenuProps } from "antd";
import "../styles/Header.scss";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/rikkei-images.jpg";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    message.success("Logged out successfully");
    navigate("/home");
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: (
        <Space onClick={handleLogout} style={{ cursor: 'pointer', width: '100%' }}>
          <LogoutOutlined />
          <span>Logout</span>
        </Space>
      ),
    },
  ];

  return (
    <Header className="header">
      <div className="logo-name" onClick={() => navigate('/home')}>
        <img src={logo} alt="RIMKI Logo" className="logo" />
        <span className="title">RIMKI Assistant</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isAuthenticated && currentUser ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['hover']}
          >
            <a className="login-link">
              <UserOutlined style={{ marginRight: 6 }} />
              <div>{currentUser.username}</div>
            </a>
          </Dropdown>
        ) : (
          <a className="login-link" onClick={() => navigate('/login')}>
            <LoginOutlined style={{ marginRight: 6 }} />
            <b>Login</b>
          </a>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
