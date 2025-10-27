import React, { useState } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { Input } from "../components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";

const AssignProjects: React.FC = () => {
  const [search, setSearch] = useState("");
  const { projects, taskCache } = useTaskContext();
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            📁 Assign Projects
          </h1>
          <Input
            type="text"
            placeholder="🔍 Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 sm:mt-0 sm:w-64 border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className="w-full h-full">
                <ProjectCard
                  projectToShow={project}
                  tasks={project.id ? taskCache[project.id]?.tasks : []}
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
