import { apiSlice } from "./apiSlice";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (userId) => {
        return {
          url: `messages/${userId}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useGetMessagesQuery } = messageApiSlice;
