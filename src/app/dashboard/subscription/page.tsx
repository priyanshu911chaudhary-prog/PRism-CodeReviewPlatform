"use client"

import { authClient } from "@/lib/authClient"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getSubscriptionData, syncSubscriptionStatus, cancelSubscription } from "@/modules/payment/action"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, XCircle, AlertCircle, Sparkles, CreditCard, RefreshCw, Zap } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { ErrorState } from "@/components/ErrorState"

const PLAN_FEATURES = {
    free: [
        { name: "Up to 5 repositories", included: true },
        { name: "Up to 5 reviews per repository", included: true },
        { name: "Basic code reviews", included: true },
        { name: "Community support", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
    ],
    pro: [
        { name: "Unlimited repositories", included: true },
        { name: "Unlimited code reviews", included: true },
        { name: "Advanced code reviews", included: true },
        { name: "Email support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
    ],
};

export default function SubscriptionPage() {
    const { checkout, customer } = authClient;
    const router = useRouter();

    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [portalLoading, setPortalLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [downgradeLoading, setDowngradeLoading] = useState(false);
    
    const searchParams = useSearchParams();
    const success = searchParams.get("success");

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["subscription-data"],
        queryFn: getSubscriptionData,
        refetchOnWindowFocus: true,
    });

    const handleSync=async()=>{
        try{
            setSyncLoading(true)
            const result=await syncSubscriptionStatus();
            if(result.success){
                toast.success("Subscription Synced successfully!")
                refetch();
            }else{
                toast.error(result.error || "Failed to sync subscription");
            }
        }catch{
            toast.error("Failed to sync subscription");
        }finally{
            setSyncLoading(false);
        }
    }

    const handleUpgrade = async () => {
        setCheckoutLoading(true);
        try {
            await checkout({
                slug:"PRism"
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to start checkout");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleManage = async () => {
        setPortalLoading(true);
        try {
            await customer.portal();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to open portal");
        } finally {
            setPortalLoading(false);
        }
    };

    const handleDowngrade = async () => {
        setDowngradeLoading(true);
        try {
            const result = await cancelSubscription();
            if (result.success) {
                toast.success(result.message || "Successfully downgraded to Free plan");
                refetch();
            } else {
                toast.error(result.error || "Failed to downgrade subscription");
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to downgrade subscription");
        } finally {
            setDowngradeLoading(false);
        }
    };

    useEffect(() => {
        const sync=async()=>{
            if (!success) return;
            try{
                await syncSubscriptionStatus()
                refetch();
                toast.success("Subscription updated and synced successfully!");
            }catch(error){
                console.log(error)
            }
        }
        sync()
    }, [success, refetch]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <ErrorState 
                    title="Something went wrong" 
                    message="We couldn't load your subscription data. Please try again later."
                >
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        <RefreshCw className="mr-2 size-4" />
                        Try Again
                    </Button>
                </ErrorState>
            </div>
        );
    }

    if (!data?.user) {
        return (
            <div className="container mx-auto p-6 max-w-5xl flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Not Logged In</CardTitle>
                        <CardDescription>You must be logged in to view your subscription details.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button onClick={() => router.push('/login')}>Go to Login</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const currentTier = data.user.subscriptionTier as "FREE" | "PRO";
    const isPro = currentTier === "PRO";
    const isActive = data.user.subscriptionStatus === "ACTIVE";

    const repositoriesCount = data.limits?.repositories?.current || 0;
    const repositoriesLimit = data.limits?.repositories?.limit || 5;
    const repositoriesPercentage = Math.min((repositoriesCount / repositoriesLimit) * 100, 100);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <PageHeader 
                    title="Subscription" 
                    description="Manage your billing plan, usage, and preferences."
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={syncLoading || isLoading} className="hidden sm:flex">
                        <RefreshCw className={`mr-2 size-4 ${syncLoading ? "animate-spin" : ""}`} />
                        {syncLoading ? "Syncing..." : "Sync Status"}
                    </Button>
                    {isActive && (
                        <Button variant="outline" size="sm" onClick={handleManage} disabled={portalLoading}>
                            <CreditCard className="mr-2 size-4" />
                            {portalLoading ? "Loading..." : "Manage Billing"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Current Usage Overview */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            Current Plan
                            <Badge variant={isPro ? "default" : "secondary"} className="ml-auto">
                                {currentTier}
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            {isPro ? "You have access to all premium features." : "You are currently on the free tier."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-4 flex items-center justify-between text-sm font-medium">
                            <span>Repositories Limit</span>
                            <span>{isPro ? "Unlimited" : `${repositoriesCount} / ${repositoriesLimit}`}</span>
                        </div>
                        {!isPro && (
                            <Progress value={repositoriesPercentage} className="h-2 mt-2" />
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            Account Details
                        </CardTitle>
                        <CardDescription>
                            Your basic account information and status.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium truncate">{data.user.email}</span>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium flex items-center gap-1">
                                {isActive ? (
                                    <><div className="size-2 rounded-full bg-success" /> Active</>
                                ) : (
                                    <><div className="size-2 rounded-full bg-warning" /> Inactive</>
                                )}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="py-4">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Available Plans</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <Card className={`relative flex flex-col ${!isPro ? "border-primary/50 shadow-md ring-1 ring-primary/20" : ""}`}>
                        <CardHeader>
                            <CardTitle className="text-xl">Free</CardTitle>
                            <CardDescription>Perfect for personal projects and trying things out.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            <div className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                            <ul className="space-y-3">
                                {PLAN_FEATURES.free.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        {feature.included ? (
                                            <CheckCircle2 className="size-4 text-primary" />
                                        ) : (
                                            <XCircle className="size-4 text-muted-foreground opacity-50" />
                                        )}
                                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {!isPro ? (
                                <Button
                                    className="w-full"
                                    variant="secondary"
                                    disabled={true}
                                >
                                    Current Plan
                                </Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            className="w-full"
                                            variant="destructive"
                                            disabled={downgradeLoading}
                                        >
                                            {downgradeLoading ? "Cancelling..." : "Downgrade to Free"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Downgrade to Free plan?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to downgrade to the Free plan? Your Pro features will remain active until the end of your current billing period.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDowngrade} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Confirm Downgrade
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className={`relative flex flex-col ${isPro ? "border-primary shadow-md ring-1 ring-primary/50" : "bg-gradient-to-br from-card to-primary/5"}`}>
                        {!isPro && (
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                                <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0 shadow-lg px-3 py-1">
                                    <Sparkles className="size-3 mr-1" />
                                    Recommended
                                </Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                Pro
                            </CardTitle>
                            <CardDescription>For serious developers who need unlimited access.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-6">
                            <div className="text-3xl font-bold">$10<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                            <ul className="space-y-3">
                                {PLAN_FEATURES.pro.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        {feature.included ? (
                                            <CheckCircle2 className="size-4 text-primary" />
                                        ) : (
                                            <XCircle className="size-4 text-muted-foreground opacity-50" />
                                        )}
                                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            {isPro ? (
                                <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white" onClick={handleManage} disabled={portalLoading}>
                                    Manage Subscription
                                </Button>
                            ) : (
                                <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white" onClick={handleUpgrade} disabled={checkoutLoading}>
                                    {checkoutLoading ? "Preparing Checkout..." : "Upgrade to Pro"}
                                    {!checkoutLoading && <Zap className="size-4 ml-2" />}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}