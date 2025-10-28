import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { Input } from "../components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";
import ProjectModol from "@/components/ProjectModol";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AssignProjects: React.FC = () => {
  const [search, setSearch] = useState("");
  const { projects, taskCache } = useTaskContext();
  const navigate = useNavigate();
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const handleProjectClick = (id: string) => navigate(`../projects/${id}`);

  return (
    <main className=" relative min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold">Assign Projects</h1>
          <div className="flex gap-2 mt-3 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className=" min-w-max md:min-w-[120px] flex items-center gap-2 font-medium whitespace-nowrap"
                >
                  <Plus size={18} />

                  <span className="hidden md:inline">Add Project</span>
                  <span className=" md:hidden">Project</span>
                </Button>
              </DialogTrigger>
              <ProjectModol />
            </Dialog>
            <Input
              type="text"
              placeholder="🔍 Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" sm:mt-0 sm:w-64 border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="w-full h-full">
                <ProjectCard
                  projectToShow={project}
                  tasks={project.id ? taskCache[project.id]?.tasks : []}
                  onClick={handleProjectClick}
                />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center col-span-full pt-12">
              No projects found. Add new projects to get started.
            </p>
          )}
        </div>

        {/* No Projects */}
        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No projects found.</p>
        )}
      </div>
    </main>
  );
};

export default AssignProjects;
