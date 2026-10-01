import React from "react";
import { Badge } from "@/components/ui/badge";

export default function MockFixTimeline() {
    return (
        <div className="w-full max-w-sm">
            <div className="flex flex-col gap-4 relative">
                <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border -z-10" />
                
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 rounded-full bg-background border flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">QUEUED</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 rounded-full bg-background border flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">GENERATING</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 rounded-full bg-background border flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">VALIDATING</Badge>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="h-7 w-7 rounded-full bg-background border-success/30 flex items-center justify-center shrink-0">
                        <div className="h-2 w-2 rounded-full bg-success" />
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success hover:bg-success/10 border-success/20">APPLIED</Badge>
                </div>
            </div>
        </div>
    );
}
