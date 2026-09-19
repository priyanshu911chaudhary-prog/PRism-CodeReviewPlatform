"use client";

import React, { useMemo } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

import { ExternalLink, Star, Search } from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { useRepositories } from "@/modules/repository/hooks/useRepository";
import { RepositoryListSkeleton } from "@/modules/repository/components/repository-skeleton";

interface Repository {
    id: string;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    topics: string[]
    isConnected: boolean;
}

const RepositoryPage = () => {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useRepositories();

    const [searchQuery, setSearchQuery] = useState("");
    const [language, setLanguage] = useState("all");
    const [sortBy, setSortBy] = useState("stars_desc");
    const [localConnectingId, setLocalConnectingId] = useState<number | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.1,
            }
        );

        const currentTarget = observerTarget.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allRepositories = data?.pages.flatMap(page => page) || [];

    const uniqueLanguages = useMemo(() => {
        const langs = new Set<string>();
        allRepositories.forEach((repo: Repository) => {
            if (repo.language) langs.add(repo.language);
        });
        return Array.from(langs).sort();
    }, [allRepositories]);

    const filteredRepositories = useMemo(() => {
        let result = allRepositories.filter((repo: Repository) => {
            const matchesQuery = repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || repo.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLanguage = language === "all" || repo.language?.toLowerCase() === language.toLowerCase();
            return matchesQuery && matchesLanguage;
        });

        if (sortBy === "stars_desc") {
            result.sort((a, b) => b.stargazers_count - a.stargazers_count);
        } else if (sortBy === "stars_asc") {
            result.sort((a, b) => a.stargazers_count - b.stargazers_count);
        } else if (sortBy === "name_asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name_desc") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }, [allRepositories, searchQuery, language, sortBy]);

    const handleConnect = (repo: Repository) => {
        setLocalConnectingId(Number(repo.id));
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
                <p className="text-muted-foreground">Manage your connected git repositories</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="text" 
                        placeholder="Search repositories" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="pl-9"
                    />
                </div>
                
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {uniqueLanguages.map(lang => (
                            <SelectItem key={lang} value={lang.toLowerCase()}>{lang}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stars_desc">Stars (High to Low)</SelectItem>
                        <SelectItem value="stars_asc">Stars (Low to High)</SelectItem>
                        <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-4">
                {isLoading && (
                    <div className="flex justify-center p-8">
                        <Spinner className="size-8 text-muted-foreground" />
                    </div>
                )}
                {isError && (
                    <Empty className="my-8 border-destructive/50">
                        <EmptyTitle>Error</EmptyTitle>
                        <EmptyDescription>Failed to load repositories. Please try again.</EmptyDescription>
                    </Empty>
                )}
                {!isLoading && !isError && filteredRepositories.length === 0 && (
                    <Empty className="my-8">
                        <EmptyTitle>No repositories found</EmptyTitle>
                        <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
                    </Empty>
                )}
                
                {filteredRepositories.map((repo: any) => (
                    <Card
                        key={repo.id}
                        className="hover:shadow-md transition-all duration-200 border-border/50 bg-card/50"
                    >
                        <CardHeader className="pb-3 md:pb-4">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <CardTitle className="text-xl truncate mr-2">{repo.name}</CardTitle>

                                        {repo.language && (
                                            <Badge variant="outline" className="bg-secondary/20">
                                                {repo.language}
                                            </Badge>
                                        )}

                                        {repo.isConnected && (
                                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                                                Connected
                                            </Badge>
                                        )}
                                        
                                        <div className="flex items-center text-muted-foreground text-sm gap-1 ml-auto md:ml-2">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            <span>{repo.stargazers_count}</span>
                                        </div>
                                    </div>

                                    {repo.description && (
                                        <CardDescription className="line-clamp-2">
                                            {repo.description}
                                        </CardDescription>
                                    )}
                                    
                                    {repo.topics && repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {repo.topics.slice(0, 5).map((topic: string) => (
                                                <Badge key={topic} variant="secondary" className="text-xs font-normal opacity-80">
                                                    {topic}
                                                </Badge>
                                            ))}
                                            {repo.topics.length > 5 && (
                                                <Badge variant="secondary" className="text-xs font-normal opacity-80">
                                                    +{repo.topics.length - 5}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 md:self-start shrink-0">
                                    <Button variant="outline" size="icon" asChild className="h-9 w-9">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="View on GitHub"
                                        >
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </a>
                                    </Button>

                                    <Button
                                        onClick={() => handleConnect(repo)}
                                        disabled={localConnectingId === repo.id || repo.isConnected}
                                        variant={repo.isConnected ? "secondary" : "default"}
                                        className="w-[100px]"
                                    >
                                        {localConnectingId === repo.id
                                            ? "Connecting..."
                                            : repo.isConnected
                                                ? "Connected"
                                                : "Connect"}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
            
            <div ref={observerTarget} className="py-4">
                {isFetchingNextPage && <RepositoryListSkeleton />}

                {!hasNextPage && allRepositories.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                        You've reached the end of your repositories.
                    </p>
                )}
            </div>
        </div>
    )

}

export default RepositoryPage;