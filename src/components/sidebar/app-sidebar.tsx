"use client";

import { Shield, HelpCircle, User } from "lucide-react";
import { type ReactNode } from "react";
import * as React from "react";
import {
  Frame
} from "lucide-react";

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
  workspaceType: string; //Worker, User, or Admin
  name: string;         // The name of the workspace
  icon: ReactNode;     // The icon associated with the workspace
}

export function AppSidebar({
  params,
  ...props
}: {
  params: { lang: Locale };
} & React.ComponentProps<typeof Sidebar>) {

  const { lang } = params;
  const { dictionary } = useDictionary();
  //TODO Loading spinner for no dict
  if (!dictionary) return null;

  const { data: session } = useSession(); // Access session data
  const user = session?.user;

  // Initialize workspaces based on the user's role
  const workspaces: Workspace[] =
    user?.role === "admin"
      ? [
        { name: dictionary.workspaces.adminWorkspace.adminWorkspaceTitle, icon: <Shield />, workspaceType: "admin" },
        { name: dictionary.workspaces.workerWorkspace.workerWorkspaceTitle, icon: <HelpCircle />, workspaceType: "worker" },
        { name: dictionary.workspaces.userWorkspace.userWorkspaceTitle, icon: <User />, workspaceType: "user" },
      ]
      : user?.role === "worker"
        ? [
          { name: dictionary.workspaces.workerWorkspace.workerWorkspaceTitle, icon: <HelpCircle />, workspaceType: "worker"},
          { name: dictionary.workspaces.userWorkspace.userWorkspaceTitle, icon: <User />, workspaceType: "user" },
        ]
        : [
          { name: dictionary.workspaces.userWorkspace.userWorkspaceTitle, icon: <User />, workspaceType: "user" },
        ];

  // Set the default workspace to "User Workspace"
  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace>(
    { name: dictionary.workspaces.userWorkspace.userWorkspaceTitle, icon: <User />, workspaceType: "user" },
  );

  // If no user session, don't render the sidebar
  if (!session?.user) {
    return null;
  }

  // Define navigation data based on the active workspace
  const data = (() => {
    switch (activeWorkspace.workspaceType) {
      case "admin":
        return {
          navMain: [],
          projects: [
            { name: "Nutzerverwaltung", url: `/${lang}/admin/userAdministration`, icon: Frame },
          ],
        };

      case "worker":
        return {
          navMain: [],
          projects: [
            { name: "Anträge Kartenansicht", url: `/${lang}/worker/reportCardView`, icon: Frame},
            { name: "Anträge Bearbeiten", url: `/${lang}/worker/reportEdit`, icon: Frame},
          ],
        };

      case "user":
      default:
        return {
          navMain: [
            {
              title: "Meine Meldungen",
              url: `/${lang}/user/myReports`,
              icon: User,
              isActive: true,
              items: [
                { title: "Status Anträge", url: `/${lang}/reportState` },
                { title: "Abgeschlossene Anmeldungen", url: `/${lang}/closedReports` },
                { title: "Meine Anträge", url: `/${lang}/myReports` },
              ],
            },
            {
              title: "Vorfall melden",
              url: "#",
              icon: User,
              isActive: true,
              items: [
                { title: "Defekte und Schäden", url: `/${lang}/defectsDamages` },
                { title: "Verunreinigungen", url: `/${lang}/contaminations` },
                { title: "Parkverstöße", url: `/${lang}/parkingViolations` },
              ],
            }
          ],
          projects: [],
        };
    }
  })();

  // Render sidebar if user is logged in
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkplaceSwitcher activeWorkspace={activeWorkspace} setActiveWorkspace={setActiveWorkspace} workspaces={workspaces} />
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
