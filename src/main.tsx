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
import DashboarPage from "./Pages/DashboardPage";
import ProfilePage from "./Pages/ProfilePage";
import { TaskProvider } from "./TaskContext/TaskContext";
import ProjectPage from "./Pages/ProjectPage";
import { ThemeProvider } from "./ThemeContext/theme-provider";
import HomePage from "./Pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUpPage from "./Pages/SignUpPage";
import AITalk from "./components/AiChat/AIChatDialog";
import Layout from "./Pages/Layout";
import LandingPage from "./Pages/LandingPage";
import AssignProjects from "./Pages/AssignProjectsPage";
import CalendarPage from "./Pages/ClanderPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/v1" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard/:projectId" element={<DashboarPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
          <Route path="ai-talk" element={<AITalk />} />
          <Route path="assign-projects" element={<AssignProjects />} />
          <Route path="calender-projects" element={<CalendarPage />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <h1 className="text-2xl font-semibold ">404 Page Not Found</h1>
          </div>
        }
      />
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
