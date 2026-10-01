import React from "react";
import { GitCommit, RefreshCw, GitPullRequest } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function MockCommitLoop() {
    return (
        <Card className="w-full max-w-sm p-6 shadow-sm">
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-foreground font-medium bg-muted/50 px-4 py-2 rounded-full text-sm">
                    <GitCommit className="w-4 h-4 text-primary" />
                    <span>1 commit applied</span>
                </div>
                
                <div className="flex flex-col items-center text-muted-foreground">
                    <div className="h-6 w-px bg-border mb-2" />
                    <RefreshCw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                    <div className="h-6 w-px bg-border mt-2" />
                </div>
                
                <div className="flex items-center gap-2 text-foreground font-medium bg-muted/50 px-4 py-2 rounded-full text-sm">
                    <GitPullRequest className="w-4 h-4 text-primary" />
                    <span>New review triggered</span>
                </div>
            </div>
        </Card>
    );
}
