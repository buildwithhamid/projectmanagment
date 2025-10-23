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

type ProjectToEdit = {
  id?: string;
  title: string;
  description: string;
  Category?: string;
  attachments?: string[];
  dueDate?: string;
  status?: string;
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
  });

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
        formData.status || "backlog"
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

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {ProjectToEdit ? "Edit Project" : "Add Project"}
        </DialogTitle>
        <DialogDescription>
          {ProjectToEdit ? "You can edit your project" : "You can add project"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <Input
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Textarea
          placeholder="Enter description"
          rows={6}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="h-32 custom-scroll"
        />
        <Input
          placeholder="Project Category"
          value={formData.Category}
          onChange={(e) =>
            setFormData({ ...formData, Category: e.target.value })
          }
        />
        <div className="flex flex-row gap-2 w-full">
          <Input
            placeholder="Project Category"
            value={formData.Category}
            onChange={(e) =>
              setFormData({ ...formData, Category: e.target.value })
            }
            className="hidden"
          />
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
            value={formData.dueDate || ""}
            onChange={(date) =>
              setFormData({ ...formData, dueDate: date || "" })
            }
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

      <DialogFooter className="flex justify-center gap-2">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? ProjectToEdit
              ? "Updating..."
              : "Adding..."
            : ProjectToEdit
            ? "Update"
            : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
