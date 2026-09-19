import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getConnectedRepositories,
    disconnectRepository,
    disconnectAllRepositories,
} from "@/modules/settings/actions/index";

import { toast } from "sonner";

import {
    ExternalLink,
    Trash2,
    AlertTriangle,
} from "lucide-react";

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
} from "@/components/ui/alert-dialog";

import { useState } from "react";

export function RepositoryList() {

    const queryClient = useQueryClient();

    const [disconnectAllOpen, setDisconnectAllOpen] = useState<boolean>(false);

    const { data: repositories, isLoading, error } = useQuery({
        queryKey: ["connected-repositories"],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false
    });

    const disconnectMutation = useMutation({
        mutationFn: async (repositoryId: string) => {
            return await disconnectRepository(repositoryId);
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                toast.success("Repository disconnected successfully");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const disconnectAllMutation = useMutation({
        mutationFn: async () => {
            return await disconnectAllRepositories();
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["connected-repositories"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
                toast.success(result.message);
                setDisconnectAllOpen(false);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>
                        Manage your connected GitHub repositories
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-20 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }
    if (error) {
        return (
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Error Loading Repositories
                    </CardTitle>
                    <CardDescription>{error.message}</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    if (repositories?.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>
                        Manage your connected GitHub repositories
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <ExternalLink className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">No repositories connected</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        You haven't connected any GitHub repositories yet. Go to the Repositories page to connect one.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1.5">
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>
                        Manage your connected GitHub repositories
                    </CardDescription>
                </div>
                {repositories && repositories.length > 0 && (
                    <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={disconnectAllMutation.isPending}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Disconnect All
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Disconnect All Repositories?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will disconnect all your connected GitHub repositories and delete the associated webhooks. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={disconnectAllMutation.isPending}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => disconnectAllMutation.mutate()}
                                    disabled={disconnectAllMutation.isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {disconnectAllMutation.isPending ? "Disconnecting..." : "Disconnect All"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {repositories?.map((repo) => (
                        <div key={repo.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col gap-1.5 min-w-0">
                                <div className="font-medium leading-none flex items-center gap-2">
                                    <span className="truncate">{repo.name}</span>
                                    <Badge variant="outline" className="text-[10px] uppercase h-5 px-1.5 bg-secondary/20 shrink-0">
                                        Connected
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                    {repo.owner} • Added {new Date(repo.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                    <a href={repo.url} target="_blank" rel="noopener noreferrer" title="View on GitHub">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            disabled={disconnectMutation.isPending}
                                            title="Disconnect Repository"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Disconnect {repo.name}?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will disconnect the repository and remove its associated webhook. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={disconnectMutation.isPending}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => disconnectMutation.mutate(repo.id)}
                                                disabled={disconnectMutation.isPending}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}