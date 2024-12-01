import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface socketState {
    socket: any;
}

const initialState: socketState = {
    socket: null
};

const socketReducer = createSlice({
    name: "socket",
    initialState,
    reducers: {
        updateSocket: (state, action: PayloadAction<any>): void => {
            state.socket = action.payload;
        }
    }
});

export const {updateSocket} = socketReducer.actions;

export default socketReducer.reducer;
