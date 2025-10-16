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
} from "@/components/ui/sidebar";
import { useTaskContext } from "@/TaskContext/TaskContext";
import SidebarFooter from "./sidebar-footer";
import Loader from "./Loader";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
const items = [
  { title: "Home", url: "/home", icon: IoHomeOutline },
  { title: "Ai Talk", url: "/ai-talk", icon: Bot },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, deleteProject, loading } = useTaskContext();
  const { setOpen, state } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="flex flex-col h-full bg-sidebar"
    >
      <div className="md:hidden flex items-center justify-between p-2 border-b">
        <span className="font-semibold">Menu</span>
        <SidebarTrigger />
      </div>
      <div className="relative pt-2  flex items-center justify-center">
        <Avatar className="cursor-pointer">
          <AvatarImage
            src="/todo-list-svgrepo-com.svg"
            alt="User Avatar"
            className=" ml-1 h-6 w-6"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
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

                    <ProjectModol />
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

                  <ProjectModol />
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
                <div className="px-3 py-2 text-sm text-muted-foreground flex flex-col items-center justify-center">
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      {state === "expanded" ? (
                        <>
                          <span>No projects</span>
                          <span>Add a project</span>
                        </>
                      ) : null}
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
