import "./DeleteMessageWindow.css";
import React from "react";
import {useChatList, useChatMessage} from "hooks";
import {socket} from "App";


export function DeleteMessageWindow(): JSX.Element {

    const {deletionMessage, setDeletionMessage} = useChatMessage();
    const {selectedChat} = useChatList();

    async function deleteMessage(): Promise<void> {

        await socket.emit("delete_message", {
            chat_id: selectedChat!,
            message_id: deletionMessage,
        });
        setDeletionMessage(null);
    }

    return (
        <div className="blocking-window">
            <div className="window-content">
                <div className="window-header">
                    <h2>Delete message for everyone?</h2>
                </div>
                <div className="form-buttons delete">
                    <button className="delete-button" onClick={deleteMessage}>DELETE</button>
                    <button onClick={() => setDeletionMessage(null)}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}
