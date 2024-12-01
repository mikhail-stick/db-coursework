import './Home.css';
import React from 'react';
import {CSSTransition} from "react-transition-group";

import {useChatList, useHeader, useMenu, useUserChats, useUserContacts, useContactList, useChatMessage} from "hooks";

import {useEffect} from "react";
import {useAuth} from "../../contexts/Auth/AuthContext";
import {
    HorizontalChatList,
    VerticalChatList,
    Header,
    ChatWindow,
    ContactList,
    NewContactWindow,
    SettingsMenu,
    GeneralSettings,
    GroupChatList, GroupChatInfo, ProfileSettings
} from "components";
import {DeleteMessageWindow} from "../../components/Chat/ChatMessage/DeleteMessageWIndow/DeleteMessageWindow";


interface HomeProps {
    socket: any;
}

export function Home({socket}: HomeProps): JSX.Element {

    const {user} = useAuth();
    const {isVerticalChatNow, selectedChat, setSelectedChat} = useChatList();
    const {handleOutsideClick} = useHeader();
    const {menuItem} = useMenu();
    const {isContactFormOpen, setContactFormOpen, setContactError} = useContactList();
    const {deletionMessage} = useChatMessage();

    const {
        isChatsLoading,
        isChatError,
        user_chats,
        chat_error,
        refresh_chats,
    } = useUserChats(user!._id);

    const {
        isContactsLoading,
        isContactsError,
        user_contacts,
        contacts_error,
        refresh_contacts,
    } = useUserContacts(user!._id);


    useEffect(() => {

        socket.on("receive_message", () => {
            refresh_chats().catch();
        });

        socket.on("new_contact", (data: {error: string | boolean; chat_id?: string}) => {

            if (data.error === false) {

                refresh_contacts().then(() => {
                    socket.emit('join_chat', data.chat_id as string);
                    setContactFormOpen(false);
                    setContactError("null");
                    setSelectedChat(data.chat_id as string);
                    refresh_chats();
                })


            } else {
                setContactError(data.error as string);
            }
        });
    }, [socket, refresh_chats, refresh_contacts]);

    return (
        <div className="home-page" onClick={handleOutsideClick}>
            <div className="left-menu">
                <Header/>
                {
                    menuItem ?
                        <>
                            {!isContactsLoading ?
                                <>
                                    {menuItem === "contacts" &&  <ContactList/>}
                                    {menuItem === "settings" && <SettingsMenu/>}
                                    {menuItem === "general settings" && <GeneralSettings/>}
                                    {menuItem === "new_group" && <GroupChatList/>}
                                    {menuItem === "new_group_info" && <GroupChatInfo/>}
                                    {menuItem === "profile settings" && <ProfileSettings/>}
                                </>
                                :
                                <div>Loading...</div>
                            }

                        </>
                        :
                        <>
                            {!isChatsLoading ?
                                <>
                                    {isVerticalChatNow ?
                                        <VerticalChatList/>
                                        :
                                        <HorizontalChatList/>
                                    }
                                </>
                                :
                                <div>Loading</div>
                            }

                        </>
                }
            </div>
            {selectedChat ?
                <div className="chat-window">
                    <ChatWindow/>
                </div>
                :
                <div className="no-chat-window">
                    <p>Choose chat to start messaging!</p>
                </div>
            }

            {isContactFormOpen && <NewContactWindow/>}
            {deletionMessage && <DeleteMessageWindow/>}

        </div>
    )
}
