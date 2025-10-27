// import React, { useState } from "react";
// import { Card, Upload, Button, Input, Divider, message, Tooltip } from "antd";
// import {
//   CopyOutlined,
//   EditOutlined,
//   FileTextOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
// import type { UploadProps } from "antd";
// import "../styles/SecureQuizBuilder.scss";

// const SecureQuiz: React.FC = () => {
//   const uploadProps: UploadProps = {
//     multiple: true,
//     showUploadList: {
//       showRemoveIcon: true,
//       showPreviewIcon: false,
//     },
//     onRemove: (file) => {
//       console.log("File removed:", file.name);
//     },
//     beforeUpload: () => false,
//   };


//   const value = "https://accounts.google.com/v3/signin/identifier?continue=";

//   const [tooltipTitle, setTooltipTitle] = useState("Sao chép liên kết");

//   const handleCopy = async (e: any) => {
//     e.preventDefault();
//     try {
//       await navigator.clipboard.writeText(value);
//       setTooltipTitle("Đã sao chép!");
//       setTimeout(() => setTooltipTitle("Sao chép liên kết"), 1500); // reset tooltip sau 1.5s
//     } catch {
//       setTooltipTitle("Không thể sao chép!");
//       setTimeout(() => setTooltipTitle("Sao chép liên kết"), 1500);
//     }
//   };

//   return (
//     <div className="secure-quiz-container">
//       <Card
//         className="secure-quiz-card"
//         title={
//           <div className="secure-quiz-title">
//             <FileTextOutlined style={{ marginRight: 8 }} />
//             <span>SecureQuiz Builder</span>
//           </div>
//         }
//       >
//         <div className="quiz-section">
//           <h3 className="quiz-heading">
//             Upload confidentiality policy documents
//           </h3>

//           <Upload {...uploadProps}>
//             <div
//               style={{
//                 border: "1px solid #d9d9d9",
//                 borderRadius: 6,
//                 padding: "6px 12px",
//                 marginTop: "0.5em",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 width: 250,
//               }}
//             >
//               <FileTextOutlined style={{ color: "#5d9df7ff", fontSize: 16 }} />
//               <span style={{ color: "#5d9df7ff" }}>Add documents</span>
//             </div>
//           </Upload>

//           <Button type="primary" icon={<UploadOutlined />} className="create-btn">
//             Upload
//           </Button>
//         </div>

//         <Divider />

//         <div className="quiz-section">
//           <h3 className="quiz-heading">Let’s test your knowledge!</h3>

//           <Button type="primary" icon={<EditOutlined />} className="create-btn">
//             Create Quiz
//           </Button>

//           {/* <Input
//             value={value}
//             readOnly
//             className="copy-link-input"
//             style={{ marginTop: "1em", color: "#c3272b"}}
//             addonAfter={
//               <Tooltip title={tooltipTitle} trigger={"hover"}
//               >
//                 <Button
//                   type="text"
//                   icon={<CopyOutlined />}
//                   onClick={handleCopy}
//                 />
//               </Tooltip>
//             }
//           /> */}
//           <Input
//             value={value}
//             readOnly
//             className="copy-link-input"
//             addonAfter={
//               <Tooltip title={tooltipTitle} trigger="hover">
//                 <Button
//                   type="text"
//                   icon={<CopyOutlined />}
//                   onClick={handleCopy}
//                   className="copy-btn"
//                 />
//               </Tooltip>
//             }
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default SecureQuiz;

import React, { useState, useEffect } from "react";
import { Card, Upload, Button, Input, Divider, message, Tooltip } from "antd";
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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [quizLink, setQuizLink] = useState("");
  const [tooltipTitle, setTooltipTitle] = useState("Copy link");
  const [showLink, setShowLink] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

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
    if (!isAuth) {
      message.warning("Vui lòng đăng nhập để tải tài liệu lên");
      return;
    }

    if (fileList.length === 0) {
      message.warning("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    try {
      // Upload the first file (you can modify to upload multiple files)
      const file = fileList[0] as any;
      const response = await quizService.uploadDocument(file);
      message.success(`Document "${response.document.filename}" uploaded successfully!`);
      setFileList([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload document";
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateQuiz = async () => {
    // Check if user is authenticated - check directly from authService
    const isAuth = authService.isAuthenticated();
    if (!isAuth) {
      message.warning("Vui lòng đăng nhập để tạo bài quiz");
      return;
    }

    setCreating(true);
    try {
      const response = await quizService.createQuiz("Security Policy Quiz");
      setQuizLink(response.quiz.link);
      setShowLink(true);
      message.success("Quiz created successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create quiz";
      message.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (e: any) => {
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
