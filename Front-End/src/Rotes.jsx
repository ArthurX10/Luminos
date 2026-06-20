import React from 'react'
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Cursor from "./components/Cursor";
import AuthPage from "./Pages/AuthPage";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Calendar from "./Pages/Calendar";
import Create from "./Pages/Create";

function Rotes() {
  return (
    <BrowserRouter>
    <Cursor />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path= "/calendar" element={<Calendar/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/create/:id" element={<Create/>}/>
          
        </Routes>
      </BrowserRouter>  
  )
}

export default Rotes
