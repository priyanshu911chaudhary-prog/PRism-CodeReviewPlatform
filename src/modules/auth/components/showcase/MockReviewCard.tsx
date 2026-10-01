import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blobatar } from "@/components/ui/blobatar";
import { Separator } from "@/components/ui/separator";

export default function MockReviewCard() {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <Blobatar name="acme/web-app" blobatar={{ animate: "hover", title: "acme/web-app" }} className="h-8 w-8 rounded-md" />
                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-semibold">acme/web-app</CardTitle>
                            <Badge variant="outline" className="text-muted-foreground font-normal">#142</Badge>
                        </div>
                        <CardDescription>Refactor auth middleware</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 pb-2 text-sm">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-transparent w-fit shrink-0 mt-0.5">
                            INTRODUCED
                        </Badge>
                        <div>
                            <p className="font-medium">Missing rate limiting on login endpoint</p>
                            <p className="text-muted-foreground text-xs mt-0.5">Found in <span className="font-mono">src/api/auth.ts</span></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 opacity-60">
                        <Badge variant="outline" className="bg-muted text-muted-foreground hover:bg-muted border-transparent w-fit shrink-0 mt-0.5">
                            PRE_EXISTING
                        </Badge>
                        <div>
                            <p className="font-medium">Unsafe regular expression</p>
                            <p className="text-muted-foreground text-xs mt-0.5">Found in <span className="font-mono">src/utils/validation.ts</span></p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
