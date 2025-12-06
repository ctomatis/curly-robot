import { api } from "@/services/api";
import { createSlice } from "@reduxjs/toolkit";

interface RateState {
    value: number
    status: "idle" | "fulfilled"
    currency: "ARS" | "USD"
    date?: string
}

const initialState: RateState = {
    value: 1,
    status: "idle",
    currency: "ARS"
}

const rateSlice = createSlice({
    name: 'rates',
    initialState,
    reducers: {
        switchCurrency(state) {
            state.currency = state.currency === 'ARS' ? 'USD' : 'ARS'
        },
    },
    extraReducers(builder) {
        builder.addMatcher(
            api.endpoints.getCurrencyRate.matchPending,
            (state) => {
                state.status = "idle"
            }
        ),
            builder.addMatcher(
                api.endpoints.getCurrencyRate.matchFulfilled,
                (state, { payload }) => {
                    state.date = payload.data.date
                    state.value = payload.data.rate
                    state.status = "fulfilled"
                }
            )
    },
});

export const { switchCurrency } = rateSlice.actions;
export default rateSlice.reducer;