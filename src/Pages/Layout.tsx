import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Separator } from "../components/ui/separator";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import LayoutFooter from "@/components/LayoutFooter";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          className="flex h-10 shrink-0 items-center gap-2 border-b text-foreground transition-[width,height] ease-linear 
                   group-has-data-[collapsible=icon]/sidebar-wrapper:h-10 
                   lg:hidden"
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>Project Manager</Breadcrumb>
          </div>
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
