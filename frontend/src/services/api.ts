import { Product } from '@/features/productSlice'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


type ApiResponse<T> = {
    data: {
        items: T
        total: number
    }
    code: number
    status: string
}

type Rate = {
    data: {
        date: string
        code: string
        rate: number
    }
    status: string
}

export interface FileParams {
    file: File
}

export interface FileResponse {
    code: number
    error: string
    message: string
    total: number
}

export interface Quote {
    date: string
    items: Product[]
}

export interface QuoteResponse {
    data: {
        ars: number
        usd: number
        weight: number
        count: number
    }
    status: string
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL, timeout: 10000 }),
    endpoints: (builder) => ({
        getStatus: builder.query<void, void>({
            query: () => '/health'
        }),
        getProducts: builder.query<ApiResponse<Product[]>, { id?: number }>({
            query: ({ id }) => {
                if (!id) return `product`
                return `product/${id}`
            },
        }),
        getCurrencyRate: builder.query<Rate, { date?: string, currency?: string | undefined }>({
            query: ({ date, currency }) => {
                return {
                    url: "rates",
                    params: { date, currency }
                }
            },
        }),
        uploadProducts: builder.mutation<FileResponse, FileParams>({
            query: ({ file }) => {
                const formData = new FormData();
                formData.append("file", file)
                return {
                    url: "upload",
                    method: 'POST',
                    body: formData
                }
            }
        }),
        createQuote: builder.mutation<QuoteResponse, Quote>({
            query: (body) => ({
                url: 'order',
                method: 'POST',
                body: body
            })
        })
    })
})


export const {
    useGetStatusQuery,
    useGetProductsQuery,
    useLazyGetProductsQuery,
    useCreateQuoteMutation,
    useGetCurrencyRateQuery,
    useUploadProductsMutation
} = api
