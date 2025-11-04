import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { db } from "@/Config/firbase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ProjectModol from "@/components/ProjectModol";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/TaskContext/TaskContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ProjectsBoard: React.FC = () => {
  const { projects = [], taskCache = {}, loading } = useTaskContext();
  const navigate = useNavigate();
  const statuses = [
    "backlog",
    "pending",
    "active",
    "inactive",
    "cancelled",
    "completed",
  ];
  const [groupedProjects, setGroupedProjects] = useState<
    Record<string, Project[]>
  >({});

  useEffect(() => {
    const grouped: Record<string, Project[]> = {};
    statuses.forEach((s) => (grouped[s] = []));
    projects.forEach((p) => {
      const st = (p.status ?? "backlog").toLowerCase();
      if (!grouped[st]) grouped[st] = [];
      grouped[st].push(p);
    });
    setGroupedProjects(grouped);
  }, [projects]);

  const updateProjectStatusInFirestore = async (
    projectId: string,
    newStatus: string
  ) => {
    try {
      const ref = doc(db, "Projects", projectId);
      await updateDoc(ref, { status: newStatus });
    } catch (err) {
      console.error("Error updating project status:", err);
    }
  };

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const newGrouped = { ...groupedProjects };
    const [moved] = newGrouped[sourceStatus].splice(source.index, 1);
    moved.status = destStatus;
    newGrouped[destStatus].splice(destination.index, 0, moved);
    setGroupedProjects(newGrouped);

    await updateProjectStatusInFirestore(draggableId, destStatus);
  };

  const handleProjectClick = (id: string) => navigate(`projects/${id}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className=" 
     h-full flex flex-col"
    >
      <ScrollArea className="w-[94vw] flex-1 h-[calc(100vh-150px)]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-2  py-2 min-w-max">
            {statuses.map((status) => {
              const projectsForStatus = groupedProjects[status] || [];
              const title = status.charAt(0).toUpperCase() + status.slice(1);

              return (
                <div
                  key={status}
                  className="flex-shrink-0 w-[230px] flex flex-col"
                >
                  <div className=" shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between px-1 py-1 mb-3 bg-card/40 border border-border/40 rounded-md ">
                      <h4 className="text-sm font-semibold text-foreground capitalize">
                        {title}
                      </h4>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                            variant={"ghost"}
                          >
                            <Plus size={14} />
                          </Button>
                        </DialogTrigger>
                        <ProjectModol />
                      </Dialog>
                    </div>

                    <Droppable droppableId={status} type="PROJECT">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex flex-col gap-3 transition-all overflow-y-auto max-h-[calc(100vh-220px)] ${
                            snapshot.isDraggingOver
                              ? "bg-accent/10 rounded-lg p-2"
                              : ""
                          }`}
                        >
                          <ScrollArea className="h-[100%] ">
                            {" "}
                            <div className="flex flex-col gap-2">
                              {projectsForStatus.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-6">
                                  No projects
                                </p>
                              )}

                              {projectsForStatus.map((project, index) => (
                                <Draggable
                                  key={project.id!}
                                  draggableId={project.id!}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`${
                                        snapshot.isDragging
                                          ? "opacity-90 scale-[0.99]"
                                          : ""
                                      }`}
                                    >
                                      <ProjectCard
                                        projectToShow={project}
                                        tasks={
                                          taskCache[project.id!]?.tasks || []
                                        }
                                        onClick={handleProjectClick}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          </ScrollArea>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              );
            })}
          </div>
        </DragDropContext>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ProjectsBoard;
