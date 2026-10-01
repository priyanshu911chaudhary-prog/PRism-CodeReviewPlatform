import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Blobatar } from "@/components/ui/blobatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface PRPanelProps {
    disableBadges?: boolean;
    highlightBadges?: boolean;
    highlightFix?: boolean;
}

export function PRPanel({ disableBadges, highlightBadges, highlightFix }: PRPanelProps) {
    return (
        <Card className="w-full shadow-sm overflow-hidden border bg-background text-left">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Blobatar name="acme/web-app" blobatar={{ animate: "hover", title: "acme/web-app" }} className="h-10 w-10 rounded-md" />
                        <div>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg font-semibold">acme/web-app</CardTitle>
                                <Badge variant="outline" className="text-muted-foreground font-normal">#142</Badge>
                            </div>
                            <CardDescription>Refactor auth middleware</CardDescription>
                        </div>
                    </div>
                    <Button 
                        size="sm" 
                        className={`transition-colors ${highlightFix ? 'bg-primary text-primary-foreground animate-pulse' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                    >
                        Fix 2 selected
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {/* Finding 1 */}
                    <div className={`flex items-start gap-4 p-4 transition-colors ${highlightFix ? 'bg-primary/5' : 'hover:bg-muted/10'}`}>
                        <div className="mt-1">
                            <Checkbox checked={true} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                <p className="font-medium text-sm text-foreground">Missing rate limiting on login endpoint</p>
                                {!disableBadges && (
                                    <Badge 
                                        variant="outline" 
                                        className={`w-fit border-transparent ${highlightBadges ? 'bg-destructive/20 text-destructive scale-105 transition-transform' : 'bg-destructive/10 text-destructive'}`}
                                    >
                                        INTRODUCED
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">Found in <span className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">src/api/auth.ts</span></p>
                        </div>
                    </div>
                    {/* Finding 2 */}
                    <div className={`flex items-start gap-4 p-4 transition-colors ${highlightFix ? 'bg-primary/5' : 'hover:bg-muted/10'}`}>
                        <div className="mt-1">
                            <Checkbox checked={true} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                <p className="font-medium text-sm text-foreground">Unsafe regular expression</p>
                                {!disableBadges && (
                                    <Badge 
                                        variant="outline" 
                                        className={`w-fit border-transparent ${highlightBadges ? 'bg-destructive/20 text-destructive scale-105 transition-transform' : 'bg-destructive/10 text-destructive'}`}
                                    >
                                        INTRODUCED
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">Found in <span className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">src/utils/validation.ts</span></p>
                        </div>
                    </div>
                    {/* Finding 3 */}
                    <div className="flex items-start gap-4 p-4 hover:bg-muted/10 transition-colors opacity-50">
                        <div className="mt-1">
                            <Checkbox checked={false} disabled />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                <p className="font-medium text-sm text-foreground">Deprecated API usage in legacy module</p>
                                {!disableBadges && (
                                    <Badge variant="outline" className="w-fit bg-muted text-muted-foreground border-transparent">
                                        PRE_EXISTING
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-sm">Found in <span className="font-mono text-xs bg-muted/50 px-1 py-0.5 rounded">src/legacy/parser.ts</span></p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
