import {combineReducers} from 'redux';
import {Reducer} from "react";

import searchInputReducer from '../componentReducers/searchInputReducer';
import menuReducer from "../componentReducers/menuReducer";
import chatListReducer from "../componentReducers/chatListReducer";
import contactListReducer from "../componentReducers/contactListReducer";
import themeSwitcherReducer from "../componentReducers/themeSwitcherReducer";
import messageReducer from "../componentReducers/messageReducer";
import groupChatReducer from "../componentReducers/groupChatReducer";
import socketReducer from "./socketReducer";
import imageUploaderReducer from "../componentReducers/imageUploaderReducer";


export const rootReducer: Reducer<any, any> = combineReducers({
    search: searchInputReducer,
    menu: menuReducer,
    chat_list: chatListReducer,
    contact_list: contactListReducer,
    socket: socketReducer,
    settings_changer: themeSwitcherReducer,
    message: messageReducer,
    group_chat: groupChatReducer,
    image_uploader: imageUploaderReducer
});

export type RootState = ReturnType<typeof rootReducer>;
