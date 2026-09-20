"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getUserProfile,
    updateUserProfile,
} from "@/modules/settings/actions";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfilePage() {
    const queryClient = useQueryClient()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const { data: profile, isLoading } = useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => await getUserProfile(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setName(profile.name || "")
            setEmail(profile.email || "")
        }
    },[profile]);

    const updateMutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            return await updateUserProfile(data);
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["user-profile"] });
                toast.success(result.message);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({ name, email })
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your public profile and personal details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 bg-muted rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-muted rounded"></div>
                                <div className="h-4 w-48 bg-muted rounded"></div>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="h-10 bg-muted rounded"></div>
                            <div className="h-10 bg-muted rounded"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const userInitials = name?.substring(0, 2).toUpperCase() || "US";
    const isUnchanged = name === profile?.name && email === profile?.email;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your public profile and personal details</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20 border shadow-sm">
                            <AvatarImage src={profile?.image || undefined} alt={name} />
                            <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1.5">
                            <h3 className="font-medium text-lg leading-none">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground">This is synced with your connected GitHub account.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={updateMutation.isPending}
                                className="bg-muted/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={updateMutation.isPending}
                                className="bg-muted/50"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending || isUnchanged}
                        >
                            {updateMutation.isPending ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}