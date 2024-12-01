import React, {useEffect, useState} from 'react';
import {Send, EditOutlined, Close, Done} from "@mui/icons-material";
import './MessageForm.css';

import {useChatMessage} from "../../../hooks";

interface MessageFormProps {
    submitFunc: (message: string) => void;
}

export function MessageForm(props: MessageFormProps): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const {editingMessage, setDeleteWindow, setEditingMessage} = useChatMessage();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setMessage(event.target.value);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        props.submitFunc(message);
        setMessage('');
    }

    const handleCancel = (): void => {
        setEditingMessage(null);
        setMessage('');
    }

    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.text);
            setDeleteWindow(null);
        }

    }, [editingMessage])

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <div className="message-input">
                {editingMessage &&
                    <div className="editing-message-preview">
                        <EditOutlined className="editing-message-icon"/>
                        <div className="editing-message-text-wrapper">
                            <div className="editing-message-text">
                                <p>Edit Message</p>
                                <small>{editingMessage.text}</small>
                            </div>
                        </div>
                        <Close className="editing-message-close-icon" onClick={handleCancel}/>
                    </div>
                }
                <input
                    type="text"
                    placeholder="Message"
                    value={message}
                    onChange={handleChange}
                />
            </div>

            <button className="send-button" type="submit">
                {editingMessage ? <Done/> : <Send />}
            </button>
        </form>
    );
}
