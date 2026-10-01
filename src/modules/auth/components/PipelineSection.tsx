"use client";

import React, { useState } from "react";
import { PRPanel } from "./showcase/PRPanel";

const steps = [
    {
        id: "connect",
        title: "Connect & index",
        desc: "Sign in with GitHub and connect a repository. PRism embeds the codebase for contextual understanding.",
    },
    {
        id: "detect",
        title: "Detect",
        desc: "A pull request opens. PRism reads the changed files and runs analysis on the exact commit SHA.",
    },
    {
        id: "classify",
        title: "Classify",
        desc: "Each finding is labeled. INTRODUCED means this PR caused it. PRE_EXISTING means it was already there.",
    },
    {
        id: "fix",
        title: "Fix",
        desc: "PRism prefers deterministic fixes from the analyzer. When none exist, it generates a structured edit proposal.",
    },
    {
        id: "validate",
        title: "Validate",
        desc: "Every fix is applied in an isolated workspace, re-analyzed, and validated.",
    },
    {
        id: "apply",
        title: "Apply & re-review",
        desc: "All approved fixes land as one atomic commit, triggering a fresh review automatically.",
    }
];

function ActiveStepVisual({ stepId }: { stepId: string }) {
    if (stepId === "connect") {
        return (
            <div className="flex-1 flex items-center justify-center p-8 bg-muted/10 h-full">
                <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center text-background">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </div>
                    <div className="h-0.5 w-12 bg-border"></div>
                    <div className="w-16 h-16 rounded-xl bg-muted border flex items-center justify-center font-bold text-foreground">
                        PRism
                    </div>
                </div>
            </div>
        );
    }
    
    if (stepId === "detect") {
        return (
            <div className="flex-1 p-6 bg-muted/10 h-full flex items-center">
                <PRPanel disableBadges />
            </div>
        );
    }
    
    if (stepId === "classify") {
        return (
            <div className="flex-1 p-6 bg-muted/10 h-full flex items-center">
                <PRPanel highlightBadges />
            </div>
        );
    }
    
    if (stepId === "fix") {
        return (
            <div className="flex-1 p-6 bg-muted/10 h-full flex items-center">
                <PRPanel highlightFix />
            </div>
        );
    }
    
    if (stepId === "validate") {
        return (
            <div className="flex-1 p-6 bg-muted/10 h-full flex flex-col justify-center gap-4">
                <div className="border rounded-md overflow-hidden bg-background shadow-sm">
                    <div className="bg-muted/50 px-4 py-2 border-b text-xs font-mono text-muted-foreground flex justify-between">
                        <span>src/api/auth.ts</span>
                        <span>acme/web-app #142</span>
                    </div>
                    <div className="p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-destructive bg-destructive/10 px-2 py-0.5">{"- export const login = async (req) => {"}</div>
                        <div className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5">{"+ export const login = rateLimit(async (req) => {"}</div>
                    </div>
                </div>
                <div className="bg-background border rounded-md p-4 space-y-3 shadow-sm">
                    <h4 className="text-sm font-medium">Validation Checklist</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Original finding resolved
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        0 new findings introduced
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Head SHA unchanged
                    </div>
                </div>
            </div>
        );
    }
    
    if (stepId === "apply") {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10 h-full">
                <div className="bg-background border rounded-lg p-6 shadow-sm w-full max-w-sm space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Commit applied</p>
                            <p className="text-xs text-muted-foreground font-mono">1 commit pushed to acme/web-app</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono bg-muted/50 p-2 rounded text-muted-foreground">
                        fix: address 2 static analysis findings
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

export default function PipelineSection() {
    const [activeStep, setActiveStep] = useState(steps[0].id);

    return (
        <section id="pipeline" className="py-16 md:py-24 max-w-5xl mx-auto px-6 w-full">
            <div className="mb-12">
                <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    How it works
                </h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                <div className="w-full md:w-1/3 md:sticky md:top-24 space-y-2">
                    {steps.map((step) => (
                        <div 
                            key={step.id}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${activeStep === step.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                            onClick={() => setActiveStep(step.id)}
                        >
                            <h3 className={`font-medium text-lg ${activeStep === step.id ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</h3>
                            {activeStep === step.id && (
                                <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                                    {step.desc}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="w-full md:w-2/3 min-h-[450px] border rounded-xl bg-background flex flex-col overflow-hidden shadow-sm">
                    <ActiveStepVisual stepId={activeStep} />
                </div>
            </div>
        </section>
    );
}
