import * as React from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
import ProjectModol from "./ProjectModol";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTaskContext } from "@/TaskContext/TaskContext";
import { useUserContextId } from "@/AuthContext/UserContext";
import SidebarFooter from "./sidebar-footer";
import Loader from "./Loader";

const items = [{ title: "Home", url: "/home", icon: IoHomeOutline }];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userContextId } = useUserContextId();
  const { userData, projects, fetchUserProjects, deleteProject } =
    useTaskContext();
  const { setOpen, state } = useSidebar();

  React.useEffect(() => {
    if (userContextId) fetchUserProjects(userContextId);
  }, [userContextId]);

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      <Card className="flex items-center justify-center mt-2 ml-2 mr-2 px-1.5 py-1 bg-muted/40 rounded-lg ">
        <div
          className={`flex items-center ${
            state === "expanded" ? "gap-3" : "justify-center"
          } w-full`}
        >
          <Avatar className="h-6 w-6 ">
            <AvatarImage src={userData.avatar || ""} alt="profile pic" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>

          {state === "expanded" && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{userData.name}</span>
            </div>
          )}
        </div>
      </Card>
      <div className="md:hidden flex items-center justify-between p-2 border-b">
        <span className="font-semibold">Menu</span>
        <SidebarTrigger />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`flex ${
                    state === "expanded"
                      ? "flex-row"
                      : "flex-col items-center justify-center ml-2 "
                  } items-center`}
                >
                  <NavLink
                    to={item.url}
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {({ isActive }) => (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className={`flex items-center gap-3 px-2 py-1 rounded-md transition-colors ${
                          isActive
                            ? "bg-accent text-white"
                            : "hover:bg-sidebar-accent hover:text-foreground"
                        } `}
                      >
                        <item.icon
                          className="cursor-pointer"
                          size={22} // keep smaller size from dev for consistency
                        />
                        {state === "expanded" && (
                          <span
                            className="text-sm font-medium cursor-pointer"
                            onClick={() => setOpen(false)} // keep main branch behavior
                          >
                            {item.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <Separator className="my-3" />

            <div
              className={`flex items-center ${
                state === "expanded"
                  ? "justify-between px-0.5"
                  : "justify-center flex-col"
              }`}
            >
              {state === "expanded" ? (
                <>
                  <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wide">
                    Projects
                  </SidebarGroupLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="p-1 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                        title="Add Project"
                      >
                        <AiOutlinePlus size={18} />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ProjectModol />
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                      title="Add Project"
                    >
                      <AiOutlinePlus size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <ProjectModol />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Project list */}
            <SidebarMenu>
              {projects.length > 0 ? (
                projects.reverse().map((project) => (
                  <SidebarMenuItem
                    key={project.id}
                    className={`flex items-center justify-between ${
                      state === "expanded"
                        ? "flex-row"
                        : "flex-col w-full justify-center text-lg"
                    }`}
                  >
                    <NavLink
                      to={`/projects/${project.id}`}
                      className="flex-1"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      {({ isActive }) => (
                        <SidebarMenuButton
                          tooltip={
                            project?.title.charAt(0).toUpperCase() +
                            project?.title.slice(1)
                          }
                          isActive={isActive}
                          className={`flex items-center ${
                            state === "expanded"
                              ? "gap-2 px-2 py-1"
                              : "flex-col gap-1 p-1 justify-center"
                          } rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-white"
                              : "hover:bg-sidebar-accent hover:text-foreground"
                          }`}
                        >
                          <span className="text-sm font-medium">
                            {state === "collapsed"
                              ? project.title.toUpperCase()[0] +
                                project.title.slice(-1)
                              : project?.title.charAt(0).toUpperCase() +
                                project?.title.slice(1)}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>

                    {state === "expanded" && (
                      <button
                        onClick={() => deleteProject(project.id!)}
                        className="p-1 ml-1 text-muted-foreground hover:bg-red-500 hover:text-white rounded"
                      >
                        <AiOutlineDelete size={16} />
                      </button>
                    )}
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {state === "expanded" && projects.length > 0 ? (
                    <span>No projects found.</span>
                  ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                      <span>No projects</span>
                      <span>Add a project</span>
                    </div>
                  ) : (
                    <Loader />
                  )}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter state={state} setopen={setOpen} />
    </Sidebar>
  );
}
