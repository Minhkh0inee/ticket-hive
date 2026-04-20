import type { EventCategory } from "@/types/event.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categories: EventCategory[],
    isLoading: boolean,
    error: string | null
}

const initialState: CategoryState = {
    categories: [],
    isLoading: false,
    error: null
}

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        fetchCategoryRequest: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchCategorySuccess: (state, action: PayloadAction<EventCategory[]>) => {
            state.categories = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        fetchCategoryFailed: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        }
    }
})

export const { fetchCategoryRequest, fetchCategorySuccess, fetchCategoryFailed } = categorySlice.actions
export default categorySlice.reducer