import './HorizontalChatList.css';

import React from 'react';
import {socket} from "App";

import {useChatList, useUserChats} from "hooks";
import {useAuth} from "../../../contexts/Auth/AuthContext";
import {ChatDTO} from "../../../repositories";

export function HorizontalChatList(): JSX.Element {

    const {user} = useAuth();
    const {user_chats} = useUserChats(user!._id);
    const {setSelectedChat} = useChatList();

    return (
        <div className="horizontal-chat-list">
            {user_chats!.length ? (
                <div className="horizontal-chat-list-content">
                    {user_chats!.map((chat: ChatDTO) => (
                        <div
                            key={chat._id}
                            className="horizontal-chat-preview"
                            onClick={() => {
                                socket.emit('join_chat', chat._id);
                                setSelectedChat(chat._id);
                            }}
                        >
                            <img
                                src={URL.createObjectURL(chat.image)}
                                alt={chat.name}
                                className="horizontal-chat-image"
                            />
                            <h3 className="horizontal-chat-name">{chat.name}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
