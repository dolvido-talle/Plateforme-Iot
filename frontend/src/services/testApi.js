import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, logoutUser } from "../store/slice/authSlice";

export const testApi = createApi({
  reducerPath: "testApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
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
      query: ({ email, password }) => ({
        url: "login/",
        method: "POST",
        body: { email, password },
        headers: { "Content-Type": "application/json" },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ email: args.email })); // Met à jour Redux
        } catch (error) {
          console.error("Erreur de connexion:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout/",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
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
        body: { refresh_token: refreshToken }, // Envoie le refresh token dans le body de la requête
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Attends que la requête soit réussie
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
  }),
});

export const {
  useGetUsersQuery,
  useGetCategoriesQuery,
  useGetDevicesQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = testApi;
