import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import LayoutFooter from "@/components/LayoutFooter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex items-center justify-between border-b px-4 py-2 shadow-sm 
             transition-all duration-200 ease-linear lg:hidden"
        >
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-5"
            />
            <Breadcrumb className="text-sm font-semibold tracking-wide ">
              ProjectFlow
            </Breadcrumb>
          </div>
          <Avatar className="cursor-pointer transition-transform duration-200 hover:scale-105 ">
            <AvatarImage
              src="/todo-list-svgrepo-com.svg"
              alt="User Avatar"
              className="h-8 w-8 p-1"
            />
            <AvatarFallback className="text-[13px] font-medium ">
              U
            </AvatarFallback>
          </Avatar>
        </header>

        <div className=" h-full w-full  bg-background text-foreground">
          <Outlet />
        </div>
        <Separator />
        <LayoutFooter />
      </SidebarInset>
    </SidebarProvider>
  );
};
export default Layout;
