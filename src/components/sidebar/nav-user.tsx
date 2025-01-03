"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { ModeToggle } from "@/components/modeToggle"
import { LanguageSwitcher } from "@/components/language-switcher"

import { useDictionary } from "@/components/provider/dictionaryProvider"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavUser() {
  const { isMobile, state } = useSidebar()
  const user = useSession().data?.user
  const { dictionary } = useDictionary()
  const params = useParams()
  const lang = params.lang as string

  if (!user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200",
            !isMobile && state === "collapsed" && "scale-90 -ml-1"
          )}>
            <ModeToggle />
          </div>

          {(state === "expanded" || isMobile) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-10"
                >
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>

                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={`/${lang}/account`} className="flex items-center">
                      <BadgeCheck className="mr-2 text-primary" />
                      {dictionary?.layout?.navigation?.userToggle?.account}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer"
                  >
                    {dictionary && <LanguageSwitcher {...dictionary} />}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/api/auth/signin' })}
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                >
                  <LogOut className="mr-2" />
                  {dictionary?.layout?.navigation?.userToggle?.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}