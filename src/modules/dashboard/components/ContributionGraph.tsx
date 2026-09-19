"use client";

import React from "react";
import dynamic from "next/dynamic";
const ActivityCalendar = dynamic(() => import("react-activity-calendar").then(mod => mod.ActivityCalendar), { ssr: false });
import { useTheme } from "next-themes";
import { getContributionStats } from "../actions";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

const calendarTheme = {
    light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
    dark: ["#161b22", "hsl(142, 71%, 45%)"],
};

const ContributionGraph = () => {
    const { theme } = useTheme();
    const { data, isLoading } = useQuery({
        queryKey: ['contribution-graph'],
        queryFn: async () => await getContributionStats(),
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return (
            <div className="flex w-full items-center justify-center p-8">
                <Spinner className="size-6 text-muted-foreground" />
            </div>
        )
    }

    if (!data || !data.contributions.length) {
        return (
            <Empty className="my-4">
                <EmptyTitle>No Contributions Found</EmptyTitle>
                <EmptyDescription>
                    We couldn't find any recent GitHub contributions.
                </EmptyDescription>
            </Empty>
        )
    }

    return (
        <div className="w-full flex flex-col items-center gap-4 p-4">
            <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                    {data.totalContributions}
                </span>{" "}
                contributions in the last year
            </div>

            <div className="w-full overflow-x-auto">
                <div className="flex justify-center min-w-max px-4">
                    <ActivityCalendar
                        data={data.contributions}
                        colorScheme={theme === "dark" ? "dark" : "light"}
                        blockSize={11}
                        blockMargin={4}
                        fontSize={14}
                        showWeekdayLabels
                        showMonthLabels
                        theme={calendarTheme}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContributionGraph