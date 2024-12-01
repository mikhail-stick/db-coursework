import './ContactList.css';
import React from 'react';

import {PersonAdd} from "@mui/icons-material";
import {useChatList, useContactList, useUserContacts} from "hooks";
import {useAuth} from "../../../contexts/Auth/AuthContext";
import {ContactDTO} from "../../../repositories";


export function ContactList(): JSX.Element {

    const {user} = useAuth();
    const {user_contacts} = useUserContacts(user!._id);
    const {setSelectedChat} = useChatList();
    const {setContactFormOpen} = useContactList();

    const handleAddContactClick = (): void => {
        setContactFormOpen();
    };

    return (
        <>
            <div className="left-container contacts-container">
                {user_contacts!.length ?
                    <div className="contact-list-content">
                        {user_contacts!.map((contact: ContactDTO) => (
                            <div key={contact._id} className="contact-preview" onClick={() => {
                                setSelectedChat(contact.chat_id);
                            }}>
                                <img src={URL.createObjectURL(contact.image)} alt={contact.username} className="contact-image" />
                                <div className="contact-info" >
                                    <h3 className="contact-name">{contact.username}</h3>
                                </div>
                            </div>
                        ))}
                        <button className={"add-contact-btn"} onClick={handleAddContactClick}><PersonAdd /></button>
                    </div>

                    :
                    <div className="no-user-contacts">
                        <p>No contacts yet.</p>
                        <button className={"add-contact-btn"} onClick={handleAddContactClick}><PersonAdd /></button>
                    </div>
                }
            </div>
        </>
    );
}
