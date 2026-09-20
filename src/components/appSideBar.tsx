"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Settings, Code2, MessageSquare, CreditCard } from "lucide-react"
import { useTheme } from "next-themes"
import { authClient } from "@/lib/authClient"

import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

import { Blobatar } from "@/components/ui/blobatar"



export const AppSidebar = () => {
    const { useSession } = authClient
    const { data: session } = useSession()

    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const pathName = usePathname()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    const navigationItems = [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: BookOpen,
        },
        {
            title: "Repository",
            url: "/dashboard/repository",
            icon: Code2,
        },
        {
            title: "Reviews",
            url: "/dashboard/reviews",
            icon: MessageSquare,
        },
        {
            title: "Subscription",
            url: "/dashboard/subscription",
            icon: CreditCard,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
        },
    ]

    const isActive = (url: string) => {
        return pathName === url || (url !== "/dashboard" && pathName.startsWith(url))
    }

    if (!mounted || !session) return null

    const user = session.user
    const userName = user.name || "Guest"
    const userEmail = user.email || ""


    return (
        <Sidebar variant="sidebar" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                                    {theme === "dark" ? <GithubDark className="size-4" /> : <GithubLight className="size-4" />}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">PRism</span>
                                    <span className="truncate text-xs">Code Review Platform</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={isActive(item.url)}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4 shrink-0" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                            <Blobatar 
                                name={userName || userEmail || "User"} 
                                className="h-8 w-8 rounded-lg shrink-0"
                            />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{userName}</span>
                                <span className="truncate text-xs text-sidebar-foreground/70">{userEmail}</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}