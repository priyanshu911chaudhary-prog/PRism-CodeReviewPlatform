import React from "react";
import { Button } from "@/components/ui/button";
import { PRPanel } from "./showcase/PRPanel";

export default function HeroSection() {
    const handleScrollToSignIn = () => {
        const element = document.getElementById("sign-in");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };
    
    const handleScrollToPipeline = () => {
        const element = document.getElementById("pipeline");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="py-16 md:py-24 max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center gap-12">
            <div className="space-y-6 max-w-3xl">
                <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                    Code review that fixes what it finds.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    PRism analyzes pull requests, classifies findings as introduced or pre-existing, validates fixes in isolation, and commits them atomically.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                    <Button size="lg" className="w-full sm:w-auto text-base bg-foreground text-background hover:bg-foreground/90" onClick={handleScrollToSignIn}>
                        Get started with GitHub
                    </Button>
                    <Button variant="link" size="lg" className="w-full sm:w-auto text-base text-muted-foreground hover:text-foreground" onClick={handleScrollToPipeline}>
                        See how it works &rarr;
                    </Button>
                </div>
            </div>
            
            <div className="w-full mt-8">
                <PRPanel />
            </div>
        </section>
    );
}
