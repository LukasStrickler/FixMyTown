"use client"

import { Shield, HelpCircle, User } from "lucide-react"

import { type ReactNode } from "react"; 
import * as React from "react"
import {
  Bot,
  Frame,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"
import { WorkplaceSwitcher } from "@/components/sidebar/workplace-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react";
import { type Locale } from "@/i18n-config";

export interface Workspace {
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
  const { data: session } = useSession(); // Access session data
  const user = session?.user;

  // Initialize workspaces based on the user's role
  const workspaces: Workspace[] =
    user?.role === "ADMIN"
      ? [
          { name: "Admin Workspace", icon: <Shield /> },
          { name: "Worker Workspace", icon: <HelpCircle /> },
          { name: "User Workspace", icon: <User /> },
        ]
      : user?.role === "WORKER"
      ? [
          { name: "Support Workspace", icon: <HelpCircle /> },
        ]
      : [
          { name: "User Workspace", icon: <User /> },
        ];

  // Set the default workspace to "User Workspace"
  const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace>(
    { name: "User Workspace", icon: <User /> }
  );

  // If no user session, don't render the sidebar
  if (!session?.user) {
    return null;
  }

  // Define navigation data based on the active workspace
  const data = (() => {
    switch (activeWorkspace.name) {
      case "Admin Workspace":
        return {
          navMain: [
            {
              title: "Admin Dashboard",
              url: "#",
              icon: SquareTerminal,
              isActive: true,
              items: [
                { title: "User Management", url: "#" },
                { title: "Settings", url: "#" },
                { title: "Reports", url: "#" },
              ],
            },
            {
              title: "Admin Tools",
              url: "#",
              icon: Bot,
              items: [
                { title: "Genesis", url: "#" },
                { title: "Explorer", url: "#" },
              ],
            },
          ],
          projects: [
            { name: "Admin Project 1", url: "#", icon: Frame },
            { name: "Admin Project 2", url: "#", icon: Frame },
          ],
        };

      case "Worker Workspace":
        return {
          navMain: [
            {
              title: "Worker Tools",
              url: "#",
              icon: HelpCircle,
              isActive: true,
              items: [
                { title: "Support Tickets", url: "#" },
                { title: "Knowledge Base", url: "#" },
              ],
            },
          ],
          projects: [
            { name: "Worker Project 1", url: "#", icon: Frame },
          ],
        };

      case "User Workspace":
      default:
        return {
          navMain: [
            {
              title: "User Portal",
              url: "#",
              icon: User,
              isActive: true,
              items: [
                { title: "Profile", url: "#" },
                { title: "Settings", url: "#" },
              ],
            },
          ],
          projects: [
            { name: "User Project 1", url: "#", icon: Frame },
          ],
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
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
