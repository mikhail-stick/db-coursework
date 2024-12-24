import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface searchState {
    theme: string;
    text_size: string;
}

const initialState: searchState = {
    theme: localStorage.getItem('theme') || 'light-theme',
    text_size: localStorage.getItem('text_size') || '16'
};

const settingsChangerReducer = createSlice({
    name: "theme-switcher",
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<string>): void => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
        },

        updateTextSize: (state, action: PayloadAction<string>): void => {
            state.text_size = action.payload;
            localStorage.setItem('text_size', state.text_size);
        },
    }
});

export const {updateTheme, updateTextSize} = settingsChangerReducer.actions;

export default settingsChangerReducer.reducer;
