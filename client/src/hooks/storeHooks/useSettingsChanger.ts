import {useSelector, useDispatch} from "react-redux";
import {updateTheme, RootState, updateTextSize} from "../../store/reducers/index";
import {Dispatch} from "react";
import {AnyAction} from "redux";

interface switcherHook {
    color_theme: string;
    setTheme: (value: string) => void;
    text_size: string;
    setTextSize: (value: string) => void;
}

export function useSettingsChanger(): switcherHook {
    const dispatch: Dispatch<AnyAction> = useDispatch();
    const color_theme: string = useSelector((state: RootState) => state.settings_changer.theme);
    const text_size: string = useSelector((state: RootState) => state.settings_changer.text_size);

    const setTheme = (value: string): void => {
        dispatch(updateTheme(value));
    }

    const setTextSize = (value: string): void => {
        dispatch(updateTextSize(value));
    }

    return {
        color_theme,
        text_size,
        setTheme,
        setTextSize
    };
}
