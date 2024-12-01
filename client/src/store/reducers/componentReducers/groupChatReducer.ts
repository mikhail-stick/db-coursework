import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NewMember {
    id: string;
    name: string;
}
interface GroupChatState {
    newMembers: NewMember[];
}

const initialState: GroupChatState = {
    newMembers: []
};

const groupChatReducer = createSlice({
    name: "group_chat",
    initialState,
    reducers: {
        updateNewMembers: (state, action: PayloadAction<NewMember[]>): void => {
            state.newMembers = action.payload;
        },
    }
});

export const {updateNewMembers} = groupChatReducer.actions;

export default groupChatReducer.reducer;
