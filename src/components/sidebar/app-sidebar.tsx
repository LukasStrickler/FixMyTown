"use client";

import { Shield, HelpCircle, User, FileText, FolderPlus } from "lucide-react";
import { type ReactNode } from "react";
import * as React from "react";
import { Frame } from "lucide-react";
import { SidebarSkeleton } from "./sidebar-skeleton";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { WorkplaceSwitcher } from "@/components/sidebar/workplace-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";

import { useDictionary } from "@/components/provider/dictionaryProvider";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";

import { ModeToggle } from "@/components/modeToggle"
import { LanguageSwitcher } from "@/components/language-switcher"



export interface Workspace {
  workspaceType: string; // Worker, User, or Admin
  name: string; // The name of the workspace
  icon: ReactNode; // The icon associated with the workspace
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession(); // Add status from useSession
  const user = session?.user;
  const { dictionary } = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  // Get the current pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Initialize workspaces based on the user's role
  const workspaces = React.useMemo((): Workspace[] =>
    user?.role === "admin"
      ? [
        {
          name: dictionary?.layout?.navigation?.workspaces?.adminWorkspace?.adminWorkspaceTitle ?? "Admin Workspace",
          icon: <Shield />,
          workspaceType: "admin",
        },
        {
          name: dictionary?.layout?.navigation?.workspaces?.workerWorkspace?.workerWorkspaceTitle ?? "Worker Workspace",
          icon: <HelpCircle />,
          workspaceType: "worker",
        },
        {
          name: dictionary?.layout?.navigation?.workspaces?.userWorkspace?.userWorkspaceTitle ?? "Default Workspace Title",
          icon: <User />,
          workspaceType: "user",
        },
      ]
      : user?.role === "worker"
        ? [
          {
            name: dictionary?.layout?.navigation?.workspaces?.workerWorkspace?.workerWorkspaceTitle ?? "Worker Workspace",
            icon: <HelpCircle />,
            workspaceType: "worker",
          },
          {
            name: dictionary?.layout?.navigation?.workspaces?.userWorkspace?.userWorkspaceTitle ?? "User Workspace",
            icon: <User />,
            workspaceType: "user",
          },
        ]
        : [
          {
            name: dictionary?.layout?.navigation?.workspaces?.userWorkspace?.userWorkspaceTitle ?? "Default Workspace Title",
            icon: <User />,
            workspaceType: "user",
          },
        ],
    [user?.role, dictionary]
  );

  // Determine initial workspace based on URL path
  const getInitialWorkspace = (): Workspace => {
    if (pathname.includes('/worker') && ['admin', 'worker'].includes(user?.role ?? '')) {
      const workerWorkspace = workspaces.find(w => w.workspaceType === 'worker');
      if (workerWorkspace) return workerWorkspace;
    }
    if (pathname.includes('/admin') && user?.role === 'admin') {
      const adminWorkspace = workspaces.find(w => w.workspaceType === 'admin');
      if (adminWorkspace) return adminWorkspace;
    }
    return workspaces.find(w => w.workspaceType === 'user') ?? workspaces[0]!;
  };

  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace>(() => getInitialWorkspace());

  React.useEffect(() => {
    setActiveWorkspace(getInitialWorkspace());
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, user?.role]);

  if (!dictionary || status === "loading") {
    return <SidebarSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-sidebar">
        <Sidebar className="shadow-lg rounded-lg bg-card bg-sidebar">
          <SidebarHeader className="flex justify-center items-center h-screen bg-card-foreground rounded-t-lg bg-sidebar">
            <Button onClick={() => window.location.href = `/${lang}/login`} className="text-lg">
              {dictionary.pages.auth.login.title}
            </Button>
          </SidebarHeader>
          <div className="space-y-4 p-4 flex flex-col items-center bg-sidebar">
            <div className="flex items-center space-x-4">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200">
                <ModeToggle />
              </div>
              {dictionary && <LanguageSwitcher {...dictionary} />}
            </div>
          </div>
        </Sidebar>
      </div>
    );
  }


  // Define navigation data based on the active workspace
  const data = (() => {
    switch (activeWorkspace.workspaceType) {
      case "admin":
        return {
          navMain: [],
          projects: [
            {
              name: dictionary.layout.navigation.workspaces.adminWorkspace.projects.userAdministration,
              url: `/${lang}/admin/userAdministration`,
              icon: Frame,
            },
          ],
        };

      case "worker":
        return {
          navMain: [],
          projects: [
            {
              name: dictionary.layout.navigation.workspaces.workerWorkspace.projects.reportMapView,
              url: `/${lang}/worker/report/MapView`,
              icon: Frame,
            },
            {
              name: dictionary.layout.navigation.workspaces.workerWorkspace.projects.reportTableView,
              url: `/${lang}/worker/report/TableView`,
              icon: Frame,
            },
          ],
        };

      case "user":
      default:
        return {
          navMain: [
            {
              title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.myReports.myReports,
              url: `/${lang}/myReports`,
              icon: FileText,
            },
            {
              title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.reportSomething.folderTitle,
              url: `/${lang}/report/defects-damage`,
              icon: FolderPlus,
              isActive: true,
              items: [
                {
                  title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.reportSomething.defectsDamages,
                  url: `/${lang}/report/defects-damage`,
                },
                {
                  title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.reportSomething.contaminations,
                  url: `/${lang}/report/contamination`,
                },
                {
                  title: dictionary.layout.navigation.workspaces.userWorkspace.navItems.reportSomething.parkingViolations,
                  url: `/${lang}/report/parking-violation`,
                },
              ],
            },
          ],
          projects: [],
        };
    }
  })();

  // Render sidebar if user is logged in
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkplaceSwitcher
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          workspaces={workspaces}
        />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain && data.navMain.length > 0 && <NavMain items={data.navMain} dictionary={dictionary} />}
        {data.projects && data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}