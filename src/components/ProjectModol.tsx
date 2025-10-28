import { useState, useEffect, useMemo, useCallback } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import DatePicker from "./DatePicker";
import { Separator } from "./ui/separator";

type ProjectToEdit = {
  id?: string;
  title: string;
  description: string;
  Category?: string;
  attachments?: string[];
  dueDate?: string;
  status?: string;
  userId?: string;
  assignedUsers?: string[];
};

export default function ProjectModol({
  ProjectToEdit,
  onClose,
}: {
  ProjectToEdit?: ProjectToEdit;
  onClose?: () => void;
}) {
  const [formData, setFormData] = useState<ProjectToEdit>({
    title: "",
    description: "",
    Category: "",
    attachments: [],
    dueDate: "",
    status: "backlog",
    assignedUsers: [],
  });
  const [deletedUserIds, setDeletedUserIds] = useState<string[]>([]);

  const { userContextId } = useUserContextId();
  const { loading, addProject, updateProject } = useTaskContext();
  const handleInputChange = useCallback(
    (field: keyof ProjectToEdit, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );
  useEffect(() => {
    if (ProjectToEdit) {
      setFormData({
        title: ProjectToEdit.title,
        description: ProjectToEdit.description || "",
        attachments: ProjectToEdit.attachments || [],
        Category: ProjectToEdit.Category || "",
        id: ProjectToEdit.id,
        dueDate: ProjectToEdit.dueDate || "",
        status: ProjectToEdit.status || "",
        assignedUsers: ProjectToEdit.assignedUsers || [],
      });
    }
  }, [ProjectToEdit]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    if (ProjectToEdit) {
      await updateProject(
        ProjectToEdit.id || "",
        formData.title,
        formData.description || "",
        formData.Category,
        formData.attachments,
        formData.dueDate || "",
        formData.status || "backlog",
        formData.assignedUsers || [],
        deletedUserIds
      );
    } else {
      await addProject(
        formData.title,
        userContextId || "",
        formData.description,
        formData.Category || "",
        formData.attachments || [],
        formData.dueDate || "",
        formData.status || "backlog"
      );
    }

    setFormData({
      title: "",
      description: "",
      attachments: [],
      Category: "",
      dueDate: "",
      status: "",
      assignedUsers: [],
    });
    if (onClose) onClose();
  };
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
  const isOwner = ProjectToEdit
    ? ProjectToEdit?.userId === userContextId
    : true;
  return (
    <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] p-6 bg-background shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-border">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-2xl font-semibold tracking-tight">
          {ProjectToEdit ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {ProjectToEdit
            ? "Update the project details below."
            : "Fill out the information to create a new project."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-9">
        {/* Left Side - Text Fields */}
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <label
              className="text-sm 
             font-medium text-foreground"
            >
              Project Title
            </label>
            <Input
              placeholder="Enter project title..."
              value={formData.title}
              className="mt-2"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              placeholder="Write a detailed project description..."
              rows={7}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="resize-none h-44 border-muted-foreground/20 mt-2"
            />
          </div>
        </div>

        <div className="flex flex-col h-full gap-4">
          <div className="bg-accent/25 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
            {formData.attachments?.[0] ? (
              <img
                src={formData.attachments[0]}
                alt="Preview"
                className="w-full h-48 object-cover shadow-sm"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center border border-dashed text-muted-foreground text-sm">
                No image uploaded
              </div>
            )}

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
        </div>
      </div>

      <Separator className="border-t mt-8 mb-6" />

      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
        <Input
          placeholder="Category"
          value={formData.Category}
          onChange={(e) =>
            setFormData({ ...formData, Category: e.target.value })
          }
        />

        <DatePicker
          value={formData.dueDate || ""}
          onChange={(date) => setFormData({ ...formData, dueDate: date || "" })}
        />

        <div className=" space-y-3">
          {!isOwner && (
            <p className="text-xs text-muted-foreground">
              you can only view assigned users.
            </p>
          )}

          {isOwner && (
            <Input
              placeholder="Assign project by Id"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();

                  if (value && !formData.assignedUsers?.includes(value)) {
                    setFormData((prev) => ({
                      ...prev,
                      assignedUsers: [...(prev.assignedUsers || []), value],
                    }));
                  }

                  e.currentTarget.value = "";
                }
              }}
            />
          )}

          <div className="flex flex-wrap gap-2 mt-1">
            {formData.assignedUsers?.map((uid) => (
              <div
                key={uid}
                className="flex items-center gap-1 bg-muted text-foreground text-xs px-2 py-0.5 rounded-md"
              >
                {uid.slice(0, 4)}
                {isOwner && (
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        assignedUsers: prev.assignedUsers?.filter(
                          (id) => id !== uid
                        ),
                      }));

                      setDeletedUserIds((prev) => [...prev, uid]);
                    }}
                    className="text-chart-5 hover:text-destructive ml-1 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Select
          value={formData.status}
          onValueChange={(v) => handleInputChange("status", v)}
        >
          <SelectTrigger className="">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Footer */}
      <DialogFooter className="mt-4 flex justify-end">
        <Button onClick={handleSubmit} disabled={loading} className="px-6">
          {loading
            ? ProjectToEdit
              ? "Updating..."
              : "Adding..."
            : ProjectToEdit
            ? "Update Project"
            : "Add Project"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
