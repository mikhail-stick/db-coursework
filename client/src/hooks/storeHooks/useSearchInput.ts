import {useSelector, useDispatch} from "react-redux";
import {updateSearchActive, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface searchHook {
    isSearchInputActive: boolean;
    setSearchInputActive: (state: boolean | undefined) => void;
}

export function useSearchInput(): searchHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const isSearchInputActive: boolean = useSelector((state: RootState) => state.search.isSearchInputActive);

    const setSearchInputActive = (state?: boolean): void => {
        if (state) {
            dispatch(updateSearchActive(state));
        }
        else {
            dispatch(updateSearchActive(!isSearchInputActive));
        }
    }

    return {
        isSearchInputActive,
        setSearchInputActive
    };
}
