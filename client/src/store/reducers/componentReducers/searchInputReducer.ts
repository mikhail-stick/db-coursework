import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface searchState {
    isSearchInputActive: boolean;
}

const initialState: searchState = {
    isSearchInputActive: false,
};

const searchInputReducer = createSlice({
    name: "header",
    initialState,
    reducers: {
        updateSearchActive: (state, action: PayloadAction<boolean>): void => {
            state.isSearchInputActive = action.payload;
        },
    }
});

export const {updateSearchActive} = searchInputReducer.actions;

export default searchInputReducer.reducer;
