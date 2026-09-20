"use client";

import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  GitCommit,
  GitPullRequest,
  MessageSquare,
  GitBranch,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import {
  getDashboardStats,
  getMonthlyActivity,
} from "@/modules/dashboard/actions";
import ContributionGraph from "@/modules/dashboard/components/ContributionGraph";
import { authClient } from "@/lib/authClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const StatSkeleton = () => <Skeleton className="h-8 w-16 mt-1" />;

const MainPage=()=>{

    const {data:stats,isLoading}=useQuery({
        queryKey:["dashboard-stats"],
        queryFn:async()=>await getDashboardStats(),
        refetchOnWindowFocus:false,
    })

    const {data:monthyActivity,isLoading:isLoadingActivity}=useQuery({
        queryKey:["monthly-activity"],
        queryFn:async()=>await getMonthlyActivity(),
        refetchOnWindowFocus:false,
    })

    const { data: session } = authClient.useSession();
    const userName = session?.user?.name || "there";

    return(
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Hello {userName},</h1>
                <p className="text-muted-foreground">Overview of your coding activity and ai reviews</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <StatSkeleton /> : stats?.totalRepos || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">connected repos</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                        <GitCommit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <StatSkeleton /> : stats?.totalCommits || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">committed this year</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
                        <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <StatSkeleton /> : stats?.totalPRs || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">created</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? <StatSkeleton /> : stats?.totalReviews || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">completed</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 flex flex-col">
                    <CardHeader>
                        <CardTitle>Contribution Activity</CardTitle>
                        <CardDescription>Track your contributions</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-center justify-center">
                        <ContributionGraph/>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3 flex flex-col">
                    <CardHeader>
                        <CardTitle>Monthly Activity</CardTitle>
                        <CardDescription>Track your monthly activity</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[300px]">
                        {isLoadingActivity ? (
                            <div className="h-full flex items-center justify-center">
                                <Spinner className="size-6 text-muted-foreground" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="99%" height={300}>
                                <BarChart data={monthyActivity || []}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-xs text-muted-foreground" />
                                    <YAxis tickLine={false} axisLine={false} className="text-xs text-muted-foreground" width={40} />
                                    <Tooltip 
                                        cursor={{ fill: 'currentColor', opacity: 0.1 }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                    <Bar dataKey="commits" name="Contributions" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="prs" name="Pull Requests" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="reviews" name="AI Reviews" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MainPage