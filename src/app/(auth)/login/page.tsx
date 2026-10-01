export const instant = false;

import { Metadata } from "next";
import { requireUnAuth } from "@/modules/auth/utils/authUtils";
import LoginPage from "@/modules/auth/components/LoginPage";

export const metadata: Metadata = {
    title: "PRism — Code review that fixes what it finds",
    description: "PRism analyzes pull requests, classifies findings as introduced or pre-existing, validates fixes in isolation, and commits them atomically. Sign in with GitHub to get started.",
    openGraph: {
        title: "PRism — Code review that fixes what it finds",
        description: "Automated PR review with validated, atomic fixes.",
        type: "website",
    },
};

export default async function LoginRoute() {
    await requireUnAuth();
    
    return (
        <main id="main-content" className="bg-background min-h-screen">
            <LoginPage />
        </main>
    );
}
