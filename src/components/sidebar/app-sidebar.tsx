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
import { type Locale } from "@/i18n-config";

import { useDictionary } from "@/components/provider/dictionaryProvider";
import { Button } from "../ui/button";

export interface Workspace {
  workspaceType: string; // Worker, User, or Admin
  name: string; // The name of the workspace
  icon: ReactNode; // The icon associated with the workspace
}

export function AppSidebar({
  params,
  ...props
}: {
  params: { lang: Locale };
} & React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession(); // Add status from useSession
  const user = session?.user;

  const { lang } = params;
  const { dictionary } = useDictionary();


  // Get the current pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // Initialize workspaces based on the user's role
  const workspaces = React.useMemo((): Workspace[] =>
    user?.role === "admin"
      ? [
        {
          name: dictionary?.workspaces.adminWorkspace.adminWorkspaceTitle ?? "Admin Workspace",
          icon: <Shield />,
          workspaceType: "admin",
        },
        {
          name: dictionary?.workspaces.workerWorkspace.workerWorkspaceTitle ?? "Worker Workspace",
          icon: <HelpCircle />,
          workspaceType: "worker",
        },
        {
          name: dictionary?.workspaces.userWorkspace.userWorkspaceTitle ?? "Default Workspace Title",
          icon: <User />,
          workspaceType: "user",
        },
      ]
      : user?.role === "worker"
        ? [
          {
            name: dictionary?.workspaces.workerWorkspace.workerWorkspaceTitle ?? "Worker Workspace",
            icon: <HelpCircle />,
            workspaceType: "worker",
          },
          {
            name: dictionary?.workspaces.userWorkspace.userWorkspaceTitle ?? "User Workspace",
            icon: <User />,
            workspaceType: "user",
          },
        ]
        : [
          {
            name: dictionary?.workspaces.userWorkspace.userWorkspaceTitle ?? "Default Workspace Title",
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
  }, [pathname, user?.role]);

  if (!dictionary || status === "loading") {
    return <SidebarSkeleton />;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">
      <Sidebar>
        <SidebarHeader className="flex justify-center items-center h-screen">
          <Button>{dictionary?.auth.login.title}</Button>
        </SidebarHeader>
      </Sidebar>
    </div>;
  }


  // Define navigation data based on the active workspace
  const data = (() => {
    switch (activeWorkspace.workspaceType) {
      case "admin":
        return {
          navMain: [],
          projects: [
            {
              name: dictionary.workspaces.adminWorkspace.projects.userAdministration,
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
              name: dictionary.workspaces.workerWorkspace.projects.reportMapView,
              url: `/${lang}/worker/report/MapView`,
              icon: Frame,
            },
            {
              name: dictionary.workspaces.workerWorkspace.projects.reportTableView,
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
              title: dictionary.workspaces.userWorkspace.navItems.myReports.myReports,
              url: `/${lang}/myReports`,
              icon: FileText,
            },
            {
              title: dictionary.workspaces.userWorkspace.navItems.reportSomething.folderTitle,
              url: "#",
              icon: FolderPlus,
              isActive: true,
              items: [
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.defectsDamages,
                  url: `/${lang}/report/defects-damage`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.contaminations,
                  url: `/${lang}/report/contamination`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.parkingViolations,
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
        {data.navMain && data.navMain.length > 0 && <NavMain items={data.navMain} />}
        {data.projects && data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}