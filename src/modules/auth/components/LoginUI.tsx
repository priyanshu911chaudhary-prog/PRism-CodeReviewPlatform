"use client"

import { authClient } from "@/lib/authClient"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { GithubDark } from "@/components/ui/svgs/githubDark"

const LoginUI = () => {
    const { signIn } = authClient
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGithubLogin = async () => {
        setError(null)
        setIsLoading(true)
        try {
            await signIn.social({
                provider: "github"
            })
        } catch (error) {
            console.log("Error in GitHub Login:", error)
            setError("Failed to sign in with GitHub. Please try again.")
            setIsLoading(false)
        } 
    }

    return (
        <Card className="w-full max-w-sm mx-auto shadow-xl">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold tracking-tight">Welcome Back</CardTitle>
                <CardDescription>
                    Sign in to your account using your GitHub profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <p className="mb-4 text-sm text-destructive text-center">
                        {error}
                    </p>
                )}

                <Button
                    variant="outline"
                    className="w-full font-medium"
                    onClick={handleGithubLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                        <div className="mr-2 flex h-5 w-5 items-center justify-center">
                            <GithubLight className="h-full w-full dark:hidden" />
                            <GithubDark className="h-full w-full hidden dark:block" />
                        </div>
                    )}

                    Sign in with GitHub
                </Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
                By continuing, you agree to our Terms of Service.
            </CardFooter>
        </Card>
    )
}

export default LoginUI