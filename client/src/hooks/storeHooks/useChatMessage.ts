import {useSelector, useDispatch} from "react-redux";
import {updateDeleteWindowMessage, updateEditingMessage, updateDeletionMessage, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface chatMessageHook {
    deleteWindowMessage: string | null;
    editingMessage: {id: string, text: string} | null;
    deletionMessage: string | null;
    setDeleteWindow: (message_id: string | null) => void;
    setEditingMessage: (message_id: {id: string, text: string} | null) => void;
    setDeletionMessage: (message_id: string | null) => void;
}

export function useChatMessage(): chatMessageHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const deleteWindowMessage: string | null = useSelector((state: RootState) => state.message.messageWithDeleteWindow);
    const editingMessage: {id: string, text: string} | null = useSelector((state: RootState) => state.message.editingMessage);
    const deletionMessage: string | null = useSelector((state: RootState) => state.message.deletionMessage);

    const setDeleteWindow = (message_id: string | null): void => {
        dispatch(updateDeleteWindowMessage(message_id));
    };

    const setEditingMessage = (message_id: {id: string, text: string} | null): void => {
        dispatch(updateEditingMessage(message_id));
    }

    const setDeletionMessage = (message_id: string | null): void => {
        dispatch(updateDeletionMessage(message_id));
    }


    return {
        deleteWindowMessage,
        editingMessage,
        deletionMessage,
        setDeleteWindow,
        setEditingMessage,
        setDeletionMessage
    };
}
