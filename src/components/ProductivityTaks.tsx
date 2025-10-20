import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function ProductivityInsights() {
  const insights = [
    { label: "Tasks Completed", value: "12" },
    { label: "Hours Worked", value: "38h" },
    { label: "Focus Score", value: "92%" },
  ];

  return (
    <Card className="border border-border/50 max-h-min rounded-lg ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 size={18} /> Productivity Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {insights.map((i, idx) => (
          <div
            key={idx}
            className="flex justify-between text-sm text-muted-foreground"
          >
            <span>{i.label}</span>
            <span className="text-foreground font-semibold">{i.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
