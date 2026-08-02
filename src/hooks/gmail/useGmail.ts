import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {gmailService} from "../../services/gmail.service";

export const useGmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gmailService.connect,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["gmail"],
            });
        },
    });
};

export const useSyncGmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gmailService.sync,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["gmail"],
            });
        },
    });
};

export const useGmailStatus = () =>
    useQuery({
        queryKey: ["gmail"],
        queryFn: gmailService.getStatus,
        staleTime: 1000 * 60 * 5,
    });