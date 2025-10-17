"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DailyCalendar() {
  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();

  const date = today.getDate();

  return (
    <Card className="w-full p-0.5 max-h-min shadow-sm border border-border rounded-lg">
      <CardContent className="p-0 h-full flex flex-col justify-between">
        <div className="flex justify-between items-center px-3 ">
          <h3 className="text-xs font-semibold text-muted-foreground">
            {today.toLocaleString("default", { month: "long" })} {year}
          </h3>
          <Button size="sm" variant="ghost" className="text-xs px-2 py-0">
            {date}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
