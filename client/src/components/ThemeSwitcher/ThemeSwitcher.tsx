import React from 'react';
import './ThemeSwitcher.css';
import {LightMode, DarkMode} from '@mui/icons-material';
import {useSettingsChanger} from "hooks";


export function ThemeSwitcher(): JSX.Element {

    const {color_theme, setTheme} = useSettingsChanger();

    function handleLightThemeClick(): void {
        if (color_theme === "dark-theme") {
            setTheme('light-theme');
        }
    }

    function handleDarkThemeClick(): void {
        if (color_theme === 'light-theme') {
            setTheme('dark-theme');
        }
    }

    return (
        <>
            <p className='setting-header'>Theme</p>
            <ul className={`theme-switcher`}>
                <li className={`theme-switcher-element${color_theme === 'light-theme' ? ' active' : ''}`}
                    onClick={handleLightThemeClick}>
                    <LightMode className='theme-switcher-icon'/>
                    <p>Light</p>
                    <input type="checkbox" className='theme-switcher-checkbox'/>
                </li>
                <li className={`theme-switcher-element${color_theme === 'dark-theme' ? ' active' : ''}`}
                    onClick={handleDarkThemeClick}>
                    <DarkMode className='theme-switcher-icon'/>
                    <p>Dark</p>
                    <input type="checkbox" className='theme-switcher-checkbox'/>
                </li>

            </ul>
        </>
    )
}