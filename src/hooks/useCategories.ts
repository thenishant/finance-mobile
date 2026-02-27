import {useQuery} from "@tanstack/react-query";
import {categoryService} from "../services/category.service";
import {useAuth} from "./useAuth";

export const useCategories = () => {

    const {token} = useAuth();

    return useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getTree,
        enabled: !!token
    });
};