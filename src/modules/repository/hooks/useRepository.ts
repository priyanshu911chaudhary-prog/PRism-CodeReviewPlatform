"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchRepositories } from "../actions"

export const useRepositories = () => {
    return useInfiniteQuery({
        queryKey: ["repositories"],
        queryFn: async ({ pageParam=1 }) => {
            const response = await fetchRepositories(pageParam,10);
            return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage,allPages) => {
            if(lastPage.length<10){
                return undefined;
            }
            return allPages.length+1;
        }
    })
}