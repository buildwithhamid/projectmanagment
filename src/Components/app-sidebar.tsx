import * as React from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Bot } from "lucide-react";
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useTaskContext } from "@/TaskContext/TaskContext";
import SidebarFooter from "./sidebar-footer";
import Loader from "./Loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, deleteProject, loading } = useTaskContext();
  const { setOpen, state } = useSidebar();
  const [hovered, setHovered] = React.useState(false);
  const items = [
    { title: "Home", url: "/home", icon: IoHomeOutline },
    { title: "Ai Talk", url: "/ai-talk", icon: Bot },
  ];
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      <div className="md:hidden flex items-center justify-between p-2">
        <span className="font-semibold text-base tracking-tight">Menu</span>
        <SidebarTrigger className="scale-90" />
      </div>

      <div
        className={`flex items-center ${
          state === "collapsed"
            ? "justify-center px-1 pt-3 pb-1"
            : "justify-between pl-3 pr-2 pt-3 pb-1"
        } w-full`}
      >
        <div
          className={`flex items-center gap-1 ${
            state === "collapsed" ? "justify-center" : ""
          }`}
        >
          {state === "collapsed" ? (
            <div
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {!hovered ? (
                <Avatar className="cursor-pointer transition-transform hover:scale-105">
                  <AvatarImage
                    src="/todo-list-svgrepo-com.svg"
                    alt="User Avatar"
                    className="h-8 w-8 p-1"
                  />
                  <AvatarFallback className="text-[13px] font-medium">
                    U
                  </AvatarFallback>
                </Avatar>
              ) : (
                <SidebarTrigger className="transition-all duration-200 scale-110 cursor-pointer" />
              )}
            </div>
          ) : (
            <>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src="/todo-list-svgrepo-com.svg"
                  alt="User Avatar"
                  className="h-8 w-8 p-1"
                />
                <AvatarFallback className="text-[13px] font-medium">
                  U
                </AvatarFallback>
              </Avatar>

              <span className="text-[13px] font-semibold tracking-wide text-foreground">
                Project Manager
              </span>
            </>
          )}
        </div>

        {state === "expanded" && <SidebarTrigger className="scale-100" />}
      </div>

      {/* Sidebar Content */}
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
                        className={`flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors ${
                          isActive
                            ? "bg-accent text-white"
                            : "hover:bg-sidebar-accent hover:text-foreground"
                        } `}
                      >
                        <item.icon
                          className="cursor-pointer"
                          size={20} // refined icon size for consistency
                        />
                        {state === "expanded" && (
                          <span
                            className="text-[14px] font-medium cursor-pointer"
                            onClick={() => setOpen(false)}
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

            {/* Projects Section */}
            <div
              className={`flex items-center ${
                state === "expanded"
                  ? "justify-between px-0.5"
                  : "justify-center flex-col"
              }`}
            >
              {state === "expanded" ? (
                <>
                  <SidebarGroupLabel className="text-[12px] uppercase text-muted-foreground tracking-wide font-semibold">
                    Projects
                  </SidebarGroupLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="p-1.5 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                        title="Add Project"
                      >
                        <AiOutlinePlus size={17} />
                      </button>
                    </DialogTrigger>
                    <ProjectModol />
                  </Dialog>
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1.5 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                      title="Add Project"
                    >
                      <AiOutlinePlus size={17} />
                    </button>
                  </DialogTrigger>
                  <ProjectModol />
                </Dialog>
              )}
            </div>

            {/* Project List */}
            <SidebarMenu>
              {projects.length > 0 ? (
                projects
                  .slice()
                  .reverse()
                  .map((project) => (
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
                                ? "gap-2 px-2 py-1.5"
                                : "flex-col gap-1 p-1 justify-center"
                            } rounded-md transition-colors ${
                              isActive
                                ? "bg-primary text-white"
                                : "hover:bg-sidebar-accent hover:text-foreground"
                            }`}
                          >
                            <span className="text-[13px] font-medium truncate max-w-[120px]">
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
                          className="p-1 ml-1 text-muted-foreground hover:bg-red-500 hover:text-white rounded transition"
                        >
                          <AiOutlineDelete size={15} />
                        </button>
                      )}
                    </SidebarMenuItem>
                  ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground flex flex-col items-center justify-center">
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      {state === "expanded" && (
                        <>
                          <span className="text-[13px] font-medium">
                            No projects
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            Add a project
                          </span>
                        </>
                      )}
                    </>
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
