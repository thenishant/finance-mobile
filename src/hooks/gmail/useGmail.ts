import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {gmailService} from "../../services/gmail.service";

export const GMAIL_QUERY_KEY = ["gmail"] as const;

export const useGmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gmailService.connect,

        onSuccess: async () => {
            console.log(
                "[GMAIL] Connection successful",
            );

            await queryClient.invalidateQueries({
                queryKey: GMAIL_QUERY_KEY,
            });
        },

        onError: error => {
            console.error(
                "[GMAIL] Connection failed:",
                error,
            );
        },
    });
};

export const useGmailStatus = () =>
    useQuery({
        queryKey: GMAIL_QUERY_KEY,
        queryFn: gmailService.getStatus,
        staleTime: 1000 * 60 * 5,
    });

export const useStartWatch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gmailService.startWatch,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: GMAIL_QUERY_KEY,
            });
        },
    });
};

export const useDisconnectGmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gmailService.disconnect,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: GMAIL_QUERY_KEY,
            });
        },
    });
};

export const useSyncGmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => gmailService.sync(20),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: GMAIL_QUERY_KEY,
            });
        },
    });
};

export const useRecentImports = () =>
    useQuery({
        queryKey: ["gmail", "recentImport"],
        queryFn:
        gmailService.getRecentImports,
    });