import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, User, Tag } from "lucide-react";
interface ProjectDetailsProps {
  specifictaskdata: any;
  tasks?: any[];
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  specifictaskdata,
  tasks,
}) => {
  const assignees = [
    { name: "John Steel", img: "https://i.pravatar.cc/150?img=1" },
    { name: "Morgan Peter", img: "https://i.pravatar.cc/150?img=2" },
    { name: "Christina Pearl", img: "https://i.pravatar.cc/150?img=3" },
    { name: "Malik", img: "https://i.pravatar.cc/150?img=4" },
  ];

  const tags = [
    { name: "UI Design", color: "bg-sky-100 text-sky-700" },
    { name: "Mobile", color: "bg-red-100 text-red-700" },
    { name: "Middle Project", color: "bg-green-100 text-green-700" },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-sm border rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {specifictaskdata?.title || "Untitled Project"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {specifictaskdata?.shortDescription ||
            "No short description available."}
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ======= Image + Description ======= */}
        <div className="relative">
          {specifictaskdata?.attachments &&
            specifictaskdata?.attachments.length > 0 && (
              <img
                src={specifictaskdata?.attachments[0]}
                alt={specifictaskdata?.title ?? "Project image"}
                className="w-full h-36 object-cover rounded-lg mb-2"
              />
            )}

          <p className="line-clamp-4 text-gray-500">
            {specifictaskdata?.description ?? "No description available."}
          </p>

          <div className="flex gap-3 absolute -bottom-6 text-xs text-gray-500">
            <p>{tasks?.length ?? 0} Tasks</p>
            <p>
              Created At:{" "}
              {specifictaskdata?.createdAt
                ? new Date(specifictaskdata.createdAt).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

        {/* ======= Divider ======= */}
        <div className="border-t border-muted my-8"></div>

        {/* ======= Status ======= */}
        <div className="flex items-start gap-3">
          <MessageSquare size={18} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-700 font-medium px-2 py-1 rounded-full"
            >
              ● On Progress
            </Badge>
          </div>
        </div>

        {/* ======= Assignees ======= */}
        <div className="flex items-start gap-3">
          <User size={18} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Assignees</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {assignees.map((person) => (
                <div
                  key={person.name}
                  className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-full"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={person.img} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{person.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======= Deadline ======= */}
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Deadline</p>
            <p className="text-sm font-medium">
              {specifictaskdata?.deadline
                ? new Date(specifictaskdata.deadline).toDateString()
                : "No deadline set"}{" "}
              <span className="text-muted-foreground">(19 days more)</span>
            </p>
          </div>
        </div>

        {/* ======= Tags ======= */}
        <div className="flex items-start gap-3">
          <Tag size={18} className="text-muted-foreground mt-1" />
          <div>
            <p className="text-sm text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <Badge
                  key={tag.name}
                  className={`${tag.color} font-medium rounded-full px-2 py-1`}
                >
                  {tag.name}
                </Badge>
              ))}
              <button className="text-sm text-muted-foreground hover:underline">
                Add more...
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
