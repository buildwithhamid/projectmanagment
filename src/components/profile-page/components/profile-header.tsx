import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, MapPin, Briefcase } from "lucide-react";
import { type User } from "@/TaskContext/TaskContext";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar + Active Badge */}
          <div className="relative inline-block">
            <Avatar className="h-24 w-24">
              {user?.avatar ? (
                <AvatarImage
                  src={user.avatar}
                  alt={user.fullname || "user profile"}
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
              className={`absolute right-1 bottom-1 h-4 w-4 rounded-full border-1 border-white ${
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

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              {user?.email && (
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {user.email}
                </div>
              )}
              {user?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {user.location}
                </div>
              )}
              {user?.occupation && (
                <div className="flex items-center gap-1">
                  <Briefcase className="size-4" />
                  {user.occupation}
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
