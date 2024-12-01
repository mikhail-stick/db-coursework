import {useSelector, useDispatch} from "react-redux";
import {updateMenuItem, updateMenuOpen, updateMenuItemActive, RootState} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface MenuHook {
    menuItem: string | null;
    isMenuItemActive: boolean;
    isMenuOpen: boolean;
    setMenuActive: (state: boolean) => void;
    setMenuItem: (item: string | null) => void;
    setMenuItemActive: (state: boolean | undefined) => void;
}

export function useMenu(): MenuHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const menuItem: string | null = useSelector((state: RootState) => state.menu.menuItem);
    const isMenuOpen: boolean = useSelector((state: RootState) => state.menu.isMenuOpen);
    const isMenuItemActive: boolean = useSelector((state: RootState) => state.menu.isMenuItemActive);

    const setMenuItem = (item: string | null): void => {
        dispatch(updateMenuItem(item));
    };

    const setMenuActive = (state: boolean): void => {
        dispatch(updateMenuOpen(state));
    }

    const setMenuItemActive = (state?: boolean): void => {
        if (state) {
            dispatch(updateMenuItemActive(state));
        }
        else {
            dispatch(updateMenuItemActive(!isMenuItemActive));
        }
    }

    return {
        menuItem,
        isMenuOpen,
        isMenuItemActive,
        setMenuActive,
        setMenuItem,
        setMenuItemActive
    };
}
