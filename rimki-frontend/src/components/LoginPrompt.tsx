import React from "react";
import { Card, Button, Space } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface LoginPromptProps {
  title?: string;
  message?: string;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({
  title = "Authentication Required",
  message = "Please log in to use this feature.",
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Card
      style={{
        textAlign: "center",
        padding: "40px 20px",
        border: "2px dashed #d9d9d9",
      }}
    >
      <Space direction="vertical" size="large">
        <LoginOutlined style={{ fontSize: "48px", color: "#c3272b" }} />
        <div>
          <h3 style={{ color: "#c3272b", marginBottom: "10px" }}>{title}</h3>
          <p style={{ color: "#666", marginBottom: "20px" }}>{message}</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<LoginOutlined />}
          onClick={handleLogin}
          style={{ backgroundColor: "#c3272b", border: "none" }}
        >
          Go to Login
        </Button>
      </Space>
    </Card>
  );
};

export default LoginPrompt;

