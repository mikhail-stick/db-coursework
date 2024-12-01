import './SettingsMenu.css';
import classNames from "classnames";

import React from 'react';

import {useMenu} from "hooks";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {UserProfile} from "../../UserProfile/UserProfile";

export function SettingsMenu(): JSX.Element {

    const {setMenuItem} = useMenu();

    function handleGeneralSettingsClick(): void {
        setMenuItem('general settings');
    }

    return (
        <div className="left-container">
            <UserProfile/>
            <div className="content">
                <div className="item-preview" onClick={handleGeneralSettingsClick}>
                    <SettingsOutlinedIcon/>
                    <p>General settings</p>
                </div>
            </div>
        </div>
    );
}
