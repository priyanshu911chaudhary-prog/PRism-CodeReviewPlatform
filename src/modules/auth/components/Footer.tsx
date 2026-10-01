import React from "react";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { Separator } from "@/components/ui/separator";
import { LogoHorizontal } from "@/components/Logo";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-background/50 py-8">
            <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity" aria-label="GitHub Repository">
                        <div className="h-5 w-5">
                            <GithubLight className="h-full w-full dark:hidden" />
                            <GithubDark className="h-full w-full hidden dark:block" />
                        </div>
                    </a>
                    <span className="hidden md:flex items-center gap-1">© {new Date().getFullYear()} <LogoHorizontal className="h-3.5 w-auto" /></span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span>Built with Next.js, shadcn/ui.</span>
                </div>
                
                <span className="md:hidden flex items-center gap-1 justify-center">© {new Date().getFullYear()} <LogoHorizontal className="h-3.5 w-auto" /></span>
            </div>
        </footer>
    );
}
