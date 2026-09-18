"use client"

import React from "react"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const Logout = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
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
            onClick={handleLogout}
            className="cursor-pointer"
        >
            {children}
        </Button>
    )
}

export default Logout