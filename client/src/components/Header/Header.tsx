import "./Header.css";
import {Search, Dehaze, ArrowBack, CreateOutlined, MoreVert} from "@mui/icons-material";
import React, {useEffect} from "react";

import {ModalMenu} from "components";

import {useHeader, useGroupChat} from "hooks";
import {NewMember} from "../../store/reducers";

export function Header(): JSX.Element {

    const {
        menuItem,
        isSearchInputActive,
        isMenuOpen,
        isMenuItemActive,
        handleBackButtonClick,
        handleSearchbarClick,
        handleMenuButtonClick,
        setIsVerticalChat,
        setMenuItem
    } = useHeader();

    const {newMembers, removeNewMember} = useGroupChat();

    const image_url: string = 'https://avatars.mds.yandex.net/i?id=5d8db0440aae4c3265492d1b3f8de64dddf64453-8342484-images-thumbs&n=13';

    useEffect(() => {
        setIsVerticalChat();
    }, [isSearchInputActive])

    return (
        <div className={`header-container-outer${newMembers.length && menuItem == 'new_group' ? " higher" : ""}`}>
            <div className={`header-container`}>
                <div className="header-buttons">
                    <div className={isMenuOpen ? "main-menu" : "main-menu disappear"}>
                        <ModalMenu/>
                    </div>
                    { !isSearchInputActive ?
                        <>
                            { !isMenuItemActive ?
                                <Dehaze
                                    className={`header-button${isMenuOpen ? ' rotate-out' : ' rotate-in'}`}
                                    onClick={handleMenuButtonClick}
                                />
                                :
                                <ArrowBack
                                    className={`header-button rotate-in`}
                                    onClick={handleBackButtonClick}
                                />
                            }
                        </>
                        :
                        <ArrowBack
                            className={`header-button${!isSearchInputActive ? ' rotate-out' : ' rotate-in'}`}
                            onClick={handleBackButtonClick}
                        />
                    }
                </div>
                {menuItem && menuItem !== 'contacts' ?
                    <div className={"header-menu-item"}>
                        {menuItem != 'new_group' && menuItem != 'new_group_info'
                            && menuItem.charAt(0).toUpperCase() + menuItem.slice(1)}
                        {menuItem == 'new_group' && 'Add Members'}
                        {menuItem == 'new_group_info' && 'New Group'}
                        {menuItem === 'settings' &&
                            <div className={"header-menu-item-icons"}>
                                <CreateOutlined onClick={() => setMenuItem('profile settings')}/>
                                <MoreVert/>
                            </div>
                        }
                    </div>
                    :
                    <div className="searchbar">
                        <Search className={`search-icon`} />
                        <input
                            placeholder="Search"
                            className="search-input"
                            onClick={handleSearchbarClick}
                        />
                    </div>
                }
            </div>
            {menuItem === "new_group" &&
                <>
                    {
                        newMembers.length ?
                            <div className="header-contacts">
                                {newMembers.map((member: NewMember) => (
                                    <div
                                        key={member.id}
                                        className="new-header-contact-preview"
                                        onClick={() => removeNewMember(member)}
                                    >
                                        <img
                                            src={image_url}
                                            alt={member.name}
                                            className="new-header-contact-image"
                                        />
                                        <h3 className="new-header-contact-name">{member.name}</h3>
                                    </div>
                                ))}
                            </div>
                            :
                            <></>
                    }
                </>
            }
        </div>
    );
}