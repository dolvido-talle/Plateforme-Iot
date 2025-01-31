import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api/";
export const testApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `category/`,
    }),
  }),
});

export const { useGetCategoriesQuery } = testApi;
