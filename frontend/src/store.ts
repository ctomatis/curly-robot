import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'
import productReducer from '@/features/productSlice';
import rateReducer from '@/features/rateSlice';


export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        product: productReducer,
        rate: rateReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
