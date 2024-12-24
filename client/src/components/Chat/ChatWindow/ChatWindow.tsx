import './ChatWindow.css';

import React, {useEffect} from 'react';
import {ChatHeader, ChatMessage, MessageForm} from 'components';
import {socket} from "App";

import {useChatMessages, useChatInfo, useChatList, useUserChats, useChatMessage, useMenu} from 'hooks';
import {useAuth} from "../../../contexts/Auth/AuthContext";
import {MessageDTO} from "../../../repositories";


export function ChatWindow(): JSX.Element {

    const {user} = useAuth();
    const {selectedChat} = useChatList();
    const {refresh_chats} = useUserChats(user!._id)
    const {editingMessage, setEditingMessage} = useChatMessage();

    const {
        isMessagesLoading,
        isMessagesError,
        chat_messages,
        messages_error,
        refresh_messages,
    } = useChatMessages(selectedChat!);

    const {
        isChatInfoLoading,
        isChatInfoError,
        chat_info,
        chat_info_error,
        refresh_chat_info,
    } = useChatInfo(user!._id, selectedChat!);

    const {setMenuItem, setMenuItemActive} = useMenu();
    async function sendMessage(currentMessage: string): Promise<void> {

        if (currentMessage) {

            if (editingMessage) {

                const messageData = {
                    chat_id: selectedChat!,
                    message_id: editingMessage.id,
                    text: currentMessage
                }
                await socket.emit("edit_message", messageData);
                setEditingMessage(null);
            }
            else {

                const messageData = {
                    chat_id: selectedChat!,
                    sender_id: user!._id,
                    text: currentMessage,
                };
                console.log(messageData);
                await socket.emit('send_message', messageData);
            }

        }
    }

    useEffect(() => {

        socket.on('messages_changed', async (): Promise<void> => {
            await refresh_messages();
            await refresh_chats();
        });

        socket.on('new_group_chat', async (): Promise<void> => {
            console.log('aaa');
            await refresh_messages();
            await refresh_chats();
            console.log('aaa');
            setMenuItem(null);
            setMenuItemActive(false);
        });



    }, [socket]);

    return (
        <div className="chat-window">
            {!isChatInfoLoading ? (
                <>
                    <ChatHeader chatName={chat_info.name} chatPhoto={URL.createObjectURL(chat_info.image)} />
                    <div className="chat-messages">
                        {!isMessagesLoading ? (
                            <>
                                {chat_messages.map((message: MessageDTO) => (
                                    <ChatMessage
                                        key={message._id}
                                        message_id={message._id}
                                        message={message.text}
                                        is_edited={message.is_edited}
                                        isMyMessage={message.sender_id === user!._id}
                                        time={message.time}
                                    />
                                ))}
                            </>
                        ) : (
                            <div style={{ color: 'white' }}>Loading...</div>
                        )}
                    </div>
                    <MessageForm submitFunc={sendMessage} />
                </>
            ) : (
                <div style={{ color: 'white' }}>Loading...</div>
            )}
        </div>
    );
}
