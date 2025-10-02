import React, { useState, useEffect } from "react";
import { useTaskContext } from "../TaskContext/TaskContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../Config/firbase";
import { updateDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

import TodoModel from "@/components/TodoModel";
import { FaEdit } from "react-icons/fa";
import { Plus } from "lucide-react";

const DashboardPage: React.FC = () => {
  const { taskCache } = useTaskContext();
  const { projectId } = useParams();
  const [projectTitle, setprojectTitle] = useState<string>("");
  const [statusTasks, setStatusTasks] = useState<{ [key: string]: any[] }>({});

  const [loading, setLoading] = useState(true);
  const statuses = ["backlog", "pending", "active", "inactive", "completed"];
  const { projects } = useTaskContext();
  useEffect(() => {
    if (!projectId) return;

    const project = taskCache[projectId];
    const projectTasks = project?.tasks;
    console.log(projectTasks);
    const project2 = projects.find((p) => p.id === projectId);
    setprojectTitle(project2?.title || "");

    const statusTasksObj: { [key: string]: any[] } = {};
    statuses.forEach((status) => {
      statusTasksObj[status] = projectTasks.filter(
        (task) => task.status === status
      );
    });

    setStatusTasks(statusTasksObj);
    setLoading(projectTasks.length === 0);
  }, [projectId, taskCache]);
  console.log(`current page project title: ${projectTitle}`);
  console.log(statusTasks);
  const updateTaskStatusInFirebase = async (
    taskId: string,
    newStatus: string
  ) => {
    try {
      const projectId = Object.keys(taskCache).find((pid) =>
        taskCache[pid].tasks.some((t) => t.id === taskId)
      );
      if (!projectId) return;

      const todoRef = doc(db, "Projects", projectId, "tasks", taskId);
      await updateDoc(todoRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { source, destination } = event;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const newStatusTasks = { ...statusTasks };
    const movedTask = newStatusTasks[sourceId].splice(source.index, 1)[0];
    if (sourceId !== destId) {
      movedTask.status = destId;
    }
    newStatusTasks[destId].splice(destination.index, 0, movedTask);
    setStatusTasks(newStatusTasks);

    if (sourceId !== destId) {
      updateTaskStatusInFirebase(movedTask.id, destId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-2 p-2 w-screen  relative overflow-y-auto scrollbar-thin">
        {statuses.map((statusKey) => (
          <Droppable droppableId={statusKey} type="TASK" key={statusKey}>
            {(provided) => (
              <div
                className="flex-none rounded-2xl shadow-md transition-all duration-300 transform hover:scale-[1.02] p-3 min-w-[200px] max-w-[260px] max-h-min overflow-y-auto bg-background text-foreground"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-bold text-lg mb-3 capitalize text-card-foreground">
                  {statusKey}
                </h2>

                <div className="flex flex-col gap-2">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    (statusTasks[statusKey] || []).map((todo, index) => (
                      <Draggable
                        key={todo.id}
                        draggableId={todo.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="relative p-2 flex flex-col gap-2 bg-accent text-accent-foreground rounded-lg shadow-sm hover:shadow-md transition cursor-pointer hover:border border-white"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {todo.attachments &&
                              todo.attachments.length > 0 && (
                                <img
                                  src={todo.attachments[0]}
                                  alt="todo-attachment"
                                  className="w-full h-28 object-cover rounded-md"
                                />
                              )}
                            <span
                              className={`text-sm ${
                                todo.status === "completed"
                                  ? "line-through text-gray-500"
                                  : "text-foreground"
                              }`}
                            >
                              {todo.title}
                            </span>

                            {todo.todo && (
                              <p className="text-xs text-accent-foreground line-clamp-3">
                                {todo.todo}
                              </p>
                            )}

                            <Dialog>
                              <DialogTrigger asChild>
                                <FaEdit
                                  size={16}
                                  className={`absolute right-2 ${
                                    todo.attachments &&
                                    todo.attachments.length > 0 &&
                                    "top-32"
                                  } text-muted-foreground hover:text-primary cursor-pointer`}
                                />
                              </DialogTrigger>
                              <DialogContent>
                                <TodoModel
                                  projectTitle={projectTitle}
                                  taskToEdit={todo}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  <div className="w-full flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer"
                        >
                          Add <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <TodoModel projectTitle={projectTitle} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DashboardPage;
