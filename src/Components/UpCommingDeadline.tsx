"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { CalendarDays } from "lucide-react";
import { Badge } from "./ui/badge";

type Project = {
  id?: string;
  title: string;
  dueDate?: string;
};

export function UpcomingDeadlines({ projects = [] }: { projects: Project[] }) {
  const sorted = [...projects]
    .filter((p) => p.dueDate)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 10);

  return (
    <Card className="relative border border-border/50 rounded-lg w-full max-h-min">
      <CardHeader className="px-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <CalendarDays size={16} />
          Upcoming Deadlines
        </CardTitle>
        <Badge variant="outline" className="text-sm absolute top-2 right-3">
          {sorted.length}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="w-full h-[65px]">
          <div className="flex flex-col gap-1 px-3 ">
            {sorted.length > 0 ? (
              sorted.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between text-xs text-muted-foreground"
                >
                  <span className="truncate max-w-[65%]">{p.title}</span>
                  <span className="text-foreground font-medium">
                    {new Date(p.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs text-center py-1">
                No upcoming deadlines
              </p>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
