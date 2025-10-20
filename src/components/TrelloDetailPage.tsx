import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, FolderOpen } from "lucide-react";

type TaskDetailModalProps = {
  task: any | null;
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task }) => {
  if (!task) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[90vh] p-0 overflow-hidden">
      <ScrollArea className="max-h-[90vh]">
        {/* Cover Image */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="w-full h-48 sm:h-64 md:h-72 bg-muted relative overflow-hidden">
            <img
              src={task.attachments[0]}
              alt="Task attachment"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-5">
          {/* Title & Status */}
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <DialogTitle className="text-lg sm:text-2xl font-bold leading-tight">
                {task.title}
              </DialogTitle>
              <Badge variant={getStatusVariant(task.status)} className="w-fit">
                {task.status}
              </Badge>
            </div>
          </DialogHeader>

          {/* Project */}
          {task.projectTitle && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FolderOpen className="h-4 w-4" />
              <span className="text-sm font-medium truncate">
                {task.projectTitle}
              </span>
            </div>
          )}

          <Separator />

          {/* Description */}
          {task.todo && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {task.todo}
              </p>
            </div>
          )}

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {task.dueDate && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">Due Date</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatDate(task.dueDate)}
                </p>
              </div>
            )}

            {task.createdAt && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Created At</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            )}
          </div>

          {/* Last Updated */}
          {task.updatedAt && (
            <>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Last Updated
                </p>
                <p className="text-sm">{formatDate(task.updatedAt)}</p>
              </div>
            </>
          )}

          {/* Additional Attachments */}
          {task.attachments && task.attachments.length > 1 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Additional Attachments
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {task.attachments
                    .slice(1)
                    .map((attachment: string, index: number) => (
                      <img
                        key={index}
                        src={attachment}
                        alt={`Attachment ${index + 2}`}
                        className="w-full h-28 object-cover rounded-lg border"
                      />
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default TaskDetailModal;
