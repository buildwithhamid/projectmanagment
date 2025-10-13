import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "../Config/firbase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export interface Task {
  id?: string;
  title: string;
  todo: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  attachments?: string[];
  dueDate?: string;
  userId?: string | null;
  projectId?: string;
}
export interface User {
  id?: string;
  email: string | null;
  name?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: string;
  title: string;
  Category: string;
  description: string;
  url?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
  attachments?: string[];
  dueDate?: string;
}

interface TaskContextType {
  projects: Project[];
  userData: User;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  taskCache: { [key: string]: { title: string; tasks: Task[] } };
  setTaskCache: React.Dispatch<
    React.SetStateAction<{ [key: string]: { title: string; tasks: Task[] } }>
  >;
  loading: boolean;

  // Tasks
  addTaskToProject: (
    projectId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
    }
  ) => Promise<string>;
  updateTaskInProject: (
    projectid: string,

    taskId: string,
    updatedData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[] | undefined;
      dueDate?: string | undefined;
    }
  ) => Promise<void>;
  deleteTaskFromProject: (projectId: string, taskId: string) => Promise<void>;
  setLoading: (l: boolean) => void;

  // Projects
  fetchUserProjects: (userId: string) => Promise<void>;
  fetchUserData: (userId: string) => Promise<User | undefined>;
  addProject: (
    title: string,
    userId: string,
    discription: string,
    Category: string,
    attachments: string[]
  ) => Promise<string>;
  updateProject: (
    projectId: string,
    title: string,
    description?: string,
    Category?: string,
    attachments?: string[]
  ) => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userData, setuserData] = useState<User>({} as User);
  const [taskCache, setTaskCache] = useState<{
    [key: string]: { title: string; tasks: Task[] };
  }>({});
  const [loading, setLoading] = useState(false);
  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        setuserData(userData);
        console.log("✅ User data fetched:", userData);
        return userData;
      } else {
        console.warn("⚠️ No user data found in Firestore");
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  const fetchUserProjects = async (userId: string) => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "Projects"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      setProjects(projectsData);

      const cache: { [key: string]: { title: string; tasks: Task[] } } = {};
      for (const project of projectsData) {
        const taskSnap = await getDocs(
          collection(db, "Projects", project.id!, "tasks")
        );
        const tasks = taskSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Task[];

        cache[project.id!] = { title: project.title, tasks };
      }
      setTaskCache(cache);
      console.log("✅ Projects & tasks loaded", { projectsData, cache });
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (
    title: string,
    userId: string,
    description?: string,
    Category?: string,
    attachments?: string[]
  ) => {
    try {
      setLoading(true);

      if (!title.trim() || !userId) return "";

      const projectData = {
        title,
        description: description || "",
        Category: Category || "",
        attachments,
        userId,
        url: `/projects/${title.toLowerCase().replace(/\s+/g, "-")}`,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "Projects"), projectData);

      console.log("✅ Project created:", projectData);
      setProjects((prev) => [...prev, { id: docRef.id, ...projectData }]);

      return docRef.id;
    } catch (err) {
      console.error("❌ Error creating project:", err);
      return "";
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    projectId: string,
    title: string,
    description?: string,
    Category?: string,
    attachments?: string[]
  ) => {
    try {
      setLoading(true);

      if (!projectId || !title.trim()) return false;

      const updatedData = {
        title,
        description: description || "",
        attachments: attachments || [],
        Category: Category || "",
        url: `/projects/${title.toLowerCase().replace(/\s+/g, "-")}`,
        updatedAt: new Date().toISOString(),
      };

      const projectRef = doc(db, "Projects", projectId);
      await updateDoc(projectRef, updatedData);

      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...updatedData } : p))
      );

      console.log("✅ Project updated:", updatedData);

      return true;
    } catch (err) {
      console.error("❌ Error updating project:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      const confirmed = window.confirm(
        `Are you sure you want to delete project `
      );
      if (!confirmed) return;

      await deleteDoc(doc(db, "Projects", projectId));
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      console.log("🗑️ Project deleted:", projectId);
    } catch (err) {
      console.error("❌ Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTaskToProject = async (
    projectId: string,
    formData: {
      title: string;
      todo: string;
      status: string;
      attachments?: string[];
      dueDate?: string;
    }
  ): Promise<string> => {
    try {
      const newTask: Task = {
        title: formData.title?.trim() || "Untitled Task",
        todo: formData.todo?.trim() || "",
        status: formData.status || "backlog",
        attachments: formData.attachments ?? [],
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate ?? "",
      };

      const taskRef = await addDoc(
        collection(db, "Projects", projectId, "tasks"),
        newTask
      );

      setTaskCache((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          tasks: [
            ...(prev[projectId]?.tasks || []),
            { ...newTask, id: taskRef.id },
          ],
        },
      }));

      console.log(`✅ Task added to project "${projectId}":`, taskRef.id);
      return taskRef.id;
    } catch (err) {
      console.error("❌ Error adding task:", err);
      throw err;
    }
  };

  const deleteTaskFromProject = async (
    projectId: string,
    taskId: string
  ): Promise<void> => {
    try {
      setLoading(true);

      const taskRef = doc(db, "Projects", projectId, "tasks", taskId);

      await deleteDoc(taskRef);

      setTaskCache((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          tasks:
            prev[projectId]?.tasks.filter((task) => task.id !== taskId) || [],
        },
      }));

      console.log(`✅ Task ${taskId} deleted from project: ${projectId}`);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const updateTaskInProject = async (
    projectid: string,
    taskId: string,
    updatedData: {
      title?: string;
      todo?: string;
      status?: string;
      attachments?: string[];
      dueDate?: string;
    }
  ): Promise<void> => {
    try {
      setLoading(true);

      if (!projectid || !taskId) {
        console.error("❌ Missing projectId or taskId", { projectid, taskId });
        return;
      }
      const taskRef = doc(db, "Projects", projectid, "tasks", taskId);

      await updateDoc(taskRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });

      setTaskCache((prev) => {
        const tasks = prev[projectid]?.tasks.map((t) =>
          t.id === taskId
            ? { ...t, ...updatedData, updatedAt: new Date().toISOString() }
            : t
        );
        return {
          ...prev,
          [projectid]: { ...prev[projectid], tasks },
        };
      });

      console.log(`✅ Task ${taskId} updated in project ${projectid}`);
    } catch (err) {
      console.error("❌ Error updating task:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProjects(user.uid);
      } else if (!user) {
        setProjects([]);
        setTaskCache({});
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        userData,
        fetchUserData,
        projects,
        setProjects,
        taskCache,
        setTaskCache,
        loading,
        setLoading,
        addTaskToProject,
        updateTaskInProject,
        fetchUserProjects,
        addProject,
        updateProject,
        deleteProject,
        deleteTaskFromProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTaskContext must be used within TaskProvider");
  return context;
};
