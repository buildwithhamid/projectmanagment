import React, { useState, useEffect } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";

type Project = {
  id?: string;
  title: string;
  description: string;
  attachments: string[];
};

export default function ProjectModol({
  project,
  onClose,
}: {
  project?: Project;
  onClose?: () => void;
}) {
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    attachments: [],
  });

  const { userContextId } = useUserContextId();
  const { loading, addProject, updateProject } = useTaskContext();

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        attachments: project.attachments || [],
        id: project.id,
      });
    }
  }, [project]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    if (project) {
      await updateProject(
        project.id || "",
        formData.title,
        formData.description,
        formData.attachments
      );
    } else {
      await addProject(
        formData.title,
        userContextId || "",
        formData.description,
        formData.attachments
      );
    }

    setFormData({ title: "", description: "", attachments: [] });
    if (onClose) onClose();
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
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
            ? project
              ? "Updating..."
              : "Adding..."
            : project
            ? "Update"
            : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
