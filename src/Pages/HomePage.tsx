import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { CheckCircle, Clock, FolderOpen, Loader, Search } from "lucide-react";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useNavigate } from "react-router-dom";
import { StatsCard } from "@/components/HomePageSatasCard";
import LatestUpdatedTasks from "@/components/LatestUpdatedTasks";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "@/components/ProjectModol";
import { Plus } from "lucide-react";

import DailyCalendar from "@/components/TodayDate";
import { ProductivityInsights } from "@/components/ProductivityTaks";
import { UpcomingDeadlines } from "@/components/UpCommingDeadline";
import { AITipCard } from "@/components/AiTipsCard.";

const HomePage = () => {
  const { projects, taskCache, loading } = useTaskContext();
  const navigate = useNavigate();

  const [filteredProject, setfilteredProject] = useState("");
  const [filter, setFilter] = useState("all");
  const [filteredCategory, setFilteredCategory] = useState("");

  const LatestProject = useMemo(() => {
    if (!projects?.length) return null;
    return [...projects]
      .filter((p) => p.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
  }, [projects]);

  const LastUpdatedProject = useMemo(() => {
    if (!projects?.length) return null;
    return [...projects]
      .filter((p) => p.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const titleMatch = project.title
        .toLowerCase()
        .includes(filteredProject.toLowerCase());
      const categoryMatch = filteredCategory
        ? project.Category?.toLowerCase() === filteredCategory.toLowerCase()
        : true;

      const dropdownMatch =
        filter === "recent"
          ? project.id === LatestProject?.id
          : filter === "lastupdated"
          ? project.id === LastUpdatedProject?.id
          : true;

      return titleMatch && categoryMatch && dropdownMatch;
    });
  }, [
    projects,
    filteredProject,
    filteredCategory,
    filter,
    LatestProject,
    LastUpdatedProject,
  ]);
  console.log("Render ProjectCard", filteredProjects.length);

  const Categories = useMemo(() => {
    const unique = new Set();
    return projects.filter((p) => {
      if (p.Category && !unique.has(p.Category)) {
        unique.add(p.Category);
        return true;
      }
      return false;
    });
  }, [projects]);

  const { totalTasks, totalActive, totalCompleted, latestTasks } =
    useMemo(() => {
      let total = 0,
        active = 0,
        completed = 0;
      const allTasks = [];

      for (const [projectId, project] of Object.entries(taskCache)) {
        const tasks = project.tasks || [];
        total += tasks.length;
        active += tasks.filter((t) => t.status === "active").length;
        completed += tasks.filter((t) => t.status === "completed").length;

        for (const task of tasks) {
          if (task.updatedAt) {
            allTasks.push({
              ...task,
              projectId,
              projectTitle: project.title,
            });
          }
        }
      }

      allTasks.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      return {
        totalTasks: total,
        totalActive: active,
        totalCompleted: completed,
        latestTasks: allTasks,
      };
    }, [taskCache]);

  const handleProjectClick = (id: string) => navigate(`/projects/${id}`);

  const handleCategoryProject = (value: string) =>
    setFilteredCategory(value === "all" ? "" : value);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="h-full w-full bg-background p-0">
          <main className="max-w-7xl mx-auto pt-2 flex-1">
            {/* Stats Section */}
            <section className="mb-2">
              <div className="grid auto-rows-min gap-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
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
                  value={totalActive}
                  icon={Clock}
                  color="bg-gradient-to-br from-amber-500 to-amber-600"
                />
                <StatsCard
                  title="Completed"
                  value={totalCompleted}
                  icon={CheckCircle}
                  color="bg-gradient-to-br from-violet-500 to-violet-600"
                />
              </div>
            </section>

            <section className="flex flex-col lg:flex-row h-full w-full gap-3">
   
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-2">
              
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-2 py-2 shadow-sm">
                   
                    <div className="relative flex items-center w-full sm:max-w-sm md:max-w-md lg:max-w-[280px]">
                      <Search
                        className="absolute left-3 text-muted-foreground"
                        size={18}
                      />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={filteredProject}
                        onChange={(e) => setfilteredProject(e.target.value)}
                        className="pl-10 pr-8 py-1 text-sm  "
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
                      <Select defaultValue="all" onValueChange={setFilter}>
                        <SelectTrigger className="min-w-[130px]">
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

                      <Select
                        defaultValue="all"
                        onValueChange={handleCategoryProject}
                      >
                        <SelectTrigger className="min-w-[130px]">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Categories</SelectItem>
                          {Categories.map((c) => (
                            <SelectItem key={c.id} value={c.Category}>
                              {c.Category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="default"
                            className="flex items-center gap-2 font-medium whitespace-nowrap"
                          >
                            <Plus size={18} />
                            Add Project
                          </Button>
                        </DialogTrigger>
                        <ProjectModol />
                      </Dialog>
                    </div>
                  </div>

                  <div className="w-full mt-1 grid gap-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.length > 0 ? (
                      filteredProjects.map((project) => (
                        <div key={project.id} className="w-full h-full">
                          <ProjectCard
                            projectToShow={project}
                            tasks={
                              project.id ? taskCache[project.id]?.tasks : []
                            }
                            onClick={handleProjectClick}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center col-span-full">
                        No projects found. Add new projects to get started.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:w-[40%] xl:w-[45%] gap-3 mt-2">
                <div className="flex flex-col gap-3 w-full lg:w-1/2">
                  <UpcomingDeadlines />
                  <ProductivityInsights />
                  <AITipCard />
                </div>
                <div className="flex flex-col gap-3 w-full lg:w-1/2 -mt-2">
                  <LatestUpdatedTasks latestTasks={latestTasks} />
                  <DailyCalendar />
                </div>
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default HomePage;
