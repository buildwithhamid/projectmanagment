import { useState, useEffect, useRef } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/Config/firbase";
import { useUserContextId } from "@/AuthContext/UserContext";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Loader2 } from "lucide-react";
import Loader from "./Loader";

export default function ProjectChatModal({ projectId }: { projectId: string }) {
  const { userContextId } = useUserContextId();
  const { userData } = useTaskContext();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Fetch project info (participants)
  useEffect(() => {
    if (!open) return;

    const fetchProject = async () => {
      const projectRef = doc(db, "Projects", projectId);
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        setAssignedUsers(data.assignedUsers || []);
        setOwnerId(data.userId || null);
      }
    };

    fetchProject();
  }, [open, projectId]);

  // 🔹 Fetch messages in real-time
  useEffect(() => {
    if (!open) return;

    const q = query(
      collection(db, "Projects", projectId, "chat"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [open, projectId]);
  console.log(messages);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message handler
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSending(true);

    await addDoc(collection(db, "Projects", projectId, "chat"), {
      text: message,
      senderId: userData?.id || userContextId,
      senderName: userData?.fullname || "Unknown",
      senderPhoto: userData?.avatar || "",
      createdAt: serverTimestamp(),
    });

    setMessage("");
    setSending(false);
  };

  // 🔹 Detect typing activity
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
  };

  const canChat =
    ownerId === userContextId ||
    ownerId === userData?.id ||
    assignedUsers.includes(userContextId!) ||
    assignedUsers.includes(userData?.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg cursor-pointer
             flex items-center justify-center transition-all duration-300 
             hover:scale-105 border "
        >
          <MessageCircle size={26} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl p-0 rounded-xl shadow-2xl border border-border/40">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-muted/40 via-muted/20 to-muted/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold tracking-tight">
                Project Chat
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Collaborate and communicate with your team in real time.
              </DialogDescription>
            </div>
            <Badge
              variant="outline"
              className="  px-2 py-1 bg-primary rounded-md"
            >
              Live
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex h-[65vh]">
          {/* 🔹 Participants Panel */}
          <div className="w-1/3 border-r bg-muted/10 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm uppercase text-muted-foreground">
                Participants
              </h3>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-2">
              {userData && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 border border-transparent hover:border-border transition">
                  <Avatar className="w-9 h-9 border">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>
                      {userData.fullname?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex justify-between w-full">
                    <p className="font-medium text-sm">{userData.fullname}</p>
                    <Badge variant="secondary" className="text-xs w-fit">
                      You
                    </Badge>
                  </div>
                </div>
              )}

              <Separator className="my-3" />

              <p className="text-xs mb-1 text-muted-foreground uppercase tracking-wide">
                Assigned Users
              </p>

              {assignedUsers.length > 0 ? (
                assignedUsers.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition"
                  >
                    <Avatar className="w-9 h-9 border">
                      <AvatarFallback>{user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{user}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No assigned members.
                </p>
              )}
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col bg-background">
            {loading ? (
              <div className="flex justify-center items-center h-full py-20">
                <Loader />
              </div>
            ) : (
              <ScrollArea className="flex-1 h-[40vh] px-4 py-2">
                <div className="space-y-2">
                  {messages.map((msg) => {
                    const isUser = msg.senderId === userContextId;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl shadow-sm border transition-all ${
                            isUser
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-muted text-foreground rounded-bl-none"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="w-6 h-6 border">
                              <AvatarImage src={msg.senderPhoto} />
                              <AvatarFallback>
                                {msg.senderName?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs opacity-80 font-medium">
                              {msg.senderName}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            )}

            <Separator />

            {canChat ? (
              <form
                onSubmit={sendMessage}
                className="flex flex-col gap-1 p-3 border-t bg-muted/10 backdrop-blur supports-[backdrop-filter]:bg-muted/20"
              >
                {typing && (
                  <p className="text-xs text-muted-foreground mb-2 px-3">
                    {userData?.fullname || "You"} are typing...
                  </p>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleTyping}
                    className="flex-1 border rounded-full px-4"
                    disabled={sending}
                  />
                  <Button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="rounded-full px-6 flex items-center gap-2"
                  >
                    {sending && (
                      <Loader2 className="animate-spin w-4 h-4 text-white" />
                    )}
                    {sending ? "Sending..." : "Send"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                You’re not a participant of this project.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
