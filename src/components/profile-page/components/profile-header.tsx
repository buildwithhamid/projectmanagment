import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, MapPin, Briefcase } from "lucide-react";
import { type User } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import { ThemeToggle } from "@/components/ThemeToggle";
interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { userContextId } = useUserContextId();
  return (
    <Card>
      <CardContent className="relative p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative inline-block">
            <Avatar className="h-32 w-32 border-2 border-primary rounded-full">
              {user?.avatar ? (
                <AvatarImage
                  src={user.avatar}
                  alt={user.fullname || "user profile"}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-2xl">
                  {user?.fullname
                    ? user.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              )}
            </Avatar>

            <Badge
              variant="outline"
              className={`absolute right-2 bottom-2 h-4 w-4 rounded-full border-1 border-white ${
                user?.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
              title={user?.isActive ? "Active" : "Inactive"}
            />
          </div>

          {/* Main Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {user?.fullname || "Unnamed User"}
              </h1>

              {user?.organization && (
                <span className="text-sm text-muted-foreground">
                  — {user.organization}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm  ">
              <div className="flex items-center gap-2">
                <span className="font-mono text-foreground/80">
                  <span className="text-muted-foreground">UID:</span>{" "}
                  {user?.id || userContextId}
                </span>
              </div>
              {user?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-muted-foreground" />
                  <span className="truncate max-w-[180px] md:max-w-none text-foreground/80">
                    {user.email}
                  </span>
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-muted-foreground" />
                  <span className="text-foreground/80">{user.location}</span>
                </div>
              )}
              {user?.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase size={15} className="text-muted-foreground" />
                  <span className="text-foreground/80">{user.occupation}</span>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-muted-foreground" />
                  <span className="text-foreground/80">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-2">
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
