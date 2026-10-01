import React from "react";
import LoginUI from "@/modules/auth/components/LoginUI";

export default function SignInSection() {
    return (
        <section id="sign-in" className="py-24 border-t bg-muted/30 w-full flex items-center justify-center">
            <div className="w-full max-w-md">
                <LoginUI />
            </div>
        </section>
    );
}
