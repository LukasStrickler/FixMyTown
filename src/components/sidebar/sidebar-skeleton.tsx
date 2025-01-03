import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-8 w-8 rounded-full bg-sidebar-accent" />
                    <Skeleton className="h-5 w-32 bg-sidebar-accent" />
                    <Skeleton className="h-5 w-5 ml-8 bg-sidebar-accent" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="space-y-4 p-4">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40 bg-sidebar-accent" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-6 w-36 bg-sidebar-accent" />
                        <div className="ml-4 space-y-2">
                            <Skeleton className="h-5 w-44 bg-sidebar-accent" />
                            <Skeleton className="h-5 w-40 bg-sidebar-accent" />
                            <Skeleton className="h-5 w-36 bg-sidebar-accent" />
                        </div>
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-8 w-8 bg-sidebar-accent" />
                    <Skeleton className="h-5 w-32 bg-sidebar-accent" />
                    <Skeleton className="h-5 w-5 ml-auto bg-sidebar-accent" />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
