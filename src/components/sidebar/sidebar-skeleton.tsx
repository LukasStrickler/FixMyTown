import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-5 ml-8" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="space-y-4 p-4">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                    </div>

                    <div className="space-y-3">
                        <Skeleton className="h-6 w-36" />
                        <div className="ml-4 space-y-2">
                            <Skeleton className="h-5 w-44" />
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-36" />
                        </div>
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-5 ml-auto" />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
