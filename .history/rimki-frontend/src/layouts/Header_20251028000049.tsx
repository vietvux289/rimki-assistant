import React from "react";
import { Layout } from "antd";
import "../styles/Header.scss"; 
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../assets/rikkei-images.jpg";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { message } from "antd";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    message.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <Header className="header">
      <div className="logo-name" onClick={()=> navigate('/home')}>
        <img src={logo} alt="RIMKI Logo" className="logo" />
        <span className="title">RIMKI Assistant</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isAuthenticated && currentUser && (
          <span style={{ color: "#fff", marginRight: "10px" }}>
            <UserOutlined style={{ marginRight: 6 }} />
            {currentUser.username}
          </span>
        )}
        {isAuthenticated ? (
          <a className="login-link" onClick={handleLogout}>
            <LogoutOutlined style={{ marginRight: 6 }} />
            <b>Logout</b>
          </a>
        ) : (
          <a className="login-link" onClick={()=>navigate('/login')}>
            <LoginOutlined style={{ marginRight: 6 }} />
            <b>Login</b>
          </a>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
