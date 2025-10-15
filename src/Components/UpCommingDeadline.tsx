import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export function UpcomingDeadlines() {
  const deadlines = [
    { title: "Finalize UI Design", date: "Oct 16, 2025" },
    { title: "API Integration", date: "Oct 18, 2025" },
    { title: "Testing & QA", date: "Oct 21, 2025" },
  ];

  return (
    <Card className="border border-border/50 max-h-min rounded-lg ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays size={18} /> Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {deadlines.map((d, i) => (
          <div
            key={i}
            className="flex justify-between text-sm text-muted-foreground"
          >
            <span>{d.title}</span>
            <span className="text-foreground font-medium">{d.date}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
