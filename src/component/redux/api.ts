import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath : 'api',
    baseQuery : fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api/',
    }),
    endpoints : (builder : any) => ({
        getAllCategory : builder.query({
            query : () => 'get-all-category',
        }),
        addProvider : builder.mutation({
            query : (data : any) => ({
                url : 'add-provider',
                method : 'POST',
                body : data,
            })
        }),
        addCategories : builder.mutation({
            query : (data : any) => ({
                url : 'categories',
                method : 'POST',
                body : data,
            })
        }),
        updateCategory : builder.mutation({
            query : (data : any) => ({
                url : 'update-category',
                method : 'PUT',
                body : data,
            })
        })
    }),
})

export const {
    useGetAllCategoryQuery, 
    useAddProviderMutation,
    useAddCategoriesMutation,
    useUpdateCategoryMutation
} = api;

export default api.reducer;