"use client";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TodoModel from "@/components/TodoModel";
import TaskAccordionTable from "@/components/TaskAccordionTable ";
import { useTaskContext } from "../TaskContext/TaskContext";
import Loader from "@/components/Loader";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { taskCache, loading } = useTaskContext();
  const [showPopup, setShowPopup] = useState(false);

  const projectDocId = Object.keys(taskCache).find((id) => id === projectId);
  const specificTasks = projectDocId ? taskCache[projectDocId].tasks : [];
  console.log(`Tasks for ${projectId} are ${specificTasks}`);
  return (
    <div className="min-h-screen w-full p-2 space-y-4 flex flex-col bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full py-20">
            <Loader />
          </div>
        ) : (
          <TaskAccordionTable
            tasks={specificTasks}
            loading={loading}
            handleshowpop={() => setShowPopup(true)}
            projectId={projectId}
          />
        )}
      </div>

      {showPopup && <TodoModel projectId={projectId!} />}
    </div>
  );
};

export default ProjectPage;
