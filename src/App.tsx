import { useState, useEffect } from "react";
import { setupHostVerification } from "./security/hostVerification";
import "./App.css";
import {
  SidebarInset,
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStore } from "./store";
import { injectStyles } from "./utils/injectStyles";
import { FilterGroups } from "./components/Table/filter";

injectStyles();

function MainContent() {
  const [isAuthorized] = useState<boolean>(true);

  const { isLoading } = useStore();

  // Setup host verification (only in production)
  useEffect(() => {
    const isProd = import.meta.env.PROD;
    if (isProd) {
      setupHostVerification();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If auth fails, this component won't render properly anyway
  // But we add this check as an additional layer of protection
  if (!isAuthorized) {
    return <div>Unauthorized Access</div>;
  }
  // Handle clear all filters

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="px-4  py-4">
          <DndProvider backend={HTML5Backend}>
            <Outlet />
            <TanStackRouterDevtools />
          </DndProvider>
        </div>

        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"
          integrity="sha512-dlPw+ytv/6JyepmelABrgeYgHI0O+frEwgfnPdXDTOIZz+eDgfW07QXG02/O8COfivBdGNINy+Vex+lYmJ5rxw=="
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <Link to="/">
          <span>Hello</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <FilterGroups />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default function App() {
  return <MainContent />;
}
