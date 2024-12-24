import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
    menuItem: string | null;
    isMenuItemActive: boolean;
    isMenuOpen: boolean;
}

const initialState: MenuState = {
    menuItem: null,
    isMenuItemActive: false,
    isMenuOpen: false
};

const menuReducer = createSlice({
    name: "menu",
    initialState,
    reducers: {
        updateMenuItem: (state, action: PayloadAction<string | null>): void => {
            state.menuItem = action.payload;
        },
        updateMenuItemActive: (state, action: PayloadAction<boolean>): void => {
            state.isMenuItemActive = action.payload;
        },
        updateMenuOpen: (state, action: PayloadAction<boolean>): void => {
            state.isMenuOpen = action.payload;
        }
    }
});

export const { updateMenuItem, updateMenuOpen, updateMenuItemActive } = menuReducer.actions;

export default menuReducer.reducer;
