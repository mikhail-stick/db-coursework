import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
    isContactFormOpen: boolean;
    contactError: string | null;
}

const initialState: MenuState = {
    isContactFormOpen: false,
    contactError: null
};

const contactListReducer = createSlice({
    name: "contact_list",
    initialState,
    reducers: {
        updateContactFormOpen: (state, action: PayloadAction<boolean>): void => {
            state.isContactFormOpen = action.payload;
        },
        updateContactError: (state, action: PayloadAction<string | null>): void => {
            state.contactError = action.payload;
        },
    }
});

export const {updateContactFormOpen, updateContactError} = contactListReducer.actions;

export default contactListReducer.reducer;
