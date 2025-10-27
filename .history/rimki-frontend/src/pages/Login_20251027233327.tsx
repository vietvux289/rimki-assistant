import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import "../styles/Login.scss";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.login(values.username, values.password);
      message.success("Login successful!");
      navigate("/home");
    } catch (error: any) {
      message.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">Ha</div>
        <h2>RIMKI Assistant</h2>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: "Username required" }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Password required" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="options">
            <Form.Item name="remember" valuePropName="checked">
              <input type="checkbox" /> Remember me
            </Form.Item>
            <a href="#">Forgot password?</a>
          </div>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
