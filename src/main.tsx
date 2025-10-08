import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./AuthContext/UserContext";
import Layout from "./Pages/Layout";
import DashboarPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import { TaskProvider } from "./TaskContext/TaskContext";
import ProjectPage from "./Pages/ProjectPage";
import { ThemeProvider } from "./ThemeContext/theme-provider";
import HomePage from "./Pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "./Pages/SignUpPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="/dashboard/:projectId" element={<DashboarPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <UserProvider>
      <TaskProvider>
        <RouterProvider router={router} />
      </TaskProvider>
    </UserProvider>
  </ThemeProvider>
);
