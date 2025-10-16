import { useParams } from "react-router-dom";
import TaskAccordionTable from "@/components/TaskAccordionTable ";
import { useTaskContext } from "../TaskContext/TaskContext";
import Loader from "@/components/Loader";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { taskCache, loading } = useTaskContext();

  const projectDocId = Object.keys(taskCache).find((id) => id === projectId);
  const specificTasks = projectDocId ? taskCache[projectDocId].tasks : [];
  console.log(`Tasks for ${projectId} are ${specificTasks}`);
  return (
    <div className="min-h-screen w-full space-y-4 flex flex-col bg-background text-foreground">
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full py-20">
            <Loader />
          </div>
        ) : (
          <TaskAccordionTable
            tasks={specificTasks}
            loading={loading}
            projectId={projectId}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
