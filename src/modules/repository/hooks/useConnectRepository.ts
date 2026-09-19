"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { connectRepository } from "../actions";
import { toast } from "sonner"

export const useConnectRepository = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ owner, repo, githubId }: { owner: string, repo: string, githubId: number }) => {
            await connectRepository(owner, repo, githubId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["repositories"] })
            toast.success("Repository connected successfully")
        },
        onError: (error) => {
            toast.error(error.message)
            console.log(error)
        }
    })
}