import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Cursor from "./components/Cursor";
import AuthPage from "./Pages/AuthPage";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Calendar from "./Pages/Calendar";
import Create from "./Pages/Create";

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function Rotes() {
  return (
    <BrowserRouter>
    <Cursor />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
          <Route path="/create/:id" element={<ProtectedRoute><Create /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>  
  )
}

export default Rotes
