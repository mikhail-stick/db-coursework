import {useSelector, useDispatch} from "react-redux";
import {updateSocket, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface socketHook {
    socket: any;
    setSocket: (socket: any) => void;
}

export function useSocket(): socketHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const socket: any = useSelector((state: RootState) => state.socket.socket);

    const setSocket = (socket: any) => {
        dispatch(updateSocket(socket));
    }

    return {
        socket,
        setSocket
    };
}
