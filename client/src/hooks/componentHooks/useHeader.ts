import {useMenu, useSearchInput, useChatList, useChatMessage, useGroupChat, useImageUploader} from "hooks";

interface HeaderHook {
    menuItem: string | null;
    isSearchInputActive: boolean;
    isMenuItemActive: boolean;
    isMenuOpen: boolean;
    handleBackButtonClick: () => void;
    handleSearchbarClick: () => void;
    handleMenuButtonClick: () => void;
    setMenuItemActive: (state?: boolean) => void;
    handleOutsideClick: (event: any) => any;
    setIsVerticalChat: (state?: boolean) => void;
    setMenuItem: (state: string | null) => void;
}

export function useHeader(): HeaderHook {

    const {menuItem, isMenuItemActive, isMenuOpen, setMenuActive, setMenuItemActive, setMenuItem} = useMenu();
    const {isSearchInputActive, setSearchInputActive} = useSearchInput();
    const {setIsVerticalChat} = useChatList();
    const {setDeleteWindow} = useChatMessage();
    const {setMembers} = useGroupChat();

    const handleBackButtonClick = (): void => {

        if (isMenuItemActive) {
            if (menuItem == "new_group") setMembers([]);
            if (menuItem === "general settings" || menuItem === "profile settings") {
                setMenuItem("settings");
            }
            else if (menuItem == "new_group_info") {
                setMenuItem("new_group");
            }
            else {
                setMenuItemActive(false);
                setMenuItem(null);
                setIsVerticalChat(true);
            }
        }
        else {
            setSearchInputActive(!isSearchInputActive);
        }

    };

    const handleSearchbarClick = (): void => {
        if (!isSearchInputActive) {
            setSearchInputActive(true);
        }
    };

    const handleMenuButtonClick = (): void => {
        setMenuActive(!isMenuOpen);
    };

    const handleOutsideClick = (event: MouseEvent): void => {
        const target: HTMLElement = event.target as HTMLElement;
        if (!target.classList.contains("search-input") && !target.classList.contains("header-button")) {
            if (isSearchInputActive) setSearchInputActive(false);

            if (isMenuOpen || target.tagName === "path") {
                setMenuActive(false);
            }
        }

        if(!target.classList.contains('menu-item')) {
            setDeleteWindow(null);
        }
    };

    return {
        menuItem,
        isSearchInputActive,
        isMenuOpen,
        isMenuItemActive,
        handleBackButtonClick,
        handleSearchbarClick,
        handleMenuButtonClick,
        handleOutsideClick,
        setMenuItemActive,
        setIsVerticalChat,
        setMenuItem
    };
}
