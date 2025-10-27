import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";

const RoutesIndex: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    } />
    <Route path="/" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default RoutesIndex;
