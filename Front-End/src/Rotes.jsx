import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Cursor from "./components/Cursor";
import AuthPage from "./Pages/AuthPage";
import Home from "./Pages/Home";

function Rotes() {
  return (
    <BrowserRouter>
    <Cursor />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>  
  )
}

export default Rotes
