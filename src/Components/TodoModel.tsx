"use client";
import React, { useState, useEffect } from "react";
import { useTaskContext, type Task } from "../TaskContext/TaskContext";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "./DatePicker";
import { useParams } from "react-router-dom";

export interface TaskFormData {
  title: string;
  todo: string;
  status: string;
  attachments: string[];
  dueDate: string;
  createdAt?: string;
}

interface TodoModelProps {
  projectId: string;
  taskToEdit?: Task;
}

const TodoModel: React.FC<TodoModelProps> = ({ projectId, taskToEdit }) => {
  const { addTaskToProject, updateTaskInProject } = useTaskContext();
  const { projectid } = useParams();
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    todo: "",
    status: "backlog",
    attachments: [],
    dueDate: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        todo: taskToEdit.todo || "",
        status: taskToEdit.status || "backlog",
        attachments: taskToEdit.attachments || [],
        dueDate: taskToEdit.dueDate || "",
        createdAt: taskToEdit.createdAt || "",
      });
    }
  }, [taskToEdit]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;
    setLoading(true);

    try {
      const activeProjectId = projectId || projectid;
      if (!activeProjectId) throw new Error("❌ No project ID found");

      if (taskToEdit?.id) {
        await updateTaskInProject(activeProjectId, taskToEdit.id, formData);
      } else {
        await addTaskToProject(activeProjectId, formData);
      }

      setFormData({
        title: "",
        todo: "",
        status: "backlog",
        attachments: [],
        dueDate: "",
      });
    } catch (err) {
      console.error("❌ Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md rounded-xl shadow-2xl">
      <DialogHeader>
        <DialogTitle>{taskToEdit ? "Edit Task" : "Add Task"}</DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        <Input
          placeholder="Enter title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          placeholder="Enter description"
          rows={6}
          value={formData.todo}
          onChange={(e) => setFormData({ ...formData, todo: e.target.value })}
          className=" h-32  overflow custom-scroll "
        />
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={formData.status}
            onValueChange={(v) => setFormData({ ...formData, status: v })}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
            </SelectContent>
          </Select>

          <DatePicker
            value={formData.dueDate || null}
            onChange={(date) =>
              setFormData({ ...formData, dueDate: date || "" })
            }
          />
        </div>

        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file)
              setFormData({
                ...formData,
                attachments: [URL.createObjectURL(file)],
              });
          }}
        />
      </div>

      <DialogFooter className="flex justify-center gap-2">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? taskToEdit
              ? "Saving..."
              : "Adding..."
            : taskToEdit
            ? "Update"
            : "Add Task"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TodoModel;
