import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorStateProps {
    title?: string
    message: string
    children?: React.ReactNode // for retry buttons etc.
}

export function ErrorState({ title = "Error", message, children }: ErrorStateProps) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-4 items-start">
                <p>{message}</p>
                {children && <div>{children}</div>}
            </AlertDescription>
        </Alert>
    )
}
