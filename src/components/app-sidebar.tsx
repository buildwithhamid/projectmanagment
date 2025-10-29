import * as React from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Bot, FolderOpen } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
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
import { useTaskContext } from "@/TaskContext/TaskContext";
import SidebarFooter from "./sidebar-footer";
import Loader from "./Loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, deleteProject, loading } = useTaskContext();
  const { setOpen, state } = useSidebar();
  const [hovered, setHovered] = React.useState(false);
  const items = [
    { title: "Home", url: ".", icon: IoHomeOutline },
    { title: "Assign Projects", url: "assign-projects", icon: FolderOpen },
    { title: "Ai Talk", url: "ai-talk", icon: Bot },
  ];
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      <div className="md:hidden flex items-center justify-between px-5 pt-2 -mb-2">
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
                <Avatar className="hidden md:flex cursor-pointer transition-transform hover:scale-105">
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
                <SidebarTrigger
                  className="transition-all duration-200 scale-110 cursor-pointer"
                  onClick={() => setHovered(false)}
                />
              )}
            </div>
          ) : (
            <>
              <Avatar className=" cursor-pointer">
                <AvatarImage
                  src="/todo-list-svgrepo-com.svg"
                  alt="User Avatar"
                  className=" h-8 w-8 p-1"
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
                        <span
                          className=" md:hidden text-[14px] font-medium cursor-pointer"
                          onClick={() => setOpen(false)}
                        >
                          {item.title}
                        </span>
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
                  <SidebarGroupLabel className="hidden md:flex text-[12px] gap-1 uppercase text-muted-foreground tracking-wide font-semibold">
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
                <div className=" w-full  px-2 flex justify-between items-center gap-1">
                  <SidebarGroupLabel className="flex md:hidden text-[12px] uppercase text-muted-foreground tracking-wide font-semibold">
                    Projects
                  </SidebarGroupLabel>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className=" p-1.5 rounded hover:bg-sidebar-accent inline-flex items-center justify-center"
                        title="Add Project"
                      >
                        <AiOutlinePlus size={17} />
                      </button>
                    </DialogTrigger>
                    <ProjectModol />
                  </Dialog>
                </div>
              )}
            </div>
            <ScrollArea className="h-64">
              <SidebarMenu>
                {projects.length > 0 ? (
                  [...projects]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )

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
                          to={`projects/${project.id}`}
                          className="flex-1 hidden md:flex "
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
                              <span className=" text-[14px] flex gap-2 font-medium truncate max-w-[120px]">
                                {state === "collapsed"
                                  ? project.title.toUpperCase()[0] +
                                    project.title.slice(-1)
                                  : project.title.charAt(0).toUpperCase() +
                                    project.title.slice(1)}
                              </span>
                            </SidebarMenuButton>
                          )}
                        </NavLink>
                        {/* Mobile Project Item (with Delete Button) */}
                        <div className="flex items-center justify-between w-full md:hidden px-2 py-0.5 rounded-lg hover:bg-sidebar-accent transition-colors duration-200">
                          <NavLink
                            to={`projects/${project.id}`}
                            className="flex-1"
                            onClick={() => setOpen(false)}
                          >
                            {({ isActive }) => (
                              <SidebarMenuButton
                                tooltip={
                                  project?.title.charAt(0).toUpperCase() +
                                  project?.title.slice(1)
                                }
                                isActive={isActive}
                                className={`flex items-center justify-start gap-2 w-full rounded-md transition-colors duration-200
          ${
            isActive
              ? "bg-primary text-white"
              : "hover:bg-sidebar-accent hover:text-foreground"
          }
          px-3 py-2 text-[14px] font-medium truncate max-w-[180px]
        `}
                              >
                                <span>
                                  {project.title.charAt(0).toUpperCase() +
                                    project.title.slice(1)}
                                </span>
                              </SidebarMenuButton>
                            )}
                          </NavLink>

                          {/* Delete button */}
                          <button
                            onClick={() => deleteProject(project.id!)}
                            className="p-2 text-muted-foreground hover:bg-red-500 hover:text-white rounded-md transition"
                          >
                            <AiOutlineDelete size={16} />
                          </button>
                        </div>
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
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter state={state} setopen={setOpen} />
    </Sidebar>
  );
}
