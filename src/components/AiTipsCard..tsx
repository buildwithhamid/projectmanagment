import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function AITipCard() {
  return (
    <Card className="rounded-lg  border border-border/50 bg-gradient-to-br from-indigo-500/10 to-purple-700/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot size={18} /> Smart Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You’ve completed 80% of your weekly goals. Try finishing “UI Testing”
          to hit 100% today!
        </p>
      </CardContent>
    </Card>
  );
}
