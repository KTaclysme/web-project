import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./landing/SignUp";
import Login from "./landing/Login";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
