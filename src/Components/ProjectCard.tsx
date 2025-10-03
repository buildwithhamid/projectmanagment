import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";

import { Progress } from "./ui/progress";
import { Calendar, Paperclip, MessagesSquare } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";

import ProjectModol from "./ProjectModol";

interface Task {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
}

interface Project {
  id: string;
  title: string;
  description?: string;
  url?: string;
  createdAt?: string;
  dueDate?: string;
  label?: string;
  priority?: string;
  attachments?: string[];
  comments?: number;
  members?: { avatar: string; name: string }[];
}

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onClick?: (projectId: string) => void;
}

const getTaskStats = (tasks: Task[]) => {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const total = tasks.length;

  return { completed, inProgress, pending, total };
};

const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const ProjectCard = ({ project, tasks, onClick }: ProjectCardProps) => {
  const { completed, total } = getTaskStats(tasks);
  const percentage = calculateProgress(completed, total);

  const handleCardClick = () => {
    if (project.id) {
      onClick?.(project.id);
    }
  };

  return (
    <Card className="w-full relative border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden pb-1">
      {project?.attachments?.length > 0 && (
        <div className="w-full h-12 -mt-3">
          <img
            src={project.attachments[0]}
            alt={project.title}
            className="w-full h-full object-cover "
          />
        </div>
      )}

      <CardHeader className="-mt-1">
        <div className="flex justify-between items-start">
          <Dialog>
            <DialogTrigger asChild>
              <FaEdit
                size={16}
                className=" absolute top-13 right-2 text-muted-foreground hover:text-primary cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent>
              <ProjectModol project={project} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent
        className="flex flex-col gap-1 -mt-2 -ml-3 px-4"
        onClick={handleCardClick}
      >
        <CardTitle className="text-base font-semibold line-clamp-2">
          {project?.title.charAt(0).toUpperCase() + project?.title.slice(1)}
        </CardTitle>

        <p className="text-sm text-muted-foreground line-clamp-2 ">
          {project.description}
        </p>

        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-xs text-gray-500 flex gap-0.5">
            <Calendar size={14} />
            <p className="text-xs text-gray-500">
              {project?.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "No date"}
            </p>
          </span>

          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Paperclip className="w-3 h-3" />{" "}
              {project?.attachments?.length || 0}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MessagesSquare className="w-3 h-3" /> {project?.comments || 0}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between -ml-3 px-4">
        <div className="flex items-center gap-2 flex-1">
          <Progress value={percentage} className="h-2 flex-1 rounded-full" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {completed}/{total}
          </span>
        </div>

        {project?.members && project.members.length > 0 && (
          <div className="flex -space-x-2 ml-2">
            {project.members.slice(0, 3).map((m, i) => (
              <img
                key={i}
                src={m.avatar}
                alt={m.name}
                className="w-6 h-6 rounded-full border-2 border-background object-cover"
              />
            ))}
            {project.members.length > 3 && (
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-[10px] font-medium border border-background">
                +{project.members.length - 3}
              </span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
