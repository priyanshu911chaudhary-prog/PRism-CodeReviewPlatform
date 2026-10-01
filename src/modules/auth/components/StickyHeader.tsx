"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LoginThemeToggle } from "@/components/LoginThemeToggle";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { LogoHorizontal } from "@/components/Logo";
export default function StickyHeader() {
    const handleScrollToSignIn = () => {
        const element = document.getElementById("sign-in");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LogoHorizontal className="h-7 w-auto text-foreground" />
                </div>
                
                <div className="flex items-center gap-4">
                    <LoginThemeToggle />
                    <Button variant="outline" size="sm" onClick={handleScrollToSignIn}>
                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                            <GithubLight className="h-full w-full dark:hidden" />
                            <GithubDark className="h-full w-full hidden dark:block" />
                        </div>
                        <span className="hidden sm:inline">Sign in with GitHub</span>
                        <span className="sm:hidden">Sign in</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
