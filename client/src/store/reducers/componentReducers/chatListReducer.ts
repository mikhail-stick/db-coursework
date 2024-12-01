import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
    selectedChat: string | null;
    isVerticalChatNow: boolean;
}

const initialState: MenuState = {
    selectedChat: null,
    isVerticalChatNow: false
};

const menuReducer = createSlice({
    name: "chat_list",
    initialState,
    reducers: {
        updateSelectedChat: (state, action: PayloadAction<string | null>): void => {
            state.selectedChat = action.payload;
        },
        updateVerticalChat: (state, action: PayloadAction<boolean>): void => {
            state.isVerticalChatNow = action.payload;
        },
    }
});

export const {updateSelectedChat, updateVerticalChat} = menuReducer.actions;

export default menuReducer.reducer;
