import React from 'react';
import './ChatHeader.css';

interface ChatHeaderProps {
    chatName: string;
    chatPhoto: string;
}

export function ChatHeader(props: ChatHeaderProps): JSX.Element {

    const {chatName, chatPhoto} = props;

    return (
        <div className="chat-header">
            <div className="chat-photo">
                <img src={chatPhoto} alt="Chat Photo" />
            </div>
            <div className="chat-info">
                <h2>{chatName}</h2>
            </div>
            <div className="chat-search">
                <i className="fa fa-search"></i>
            </div>
        </div>
    );
}
