export const instant = false;

import React from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSideBar"
import { Separator } from "@/components/ui/separator"
import {requireAuth} from "@/modules/auth/utils/authUtils"
import { DashboardBreadcrumb } from "@/components/DashboardBreadcrumb"

const DashboardLayout = async(
    { children }: { children: React.ReactNode }
) => {
    await requireAuth()
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-5 mt-5 self-center" />
                    <DashboardBreadcrumb/>
                </header>
                <main id="main-content" className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout