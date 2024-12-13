"use client";

import { Shield, HelpCircle, User } from "lucide-react";
import { type ReactNode } from "react";
import * as React from "react";
import { Frame } from "lucide-react";

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
  const { data: session } = useSession(); // Access session data
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

  // Loading spinner for no dictionary or no user session
  if (!dictionary || !user || pathname === `/${lang}/login`) {
    return null;
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
              name: dictionary.workspaces.workerWorkspace.projects.reportCardView,
              url: `/${lang}/worker/reportCardView`,
              icon: Frame,
            },
            {
              name: dictionary.workspaces.workerWorkspace.projects.reportEdit,
              url: `/${lang}/worker/reportEdit`,
              icon: Frame,
            },
          ],
        };

      case "user":
      default:
        return {
          navMain: [
            {
              title: dictionary.workspaces.userWorkspace.navItems.myReports.folderTitle,
              url: `/${lang}/user/myReports`,
              icon: User,
              isActive: true,
              items: [
                {
                  title: dictionary.workspaces.userWorkspace.navItems.myReports.reportState,
                  url: `/${lang}/reportState`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.myReports.closedReports,
                  url: `/${lang}/closedReports`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.myReports.myReports,
                  url: `/${lang}/myReports`,
                },
              ],
            },
            {
              title: dictionary.workspaces.userWorkspace.navItems.reportSomething.folderTitle,
              url: "#",
              icon: User,
              isActive: true,
              items: [
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.defectsDamages,
                  url: `/${lang}/defectsDamages`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.contaminations,
                  url: `/${lang}/contaminations`,
                },
                {
                  title: dictionary.workspaces.userWorkspace.navItems.reportSomething.parkingViolations,
                  url: `/${lang}/parkingViolations`,
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