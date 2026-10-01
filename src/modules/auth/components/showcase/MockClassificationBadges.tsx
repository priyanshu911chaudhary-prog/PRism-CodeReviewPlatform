import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function MockClassificationBadges() {
    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-3">
                <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-transparent">
                    INTRODUCED
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground hover:bg-muted border-transparent">
                    PRE_EXISTING
                </Badge>
            </div>
            
            <Card className="shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-3 border-b">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-sm font-medium">Memory leak in effect hook</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    <span className="text-sm font-medium text-muted-foreground">Missing return type</span>
                </div>
            </Card>
        </div>
    );
}
