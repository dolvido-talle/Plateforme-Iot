import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {setUser, logoutUser} from "../store/slice/authSlice";

// Determine API base URL at runtime (supports build-time REACT_APP_API_URL and runtime window._env_ override)
const API_BASE_URL = (() => {
    // 1) runtime override via env.js mounted in the page
    if (typeof window !== "undefined" && window._env_ && window._env_.REACT_APP_API_URL) {
        return ensureApiUrl(window._env_.REACT_APP_API_URL);
    }

    // 2) build-time environment variable (injected at build)
    if (process.env.REACT_APP_API_URL) {
        return ensureApiUrl(process.env.REACT_APP_API_URL);
    }

    // 3) hostname mapping (user-provided mapping as fallback)
    const hostNames = {
        'pep-dev.devops-hors-prod.caas.cagip.group.gca': process.env.REACT_APP_API_URL_DEV,
        localhost: 'localhost:8000',
        // If you visited the frontend at 4.251.144.48 but want backend at 4.251.160.5, map it here
        '4.178.187.0.nip.io': 'https://4.178.187.0.nip.io/api/',
    };

    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        const hostname = window.location.hostname;
        const mapped = hostNames[hostname];
        if (mapped) {
            // allow mapped values like 'localhost:8000' or full urls
            const url = mapped.startsWith('http') ? mapped : `http://${mapped}`;
            return ensureApiUrl(url);
        }

        // 4) fallback: assume backend lives on same host at port 8000
        const protocol = window.location.protocol || 'http:';
        return `${protocol}//${hostname}/api/`;


    }

    // ultimate fallback for local dev
    return 'http://localhost:8000/api/';

    // helpers
    function ensureApiUrl(u) {
        if (!u) return 'http://localhost:8000/api/';
        // ensure protocol
        if (!u.startsWith('http')) u = 'http://' + u;
        // ensure it ends with '/api/'
        if (u.endsWith('/api/')) return u;
        if (u.endsWith('/api')) return u + '/';
        // if it already contains '/api' somewhere, normalize to end with '/'
        if (u.includes('/api')) {
            return u.replace(/\/*$/, '/');
        }
        // otherwise append /api/
        return u.replace(/\/*$/, '/') + 'api/';
    }
})();

export const testApi = createApi({
    reducerPath: "testApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        credentials: "include", // Permet d'envoyer les cookies avec les requêtes
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => "users/",
        }),
        getDevices: builder.query({
            query: () => "devices/",
            withCredentials: true,
        }),
        getCategories: builder.query({
            query: () => "category/",
        }),
        login: builder.mutation({
            query: ({email, password}) => ({
                url: "login/",
                method: "POST",
                body: {email, password},
                headers: {"Content-Type": "application/json"},
            }),
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setUser({email: args.email})); // Met à jour Redux
                } catch (error) {
                    console.error("Erreur de connexion:", error);
                }
            },
        }),
        signUp: builder.mutation({
            query: (data) => ({
                url: "users/",
                method: "POST",
                body: data,
                headers: {"Content-Type": "application/json"},
            }),
        }),
        async onQueryStarted(args, {queryFulfilled}) {
            try {
                await queryFulfilled;
            } catch (error) {
                if (error.error?.data?.detail) {
                    console.error("Erreur d'inscription :", error.error.data.detail);
                } else {
                    console.error("Erreur inconnue :", error);
                }
            }
        },
        logout: builder.mutation({
            query: () => ({
                url: "logout/",
                method: "POST",
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(logoutUser()); // Supprime l'utilisateur du store Redux
                } catch (error) {
                    console.error("Erreur de déconnexion:", error);
                }
            },
        }),
        refreshToken: builder.mutation({
            query: (refreshToken) => ({
                url: "refresh/",
                method: "POST",
                body: {refresh_token: refreshToken}, // Envoie le refresh token dans le body de la requête
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled; // Attends que la requête soit réussie
                    // Met à jour les tokens dans le store Redux
                    dispatch(
                        setUser({
                            accessToken: data.access,
                            refreshToken: data.refresh,
                        })
                    );
                } catch (error) {
                    console.error("Erreur lors du rafraîchissement du token:", error);
                    // Si une erreur se produit, tu peux gérer le cas ici, par exemple rediriger vers /login
                }
            },
        }),
        requestPasswordReset: builder.mutation({
            query: ({email}) => ({
                url: "reset-password/",
                method: "POST",
                body: {email},
            }),
        }),
        // 2) Confirmation du code + nouveau mot de passe
        confirmPasswordReset: builder.mutation({
            query: ({code, new_password}) => ({
                url: "confirm-password/",
                method: "POST",
                body: {code, new_password},
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetCategoriesQuery,
    useGetDevicesQuery,
    useLoginMutation,
    useSignUpMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    useRequestPasswordResetMutation,
    useConfirmPasswordResetMutation,
} = testApi;
