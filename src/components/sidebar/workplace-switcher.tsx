"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  //DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react"
import { type Workspace } from "./app-sidebar"

export function WorkplaceSwitcher({
  activeWorkspace,
  setActiveWorkspace,
  workspaces,
}: {
  activeWorkspace: Workspace;
  setActiveWorkspace: React.Dispatch<React.SetStateAction<Workspace>>;
  workspaces: Workspace[];
}) {
  const { isMobile } = useSidebar();
  const { data: session } = useSession(); // Grab session from useSession
  const user = session?.user; // Get the user object from session

  // Set the active workspace to the first workspace in the list

  if (!user || user.role === "user") {
    // Show nothing or a loading spinner if user data hasn't loaded yet
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* Render active workspace icon */}
                {activeWorkspace?.icon}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {activeWorkspace && (
                  <>
                    <span className="truncate font-semibold">
                      {activeWorkspace.name}
                    </span>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* Render workspace icon */}
                  {workspace.icon}
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}