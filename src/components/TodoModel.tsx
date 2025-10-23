import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  projectId?: string;
  taskToEdit?: Task;
}

const TodoModel: React.FC<TodoModelProps> = ({ projectId, taskToEdit }) => {
  const { addTaskToProject, updateTaskInProject } = useTaskContext();
  const { projectid } = useParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    todo: "",
    status: "backlog",
    attachments: [],
    dueDate: "",
    createdAt: "",
  });

  // ✅ Set task data only when editing
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
    } else {
      setFormData({
        title: "",
        todo: "",
        status: "backlog",
        attachments: [],
        dueDate: "",
        createdAt: "",
      });
    }
  }, [taskToEdit]);

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
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

      // Reset form after success
      setFormData({
        title: "",
        todo: "",
        status: "backlog",
        attachments: [],
        dueDate: "",
        createdAt: "",
      });
    } catch (err) {
      console.error("❌ Error saving task:", err);
    } finally {
      setLoading(false);
    }
  }, [
    addTaskToProject,
    updateTaskInProject,
    projectId,
    projectid,
    formData,
    taskToEdit,
  ]);

  const statusOptions = useMemo(
    () => [
      "pending",
      "active",
      "inactive",
      "cancelled",
      "completed",
      "backlog",
    ],
    []
  );

  return (
    <DialogContent className="sm:max-w-md rounded-xl  border border-border">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {taskToEdit ? "Edit Task" : "Add Task"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-2">
        <Input
          placeholder="Enter title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />

        <Textarea
          placeholder="Enter description"
          rows={6}
          value={formData.todo}
          onChange={(e) => handleInputChange("todo", e.target.value)}
          className="h-32 overflow-auto custom-scroll"
        />

        <div className="flex flex-row gap-2 w-full">
          <Select
            value={formData.status}
            onValueChange={(v) => handleInputChange("status", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker
            value={formData.dueDate || null}
            onChange={(date) => handleInputChange("dueDate", date || "")}
          />
        </div>

        <Input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > 500 * 1024) {
              alert("Image too large. Please upload under 500KB.");
              return;
            }

            const toBase64 = (file: File) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
              });

            const base64String = await toBase64(file);

            setFormData((prev) => ({
              ...prev,
              attachments: [base64String],
            }));
          }}
        />
      </div>

      <DialogFooter className="flex justify-center gap-2 mt-4">
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

export default React.memo(TodoModel);
