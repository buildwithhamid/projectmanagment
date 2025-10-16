"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type Day = {
  label: string;
  date: number;
};

const daysOfWeek: Day[] = [
  { label: "Fri", date: 4 },
  { label: "Sat", date: 5 },
  { label: "Sun", date: 6 },
  { label: "Mon", date: 7 },
  { label: "Tue", date: 8 },
  { label: "Wed", date: 9 },
  { label: "Thu", date: 10 },
];

export default function DailyCalendar() {
  const [selectedDay, setSelectedDay] = useState<number>(7);

  return (
    <Card className="h-22 w-full shadow-lg border border-border rounded-lg ">
      <CardContent className="p-0 -mt-2">
        <ScrollArea aria-orientation="horizontal" className="w-full">
          <div className="flex gap-2 overflow-x-auto p-2">
            {daysOfWeek.map((day) => (
              <Button
                key={day.date}
                variant={selectedDay === day.date ? "default" : "outline"}
                className={`flex flex-col items-center justify-center w-14 h-16 rounded-lg ${
                  selectedDay === day.date ? "bg-purple-500 text-white" : ""
                }`}
                onClick={() => setSelectedDay(day.date)}
              >
                <span className="text-sm font-medium">{day.label}</span>
                <span className="text-lg font-bold">{day.date}</span>
              </Button>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
