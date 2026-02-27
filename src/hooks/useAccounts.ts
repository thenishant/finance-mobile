import { useAuth } from "./useAuth";
import {accountService} from "../services/account.service";
import {useQuery} from "@tanstack/react-query";

export const useAccounts = () => {
    const { token } = useAuth();

    return useQuery({
        queryKey: ["accounts"],
        queryFn: accountService.getAll,
        enabled: !!token,   // 🔥 prevents 401
    });
};