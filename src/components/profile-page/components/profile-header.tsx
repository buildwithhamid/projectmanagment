import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";

interface User {
  name: string;
  email: string;
  location?: string;
  joinedAt?: string;
  role?: string;
  avatarUrl?: string;
  membership?: string;
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {user.name || "Unnamed User"}
              </h1>
              {user.membership && (
                <Badge variant="secondary">{user.membership}</Badge>
              )}
            </div>
            {user.role && <p className="text-muted-foreground">{user.role}</p>}

            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              {user.email && (
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {user.email}
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {user.location}
                </div>
              )}
              {user.joinedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Joined {user.joinedAt}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
