import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blobatar } from "@/components/ui/blobatar";

export default function MockRepoCard() {
    return (
        <Card className="w-full max-w-sm shadow-sm">
            <CardHeader className="flex flex-row items-center gap-4 py-4">
                <Blobatar name="my-project" blobatar={{ title: "my-project" }} className="h-10 w-10 rounded-md" />
                <div className="flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">my-project</CardTitle>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 hover:bg-success/10">
                            Connected
                        </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">acme-corp</span>
                </div>
            </CardHeader>
        </Card>
    );
}
