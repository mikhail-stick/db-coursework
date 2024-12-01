import {ObjectId} from "mongodb";

import {chat_messages, DB} from './Database'
import {User} from "./User";
import {Chat} from "./Chats/Chat";


export interface MessageType {
    _id?: ObjectId | null,
    text: string,
    sender_id: ObjectId,
    sender_username: string,
    is_edited: boolean,
    chat_id: ObjectId,
    time: string,
    attachments: string
}

export class Message {

    static readonly messagesDb: DB = new DB('messages');


    static async addMessage(text: string, sender_id: string | ObjectId, chat_id: string | ObjectId, attachments: string = ''): Promise<MessageType> {

        chat_id = new ObjectId(chat_id.toString());
        sender_id = new ObjectId(sender_id.toString());

        const new_message_object: MessageType = {
            text: text,
            sender_id: sender_id,
            sender_username: (await User.findOneUser({_id: sender_id})).username,
            chat_id: chat_id,
            is_edited: false,
            time: new Date(Date.now()).getHours().toString().padStart(2, "0")
                + ":"
                + new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
            attachments: attachments
        };

        const new_message_id: ObjectId = await this.messagesDb.insertOne(new_message_object);

        await Chat.setLastMessage(chat_id, new_message_id);
        await chat_messages.insertOne({chat_id: chat_id, message_id: new_message_id})

        new_message_object._id = new_message_id;

        return new_message_object;
    }
    
    static async findMessage(query: object): Promise<any> {
        return await this.messagesDb.findOne(query);
    }

    static async findMessageById(message_id: string | ObjectId): Promise<any> {
        return await this.messagesDb.findOne({_id: new ObjectId(message_id.toString())});
    }

    static async setNewMessageText(message_id: string | ObjectId, text: string): Promise<any> {
        await Message.messagesDb.updateOneField({_id: new ObjectId(message_id.toString())}, 'text', text)
        await Message.messagesDb.updateOneField({_id: new ObjectId(message_id.toString())}, 'is_edited', true)
    }

    static async deleteMessageById(message_id: string | ObjectId): Promise<void> {
        await chat_messages.deleteOne({message_id: new ObjectId(message_id.toString())});
        await Message.messagesDb.deleteOne({_id: new ObjectId(message_id.toString())});
    }

}