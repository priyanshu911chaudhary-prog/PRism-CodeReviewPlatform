import React from "react";

export default function ProblemSection() {
    return (
        <section className="py-16 md:py-24 max-w-5xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                <div className="space-y-4 p-8 rounded-xl bg-muted/30 border border-muted h-full">
                    <h3 className="font-heading text-2xl font-bold">Static analysis: 23 findings</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                        Traditional CI tools dump every warning onto your PR, including years of accumulated technical debt. You spend more time filtering out noise than reviewing new code.
                    </p>
                </div>
                <div className="space-y-4 p-8 rounded-xl bg-foreground text-background h-full">
                    <h3 className="font-heading text-2xl font-bold text-background">PRism: 3 introduced / 20 pre-existing</h3>
                    <p className="text-background/80 leading-relaxed text-base">
                        By understanding the exact diff, PRism isolates the problems you actually caused. You only fix what you broke, keeping the review focused and actionable.
                    </p>
                </div>
            </div>
        </section>
    );
}
