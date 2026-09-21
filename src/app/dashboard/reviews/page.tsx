"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { getReview } from "@/modules/review/actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ReviewCardItem({ review }: { review: any }) {

    return (
        <Card className="hover:shadow-md transition-all duration-200 border-border/50 bg-card overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40 bg-muted/20">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-secondary/50 font-mono text-xs">
                                {review.repository?.name}
                            </Badge>
                            
                            <Badge
                                variant={review.status === "completed" || review.status === "COMPLETED" ? "default" : "outline"}
                                className={`capitalize text-xs ${review.status === "completed" || review.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : ""}`}
                            >
                                {review.status}
                            </Badge>
                        </div>
                        
                        <div className="flex items-center text-muted-foreground text-xs gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>
                                {formatDistanceToNow(new Date(review.createdAt), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </div>

                    <CardTitle className="text-xl leading-tight group mt-1">
                        <a
                            href={review.prUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors inline-flex items-baseline gap-1.5"
                        >
                            <span className="line-clamp-2">{review.prTitle}</span>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity translate-y-0.5 shrink-0" />
                        </a>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="relative">
                    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground/90 prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline overflow-hidden max-h-[150px]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {review.review}
                        </ReactMarkdown>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                </div>
                
                <div className="mt-2 flex justify-center">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        asChild
                        className="rounded-full px-6 shadow-sm border border-border/50"
                    >
                        <a href={review.prUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            View on GitHub <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ReviewPage() {
    const {
        data: reviews,
        isLoading,
        error
    } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            return await getReview();
        }
    })

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Review History</h1>
                <p className="text-muted-foreground">
                    Your latest AI-powered code review summaries.
                </p>
            </div>

            {isLoading && (
                <div className="flex justify-center p-8">
                    <Spinner className="size-8 text-muted-foreground" />
                </div>
            )}

            {error && (
                <Empty className="my-8 border-destructive/50">
                    <EmptyTitle>Error</EmptyTitle>
                    <EmptyDescription>Failed to fetch reviews: {error.message}</EmptyDescription>
                </Empty>
            )}

            {!isLoading && !error && reviews?.length === 0 && (
                <Empty className="my-8">
                    <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                    <EmptyTitle>No reviews yet</EmptyTitle>
                    <EmptyDescription>
                        Your AI-powered code reviews will appear here once available.
                    </EmptyDescription>
                </Empty>
            )}

            {!isLoading && !error && reviews && reviews.length > 0 && (
                <div className="grid gap-6">
                    {reviews.map((review: any) => (
                        <ReviewCardItem key={review.id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
}