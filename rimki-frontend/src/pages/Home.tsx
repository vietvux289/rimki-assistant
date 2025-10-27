import React from "react";
import { Layout } from "antd";
import "../styles/Home.scss"; 
import Chatbox from "../components/ChatBox";
import SecureQuiz from "../components/SecureQuizBuilder";
import AppHeader from "../layouts/Header";

const { Content } = Layout;

const Home: React.FC = () => {
  return (
    <Layout className="home-layout">
      <AppHeader />
      <Content className="content">
        <h1>Home</h1>
        <div className="cards-container">
          <Chatbox />
          <SecureQuiz />
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
