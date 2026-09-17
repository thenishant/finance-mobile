import axios from "axios";

import {queryClient} from "../lib/queryClient";
import {useAuthStore} from "../stores/useAuthStore";

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(config => {

    const token =
        useAuthStore.getState().token;

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;

    }

    return config;

});

let isHandling401 = false;

api.interceptors.response.use(

    response => response,

    async error => {

        if (
            error.response?.status === 401 &&
            !isHandling401
        ) {

            isHandling401 = true;

            try {

                await useAuthStore
                    .getState()
                    .clearSession();

                queryClient.clear();

            } finally {

                isHandling401 = false;

            }

        }

        return Promise.reject(error);

    },

);