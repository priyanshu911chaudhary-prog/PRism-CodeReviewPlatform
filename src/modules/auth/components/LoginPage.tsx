"use client";

import React from "react";
import StickyHeader from "./StickyHeader";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import PipelineSection from "./PipelineSection";
import TrustSection from "./TrustSection";
import SignInSection from "./SignInSection";
import Footer from "./Footer";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <StickyHeader />
            <div className="flex-1">
                <HeroSection />
                <ProblemSection />
                <PipelineSection />
                <TrustSection />
                <SignInSection />
            </div>
            <Footer />
        </div>
    );
}
