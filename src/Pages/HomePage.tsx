import React, { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import {
  CheckCircle,
  Clock,
  FolderOpen,
  Plus,
  Search,
  Tag,
} from "lucide-react";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/HomePageSatasCard";
import Loader from "@/components/Loader";
import LatestUpdatedTasks from "@/components/LatestUpdatedTasks";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ProjectModol from "@/components/ProjectModol";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ScrollAreaViewport } from "@radix-ui/react-scroll-area";

const HomePage = () => {
  const { projects, taskCache, loading } = useTaskContext();
  const [filteredProject, setfilteredProject] = useState("");
  const [filter, setFilter] = useState("all");
  const [filteredCategory, setFilteredCategory] = useState("");

  const navigate = useNavigate();

  const LatestProject = useMemo(
    () =>
      [...projects]
        .filter((project) => project.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )[0],
    [projects]
  );

  const LastUpdatedProject = useMemo(
    () =>
      [...projects]
        .filter((project) => project.updatedAt)
        .sort(
          (a, b) =>
            new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
        )[0],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchSearch = filteredProject
        ? project.title.toLowerCase().includes(filteredProject.toLowerCase())
        : true;

      const matchCategory = filteredCategory
        ? project.Category?.toLowerCase() === filteredCategory.toLowerCase()
        : true;

      const matchDropdown =
        filter === "recent"
          ? project.id === LatestProject?.id
          : filter === "lastupdated"
          ? project.id === LastUpdatedProject?.id
          : filter === "all"
          ? projects
          : true;

      return matchSearch && matchCategory && matchDropdown;
    });
  }, [
    projects,
    filteredProject,
    filter,
    filteredCategory,
    LatestProject,
    LastUpdatedProject,
  ]);

  const Categories = useMemo(
    () => projects.filter((project) => project.Category !== undefined),
    [projects]
  );

  const totalTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) => acc + project.tasks.length,
      0
    );
  }, [taskCache]);

  const totalActiveTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) =>
        acc + project.tasks.filter((task) => task.status === "active").length,
      0
    );
  }, [taskCache]);

  const totalCompletedTasks = useMemo(() => {
    return Object.values(taskCache).reduce(
      (acc, project) =>
        acc +
        project.tasks.filter((task) => task.status === "completed").length,
      0
    );
  }, [taskCache]);

  const latestTasks = useMemo(() => {
    return Object.entries(taskCache)
      .flatMap(([projectId, project]) =>
        project.tasks.map((task) => ({
          ...task,
          projectId,
          projectTitle: project.title,
        }))
      )
      .filter((task) => task.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
      );
  }, [taskCache]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCategoryProject = (categoryName: string) => {
    setFilteredCategory(categoryName);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-1">
        <main className="max-w-7xl mx-auto p-3 flex-1">
          <section className="mb-2">
            <div className="grid auto-rows-min gap-2 md:grid-cols-4">
              <StatsCard
                title="Projects"
                value={projects.length}
                icon={FolderOpen}
                color="bg-gradient-to-br from-sky-500 to-sky-600"
              />
              <StatsCard
                title="Total Tasks"
                value={totalTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-teal-500 to-teal-600"
              />
              <StatsCard
                title="Active"
                value={totalActiveTasks}
                icon={Clock}
                color="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              <StatsCard
                title="Completed"
                value={totalCompletedTasks}
                icon={CheckCircle}
                color="bg-gradient-to-br from-violet-500 to-violet-600"
              />
            </div>
          </section>

          <section className="flex w-full gap-2">
            <div className="w-3/4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <Tag size={16} />
                  Categories
                </h3>

                <ScrollArea className="w-full" aria-orientation="horizontal">
                  <ScrollAreaViewport className="w-full pb-1">
                    <div className="flex gap-2 min-w-max">
                      {Categories.map((category) => (
                        <Button
                          key={category.id}
                          value={category.Category}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                            filteredCategory === category.Category
                              ? "bg-primary text-white"
                              : ""
                          }`}
                          variant={"outline"}
                          onClick={() =>
                            handleCategoryProject(category.Category)
                          }
                        >
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />
                          {category.Category}
                        </Button>
                      ))}
                    </div>
                  </ScrollAreaViewport>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="flex items-center w-full gap-2 py-2 shadow-sm">
                  <div className="relative flex items-center w-full max-w-md">
                    <Search
                      className="absolute left-3 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={filteredProject}
                      onChange={(e) => setfilteredProject(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Select defaultValue="all" onValueChange={setFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="lastupdated">
                          Last Updated
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                    <DialogContent>
                      <ProjectModol />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-1 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredProjects.length > 0 &&
                    filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        tasks={taskCache[project?.id]?.tasks || []}
                        onClick={handleProjectClick}
                      />
                    ))}
                </div>
              </div>
            </div>
            <LatestUpdatedTasks latestTasks={latestTasks} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
