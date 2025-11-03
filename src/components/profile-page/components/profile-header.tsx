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
    <Card className="overflow-hidden relative">
      <CardContent className="relative p-0">
        <div className="w-full h-48 md:h-64 -mt-3 relative">
          <img
            src={user?.coverImage || ""}
            alt={"user profile cover image"}
            className="w-full h-full  object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 px-4 -mt-16 md:-mt-8">
          <div className="relative">
            <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-primary rounded-full">
              {user?.avatar ? (
                <AvatarImage
                  src={user.avatar}
                  alt={user.fullname || "user profile"}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-3xl">
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
              className={`absolute right-2 bottom-2 h-5 w-5 rounded-full border-white  ${
                user?.isActive ? "bg-chart-2" : "bg-gray-400"
              }`}
              title={user?.isActive ? "Active" : "Inactive"}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                {user?.fullname || "Unnamed User"}
              </h1>
              {user?.organization && (
                <span className="text-sm text-muted-foreground">
                  — {user.organization}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80">
              <span className="font-mono text-foreground/80">
                <span className="text-muted-foreground">UID:</span>{" "}
                {user?.id || userContextId}
              </span>
              {user?.email && (
                <div className="flex items-center gap-1">
                  <Mail size={15} className="text-muted-foreground" />
                  {user.email}
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={15} className="text-muted-foreground" />
                  {user.location}
                </div>
              )}
              {user?.occupation && (
                <div className="flex items-center gap-1">
                  <Briefcase size={15} className="text-muted-foreground" />
                  {user.occupation}
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={15} className="text-muted-foreground" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-64 right-2">
          <ThemeToggle />
        </div>
      </CardContent>
    </Card>
  );
}
