import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";

const RoutesIndex: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={<Home />} />
    <Route path="/" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default RoutesIndex;
