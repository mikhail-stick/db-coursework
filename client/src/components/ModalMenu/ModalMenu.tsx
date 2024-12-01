import React from 'react';
import './ModalMenu.css';
import { PersonOutlineOutlined, SettingsOutlined, InfoOutlined } from "@mui/icons-material";
import {useMenu} from "hooks";

export function ModalMenu(): JSX.Element {

    const {setMenuItem, setMenuItemActive} = useMenu();

    return (
        <>
            <div className="modal">
                <div className="menu">
                    <ul>
                        <li className="menu-item" onClick={() => {
                            setMenuItem('contacts')
                            setMenuItemActive(true);
                        }}>
                            <PersonOutlineOutlined className="menu-item-icon" /> Contacts
                        </li>
                        <li className="menu-item" onClick={() => {
                            setMenuItem('settings')
                            setMenuItemActive(true)
                        }}>
                            <SettingsOutlined className="menu-item-icon" /> Settings
                        </li>
                        <li className="menu-item" onClick={() => {
                            setMenuItem('about')
                            setMenuItemActive(true)
                        }}
                        ><InfoOutlined className="menu-item-icon" /> About
                        </li>
                    </ul>
                    <p className="description">SocialNetwork by @mikhail-stick.</p>
                </div>
            </div>
        </>
    );
}
