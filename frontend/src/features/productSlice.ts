import { api, QuoteResponse } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Product {
    id: number
    name: string
    parent_id?: number
    price?: number
    slug: string
    weight?: number
    unit_price?: number
}

interface ProductState {
    recipe?: string,
    selected: Product | null
    items: Product[]
    dish: Product[]
    quote: QuoteResponse | null
}

const initialState: ProductState = {
    selected: null,
    items: [],
    dish: [],
    quote: null
}

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setRecipeName(state, action: PayloadAction<string>) {
            state.recipe = action.payload
        },
        addItem(state, action: PayloadAction<{ product: Product, index: number }>) {
            const n = state.items.length
            state.selected = null
            if (n === 0) {
                state.items.push(action.payload.product)
            } else {
                state.items[action.payload.index] = action.payload.product
                state.items.splice(action.payload.index + 1)
            }
        },
        addProduct(state, action: PayloadAction<Product>) {
            state.selected = action.payload
        },
        addProductToDish(state, action: PayloadAction<number>) {
            if (state.selected?.id) {
                const idx = state.dish.findIndex(item => item.id === state.selected?.id)
                if (idx > -1 && state.dish[idx].weight) {
                    state.dish[idx].weight += action.payload
                } else {
                    state.selected.weight = action.payload;
                    state.dish.push(state.selected)
                }
                state.items = []
                state.selected = null
            }
        },
        removeProductFromDish(state, action: PayloadAction<number | undefined>) {
            if (action.payload) {
                if (state.dish.length > 0 && action.payload > -1) {
                    state.dish.splice(action.payload, 1);
                }
            } else {
                state.dish = []
            }
        },
        resetState: () => initialState,
    },
    extraReducers(builder) {
        builder.addMatcher(
            api.endpoints.createQuote.matchFulfilled,
            (state, { payload }) => {
                state.quote = payload
            }
        )
    },
});

export const { setRecipeName, addItem, addProduct, addProductToDish, removeProductFromDish, resetState } = productSlice.actions;
export default productSlice.reducer;