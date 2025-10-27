import React from "react";
import { App as AntdApp } from "antd";
import RoutesIndex from "./routes";


const App: React.FC = () => {
  return (
    <AntdApp>
      <RoutesIndex />
    </AntdApp>
  );
};

export default App;
