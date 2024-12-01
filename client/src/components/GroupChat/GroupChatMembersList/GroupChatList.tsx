import './GroupChatList.css';
import React from 'react';

import {ArrowForward, PersonAdd} from "@mui/icons-material";
import {useContactList, useGroupChat, useMenu, useUserContacts} from "hooks";
import {useAuth} from "../../../contexts/Auth/AuthContext";
import {ContactDTO} from "../../../repositories";
import {NewMember} from "../../../store/reducers";


export function GroupChatList(): JSX.Element {

    const {user} = useAuth();
    const {user_contacts} = useUserContacts(user!._id);
    const {setContactFormOpen} = useContactList();
    const {setMenuItem} = useMenu();
    const {setNewMember, removeNewMember, findNewMember} = useGroupChat();

    const handleAddContactClick = (): void => {
        setContactFormOpen();
    };

    const handleContinueClick = (): void => {
        setMenuItem('new_group_info');
    }

    const handleContactPreviewClick = (newMember: ContactDTO): void => {

        const member: NewMember = {
            id: newMember._id,
            name: newMember.username
        }

        if (findNewMember(member)) {
            removeNewMember(member);
        }
        else {
            setNewMember(member);
        }

    }

    const isContactToggled = (contact: ContactDTO) : boolean => {
        const member: NewMember = {
            id: contact._id,
            name: contact.username
        }
        return findNewMember(member);
    }

    const image_url = 'https://avatars.mds.yandex.net/i?id=5d8db0440aae4c3265492d1b3f8de64dddf64453-8342484-images-thumbs&n=13';

    return (
        <>
            <div className="left-container contacts-container">
                {user_contacts!.length ?
                    <div className="contact-list-content">
                        {user_contacts!.map((contact: ContactDTO) => (

                            <div
                                key={contact._id}
                                className={`contact-preview new-contact${isContactToggled(contact) ? " chosen" : ""}`}
                                onClick={() => {
                                handleContactPreviewClick(contact)
                            }}>
                                <input
                                    className="contacts-checkbox"
                                    type="checkbox"
                                    checked={isContactToggled(contact)}
                                    onChange={() => {}}
                                />
                                <img src={image_url} alt={contact.username} className="contact-image" />
                                <div className="contact-info" >
                                    <h3 className="contact-name">{contact.username}</h3>
                                </div>
                            </div>
                        ))}
                        <button className={"add-contact-btn"} onClick={handleContinueClick}><ArrowForward /></button>
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
