import React, {useState} from 'react';
import './ChatMessage.css';
import {useSettingsChanger, useChatMessage} from "../../../hooks";

import {EditOutlined, DeleteOutlined} from "@mui/icons-material";

interface ChatMessageProps {
    message_id: string;
    message: string;
    isMyMessage: boolean;
    is_edited: boolean;
    time: string;
}

export function ChatMessage(props: ChatMessageProps): JSX.Element {

    const {message_id, message, isMyMessage, time, is_edited} = props;
    const {text_size} = useSettingsChanger();

    const {deleteWindowMessage, setDeleteWindow} = useChatMessage();
    const {setEditingMessage, setDeletionMessage} = useChatMessage();

    function handleContextMenuClick(event: React.MouseEvent<HTMLDivElement>): void {
        event.preventDefault();
        if (deleteWindowMessage != message_id) {
            setDeleteWindow(message_id);
        }
    }

    function handleEditClick(): void {
        setEditingMessage({id: message_id, text: message});
    }

    function handleDeleteCLick(): void {
        setDeletionMessage(message_id);
    }

    return (

        <div
            className={`chat-message${isMyMessage ? " right" : " left"}`}
            onContextMenu={handleContextMenuClick}>
            <p style={{fontSize: `${text_size}px`}}>{message}</p>
            <span className="message-time">{is_edited ? "edited " : ""}{time}</span>

            {deleteWindowMessage == message_id &&
                <div className={`delete-menu-down ${isMyMessage ? " right": " left"}`}>
                    <ul>
                        {isMyMessage &&
                            <li className='menu-item' onClick={handleEditClick}>
                                <EditOutlined className='menu-item-icon'/>
                                <p>Edit</p>
                            </li>
                        }
                        <li className='menu-item' style={{color: "#e53935"}} onClick={handleDeleteCLick}>
                            <DeleteOutlined className='menu-item-icon'/>
                            <p>Delete</p>
                        </li>
                    </ul>
                </div>
            }

        </div>
    );
}
