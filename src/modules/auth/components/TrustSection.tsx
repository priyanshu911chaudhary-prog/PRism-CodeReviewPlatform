import React from "react";

export default function TrustSection() {
    return (
        <section className="py-16 md:py-24 max-w-5xl mx-auto px-6 w-full">
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-12">
                You stay in control.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-foreground">Developer approves every fix.</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            PRism proposes. You select which findings to fix. Nothing is committed to your repository without your explicit approval.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-foreground">Atomic batches.</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            If any fix in a batch fails validation in the isolated workspace, the entire batch is halted. Nothing is committed. All or nothing.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-foreground">Stale-safe.</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Before pushing a commit, PRism re-checks the PR head SHA. If a human pushed commits while the fixes were generating, the batch is marked STALE and discarded to prevent conflicts.
                        </p>
                    </div>
                </div>

                <div className="bg-muted/30 border rounded-xl p-8 font-mono text-sm h-full flex flex-col justify-center">
                    <div className="flex flex-col gap-1 relative">
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-right text-muted-foreground">QUEUED</div>
                            <div className="w-2 h-2 rounded-full bg-border"></div>
                        </div>
                        <div className="h-6 border-l-2 border-border ml-[116px]"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-right text-muted-foreground">GENERATING</div>
                            <div className="w-2 h-2 rounded-full bg-border relative">
                                <div className="absolute top-1/2 left-2 w-12 border-t-2 border-dashed border-border -translate-y-1/2"></div>
                            </div>
                            <div className="text-destructive bg-destructive/10 px-2 py-1 rounded text-xs ml-10">FAILED</div>
                        </div>
                        <div className="h-6 border-l-2 border-border ml-[116px]"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-right text-foreground font-semibold">VALIDATING</div>
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                        </div>
                        <div className="h-6 border-l-2 border-border ml-[116px]"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-right text-muted-foreground">COMMITTING</div>
                            <div className="w-2 h-2 rounded-full bg-border relative">
                                <div className="absolute top-1/2 left-2 w-12 border-t-2 border-dashed border-border -translate-y-1/2"></div>
                                <div className="absolute -top-3 left-6 text-[9px] text-muted-foreground bg-muted px-1 whitespace-nowrap rounded">head SHA changed</div>
                            </div>
                            <div className="text-amber-600 bg-amber-500/10 px-2 py-1 rounded text-xs ml-10">STALE</div>
                        </div>
                        <div className="h-6 border-l-2 border-border ml-[116px]"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-24 text-right text-muted-foreground">APPLIED</div>
                            <div className="w-2 h-2 rounded-full bg-border"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
