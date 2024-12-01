import './GeneralSettings.css';

import React from 'react';

import {ThemeSwitcher} from "../../ThemeSwitcher/ThemeSwitcher";
import {TextResizer} from "../../TextResizer/TextResizer";

export function GeneralSettings(): JSX.Element {

    return (
        <div className="left-container">
            <div className="settings-content">
                <ThemeSwitcher/>
                <TextResizer/>
            </div>
        </div>
    );
}
