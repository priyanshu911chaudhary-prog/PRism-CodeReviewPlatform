import React from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/appSideBar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ThemeToggle"
import Logout from "@/modules/auth/components/Logout"
import { LogOut } from "lucide-react"
import {requireAuth} from "@/modules/auth/utils/authUtils"
import { Blobatar } from "@/components/ui/blobatar"

const DashboardLayout = async(
    { children }: { children: React.ReactNode }
) => {
    const session = await requireAuth()
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <h1 className="text-sm font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Blobatar 
                            name={session.user.name || session.user.email || "User"} 
                            className="h-8 w-8 rounded-full" 
                        />
                        <ThemeToggle />
                        <Logout variant="ghost" size="icon" className="h-8 w-8 px-0 text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="size-4" />
                            <span className="sr-only">Logout</span>
                        </Logout>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout