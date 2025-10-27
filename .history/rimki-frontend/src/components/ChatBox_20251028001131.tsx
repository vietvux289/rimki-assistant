import React, { useState } from "react";
import { Card, Input, Button, Avatar, Space, message } from "antd";
import {
  RedditOutlined,
  SearchOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "../styles/ChatBox.scss";
import { chatService } from "../services/chatService";
import { authService } from "../services/authService";

const { TextArea } = Input;

interface Message {
  sender: string;
  text: string;
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "RIMKI",
      text: `Hello, I'm RIMKI Assistant – a virtual assistant that helps you understand your company's security policies. Please upload the security policy document so I can review it and answer any questions you may have.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const displayName = currentUser?.username || "User";

  const handleSend = async () => {
    if (!input.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning("Please login to send messages");
      return;
    }

    // Add user message to chat
    const newMsg: Message = { sender: displayName, text: input };
    setMessages((prev) => [...prev, newMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      // Send message to backend
      const response = await chatService.sendMessage(userInput);

      // Add RIMKI's response
      const botResponse: Message = { sender: "RIMKI", text: response.message };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error: any) {
      message.error(error.message || "Failed to send message");
      // Add error message to chat
      const errorMsg: Message = {
        sender: "RIMKI",
        text: "Sorry, I'm having trouble connecting. Please try again later."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space align="center">
          <SearchOutlined style={{ color: "#c3272b" }} />
          <span style={{ color: "#c3272b", fontWeight: 600 }}>Chatbot</span>
        </Space>
      }
      className="chatbot-section"
    >
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <Space
            key={index}
            className={`chat-message ${msg.sender === displayName ? "user" : "rimki"}`}
            align="start"
          >
            {msg.sender === "RIMKI" && (
              <Space direction="vertical" align="center" className="chat-icon">
                <Avatar
                  size={36}
                  icon={<RedditOutlined />}
                  style={{ backgroundColor: "#f5f5f5", color: "#000" }}
                />
                <span className="chat-label">RIMKI</span>
              </Space>
            )}

            <div className="chat-text">{msg.text}</div>

            {msg.sender === displayName && (
              <Space direction="vertical" align="center" className="chat-icon">
                <Avatar
                  size={36}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#c3272b", color: "#fff" }}
                />
                <span className="chat-label">{displayName}</span>
              </Space>
            )}
          </Space>
        ))}

        <Space.Compact className="chat-input" block>
          <TextArea
            placeholder="Ask anything"
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              if (!loading) handleSend();
            }}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            style={{ backgroundColor: "#c3272b", border: "none" }}
          />
        </Space.Compact>
      </div>
    </Card>
  );
};

export default Chatbox;
