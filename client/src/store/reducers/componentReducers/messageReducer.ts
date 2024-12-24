import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface messageState {
    messageWithDeleteWindow: string | null;
    editingMessage: {id: string, text: string} | null;
    deletionMessage: string | null;
}

const initialState: messageState = {
    messageWithDeleteWindow: null,
    editingMessage: null,
    deletionMessage: null
};

const messageReducer = createSlice({
    name: "message",
    initialState,
    reducers: {
        updateDeleteWindowMessage: (state, action: PayloadAction<string | null>): void => {
            state.messageWithDeleteWindow = action.payload;
        },
        updateEditingMessage: (state, action: PayloadAction<{id: string, text: string} | null>): void => {
            state.editingMessage = action.payload;
        },
        updateDeletionMessage: (state, action: PayloadAction<string | null>): void => {
            state.deletionMessage = action.payload;
        },
    }
});

export const {updateDeleteWindowMessage, updateEditingMessage, updateDeletionMessage} = messageReducer.actions;

export default messageReducer.reducer;
