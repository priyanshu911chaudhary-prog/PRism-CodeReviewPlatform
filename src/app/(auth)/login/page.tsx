import LoginUI from "@/modules/auth/components/LoginUI"
import {requireUnAuth} from "@/modules/auth/utils/authUtils"
import { ModeToggle } from "@/lib/theme"

export default async function LoginPage() {
    await requireUnAuth();
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4 relative">
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>
            <LoginUI />
        </div>
    )
}
