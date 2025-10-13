import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { CheckCircle, Clock, FolderOpen, Search } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "@/components/ProjectModol";
import { Plus } from "lucide-react";
import Loader from "@/components/Loader";
import DailyCalendar from "@/components/TodayDate";

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
        <Loader />
      ) : (
        <div className="min-h-screen bg-background">
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

            <section className="flex w-full gap-2">
              <div className="w-3/4">
                <div className="flex items-center w-full gap-2 py-2 shadow-sm">
                  <div className="relative flex items-center w-full max-w-lg">
                    <Search
                      className="absolute left-3 text-muted-foreground"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={filteredProject}
                      onChange={(e) => setfilteredProject(e.target.value)}
                      className="pl-10 pr-4 py-3 text-sm w-full"
                    />
                  </div>

                  <Select defaultValue="all" onValueChange={setFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="lastupdated">Last Updated</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    defaultValue="all"
                    onValueChange={handleCategoryProject}
                  >
                    <SelectTrigger>
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

                <div className="mt-2 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        projectToShow={project}
                        tasks={project.id ? taskCache[project.id]?.tasks : []}
                        onClick={handleProjectClick}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center ml-30">
                      No projects found Add new projects to get started.
                    </p>
                  )}
                </div>
              </div>

              <div className="md:w-1/3 flex flex-col gap-2 ">
                <LatestUpdatedTasks latestTasks={latestTasks} />
                <DailyCalendar />
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default HomePage;
