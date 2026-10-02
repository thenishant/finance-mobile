import {useQuery} from "@tanstack/react-query";

import {authService} from "../services/auth.service";

export const PROFILE_QUERY_KEY = ["profile"] as const;

export const useProfile = () =>
    useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: authService.me,
        staleTime: 1000 * 60 * 10,
    });
