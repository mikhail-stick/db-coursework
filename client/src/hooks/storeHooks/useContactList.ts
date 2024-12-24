import {useSelector, useDispatch} from "react-redux";
import {updateContactError, updateContactFormOpen, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";
import {useAuth} from "../../contexts/Auth/AuthContext";
import {socket} from "App";

interface contactListHook {
    isContactFormOpen: string | null;
    contactError: boolean;
    setContactFormOpen: (state?: boolean | undefined) => void;
    setContactError: (chat: string | null) => void;
    closeNewContactWindow: () => void;
    addNewContact: (contact_number: string) => Promise<void>;
}

export function useContactList(): contactListHook {

    const dispatch: Dispatch<AnyAction> = useDispatch();
    const isContactFormOpen: string | null = useSelector((state: RootState) => state.contact_list.isContactFormOpen);
    const contactError: boolean = useSelector((state: RootState) => state.contact_list.contactError);
    const {user} = useAuth();

    const setContactFormOpen = (state?: boolean): void => {

        if (state) {
            dispatch(updateContactFormOpen(state));
        }
        else {
            dispatch(updateContactFormOpen(!isContactFormOpen));
        }
    }

    const setContactError = (error: string | null): void => {
        dispatch(updateContactError(error));
    }

    const closeNewContactWindow = (): void => {
        setContactFormOpen(false);
        setContactError(null);
    };

    async function addNewContact(contact_number: string): Promise<void> {

        await socket.emit("add_contact", {
            socket_id: socket.id,
            user_id: user!._id,
            new_contact_number: contact_number,
        });
    }

    return {
        isContactFormOpen,
        contactError,
        setContactFormOpen,
        setContactError,
        closeNewContactWindow,
        addNewContact
    };
}
