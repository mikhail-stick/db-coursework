import React, {ChangeEvent, useState} from 'react';
import './TextResizer.css';
import {useSettingsChanger} from "hooks";


export function TextResizer(): JSX.Element {

    const {text_size, setTextSize} = useSettingsChanger();

    const handleRangeInputChanging = (event: ChangeEvent): void => {

        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (event.target.classList.contains("range-input")) {
            setTextSize(target.value);
        }
    }


    return (
        <div className="text-resizer">
            <div className="setting-header">Message text size</div>
            <div className="range-input-wrapper">
                <input
                    defaultValue={text_size}
                    type="range"
                    min="12"
                    max="24"
                    className="range-input"
                    onChange={handleRangeInputChanging}/>
                <p>{text_size}</p>
            </div>
        </div>
    )
}