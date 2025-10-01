import React, { useState } from "react";
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
export default function ProjectModol() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    attachments: [] as string[],
  });
  const { userContextId } = useUserContextId();
  const { loading, addProject } = useTaskContext();
  const handleSubmit = async () => {
    if (!formData.title.trim()) return;

    await addProject(
      formData.title,
      userContextId,
      formData.description,
      formData.attachments
    );

    setFormData({ title: "", description: "", attachments: [] });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Project</DialogTitle>
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
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
