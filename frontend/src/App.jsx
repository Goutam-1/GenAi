import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/Homepage";
import ForgetPassword from "./components/Forgetpassword";
import MainLayout from "./layout/Layout";
import Text from "./components/Text";
import Image from "./components/Image";
import Resume from "./components/Resume";
import ChatViewer from "./components/chat/ChatViewer";
import AdminRoutes from "./components/admin/index.jsx";

export default function App() {
  return (
    <AuthProvider>
  
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/forget-password"
            element={<ForgetPassword />}
          />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Homepage />} />

            <Route element={<MainLayout />}>
              <Route path="/text" element={<Text />} />
              <Route path="/image" element={<Image />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/history/:conversationId" element={<ChatViewer />} />
            </Route>
          </Route>

          {/* ADMIN ROUTES (Unprotected for now) */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* fallback */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
        </BrowserRouter>
        <ToastContainer />
    </AuthProvider>
  );
}