import { useState, useEffect } from "react";
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

import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";

type ProjectToEdit = {
  id?: string;
  title: string;
  description: string;
  Category?: string;
  attachments?: string[];
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
  });

  const { userContextId } = useUserContextId();
  const { loading, addProject, updateProject } = useTaskContext();

  useEffect(() => {
    if (ProjectToEdit) {
      setFormData({
        title: ProjectToEdit.title,
        description: ProjectToEdit.description || "",
        attachments: ProjectToEdit.attachments || [],
        Category: ProjectToEdit.Category || "",
        id: ProjectToEdit.id,
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
        formData.attachments
      );
    } else {
      await addProject(
        formData.title,
        userContextId || "",
        formData.description,
        formData.Category || "",
        formData.attachments || []
      );
    }

    setFormData({ title: "", description: "", attachments: [], Category: "" });
    if (onClose) onClose();
  };

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
          placeholder="Project Description"
          rows={6}
          className="min-h-20"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <Input
          placeholder="Project Category"
          value={formData.Category}
          onChange={(e) =>
            setFormData({ ...formData, Category: e.target.value })
          }
        />

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
