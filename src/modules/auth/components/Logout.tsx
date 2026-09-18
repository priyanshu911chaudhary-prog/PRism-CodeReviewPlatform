"use client"

import React from "react"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const Logout = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({
    children,
    className,
    variant = "ghost",
    ...props
}, ref) => {
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                },
            },
        })
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            onClick={handleLogout}
            className={className}
            {...props}
        >
            {children}
        </Button>
    )
})

Logout.displayName = "Logout"

export default Logout