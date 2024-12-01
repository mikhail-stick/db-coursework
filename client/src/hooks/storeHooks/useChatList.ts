import {useSelector, useDispatch} from "react-redux";
import {updateSelectedChat, updateVerticalChat, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface chatListHook {
    selectedChat: string | null;
    isVerticalChatNow: boolean;
    setIsVerticalChat: (state?: boolean | undefined) => void;
    setSelectedChat: (chat: string | null) => void;
}

export function useChatList(): chatListHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const selectedChat: string | null = useSelector((state: RootState) => state.chat_list.selectedChat)
    const isVerticalChatNow: boolean = useSelector((state: RootState) => state.chat_list.isVerticalChatNow)

    const setSelectedChat = (chat: string | null): void => {
        dispatch(updateSelectedChat(chat));
    };

    const setIsVerticalChat = (state?: boolean): void => {

        if (state) {
            dispatch(updateVerticalChat(state));
        }
        else {
            dispatch(updateVerticalChat(!isVerticalChatNow));
        }
    }

    return {
        selectedChat,
        isVerticalChatNow,
        setIsVerticalChat,
        setSelectedChat
    };
}
