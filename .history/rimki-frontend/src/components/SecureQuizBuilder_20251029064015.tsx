import React, { useState } from "react";
import { Card, Upload, Button, Input, Divider, Tooltip, App, Radio } from "antd";
import {
  CopyOutlined,
  EditOutlined,
  FileTextOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import "../styles/SecureQuizBuilder.scss";
import { quizService } from "../services/quizService";
import { authService } from "../services/authService";

const SecureQuiz: React.FC = () => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [quizLink, setQuizLink] = useState("");
  const [tooltipTitle, setTooltipTitle] = useState("Copy link");
  const [showLink, setShowLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('vi');

  const uploadProps: UploadProps = {
    multiple: true,
    showUploadList: {
      showRemoveIcon: true,
      showPreviewIcon: false,
    },
    fileList,
    beforeUpload: () => false,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList as UploadFile[]);
    },
  };

  const handleUpload = async () => {
    // Check if user is authenticated - check directly from authService
    const isAuth = authService.isAuthenticated();
    console.log("Is authenticated (Upload):", isAuth);

    if (!isAuth) {
      console.log("User not authenticated, showing upload message");
      message.warning({
        content: "Vui lòng đăng nhập để tải tài liệu lên",
        duration: 3,
      });
      return;
    }

    if (fileList.length === 0) {
      message.warning({
        content: "Please select at least one file to upload",
        duration: 3,
      });
      return;
    }

    setUploading(true);
    try {
      // Upload the first file (you can modify to upload multiple files)
      const file = fileList[0].originFileObj as File;
      const response = await quizService.uploadDocument(file);
      message.success({
        content: `Document "${response.document.filename}" uploaded successfully!`,
        duration: 3,
      });
      setFileList([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
      message.error({
        content: errorMessage,
        duration: 3,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateQuiz = async () => {
    // Check if user is authenticated - check directly from authService
    const isAuth = authService.isAuthenticated();
    console.log("Is authenticated (Create Quiz):", isAuth);

    if (!isAuth) {
      console.log("User not authenticated, showing create quiz message");
      message.warning({
        content: "Vui lòng đăng nhập để tạo bài quiz",
        duration: 3,
      });
      return;
    }

    setCreating(true);
    try {
      const response = await quizService.createQuiz("Security Policy Quiz", selectedLanguage);
      setQuizLink(response.quiz.link);
      setShowLink(true);
      message.success({
        content: "Quiz created successfully!",
        duration: 3,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create quiz";
      message.error({
        content: errorMessage,
        duration: 3,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(quizLink);
      setTooltipTitle("Copied!");
      setTimeout(() => setTooltipTitle("Copy link"), 1500);
    } catch {
      setTooltipTitle("Copy failed!");
      setTimeout(() => setTooltipTitle("Copy link"), 1500);
    }
  };

  return (
    <div className="secure-quiz-container">
      <Card
        className="secure-quiz-card"
        title={
          <div className="secure-quiz-title">
            <FileTextOutlined style={{ marginRight: 8 }} />
            <span>SecureQuiz Builder</span>
          </div>
        }
      >
        <div className="quiz-section">
          <h3 className="quiz-heading">
            Upload confidentiality policy documents
          </h3>

          <Upload {...uploadProps}>
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: 6,
                padding: "6px 12px",
                marginTop: "0.5em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: 250,
              }}
            >
              <FileTextOutlined style={{ color: "#5d9df7ff", fontSize: 16 }} />
              <span style={{ color: "#5d9df7ff" }}>Add documents</span>
            </div>
          </Upload>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            className="create-btn"
            onClick={handleUpload}
            loading={uploading}
          >
            Upload
          </Button>
        </div>

        <Divider />

        <div className="quiz-section">
          <h3 className="quiz-heading">Let's test your knowledge!</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Quiz Language:
            </label>
            <Radio.Group
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ marginBottom: '16px' }}
            >
              <Radio value="vi">Tiếng Việt</Radio>
              <Radio value="ja">日本語</Radio>
              <Radio value="en">English</Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            icon={<EditOutlined />}
            className="create-btn"
            onClick={handleCreateQuiz}
            loading={creating}
          >
            Create Quiz
          </Button>

          {showLink && (
            <Input
              value={quizLink}
              readOnly
              className="copy-link-input"
              style={{ marginTop: "1em" }}
              addonAfter={
                <Tooltip title={tooltipTitle} trigger="hover">
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                    className="copy-btn"
                  />
                </Tooltip>
              }
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default SecureQuiz;
