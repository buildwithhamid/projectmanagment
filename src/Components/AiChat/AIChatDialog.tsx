"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import OpenAI from "openai";
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const AITalk = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.text,
          })),
          { role: "user", content: input },
        ] as Message[],
      });

      const reply = response.choices[0].message.content;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: reply || "" },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Something went wrong, please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      <Card className="flex-1 flex flex-col shadow-xl border border-border ">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            🤖 AI Talk (OpenAI GPT-4o)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="  flex-1 mb-2 p-2 bg-muted rounded-lg">
            <div className="space-y-2 ">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-2xl flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[100%] max-w-2xl">
            <Input
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITalk;
