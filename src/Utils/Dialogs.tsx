import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "@/components/ProjectModol";
import { Plus } from "lucide-react";

export const ProjectDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="default"
        className="flex items-center gap-2 font-medium"
      >
        <Plus size={18} />
        Add Project
      </Button>
    </DialogTrigger>

    <ProjectModol />
  </Dialog>
);
