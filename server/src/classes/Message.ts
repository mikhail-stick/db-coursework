import { Chat } from './Chats/Chat';
import { DB } from './Database'
import { User } from "./User";


export interface MessageType {
    _id?: number,
    text: string,
    sender_id: number,
    sender_username: string,
    is_edited: boolean,
    chat_id: number,
    time: string,
    attachments?: string
}

export class Message {

    static readonly table = 'messages';


    static async addMessage(text: string, sender_id: string, chat_id: string, attachments: string = '') {

        chat_id = chat_id.toString();
        sender_id = sender_id.toString();

        const new_message_object: MessageType = {
            text: text,
            sender_id: +sender_id,
            sender_username: (await User.findOneUser({ id: sender_id })).username,
            chat_id: +chat_id,
            is_edited: false,
            time: new Date(Date.now()).getHours().toString().padStart(2, "0")
                + ":"
                + new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
        };

        const new_message_id = await DB.insertOne(this.table, new_message_object);

        await Chat.setLastMessage(chat_id, new_message_id);
        await DB.insertOne("chat_messages", { chat_id: chat_id, message_id: new_message_id })

        new_message_object._id = new_message_id;

        return { ...new_message_object, attachments: "" };
    }

    // static async findMessage(query: object): Promise<any> {
    //     return await this.messagesDb.findOne(query);
    // }

    static async findMessageById(message_id: string): Promise<any> {
        return await DB.findOne(this.table, { id: message_id });
    }

    static async setNewMessageText(message_id: string, text: string) {
        console.log(text, message_id);

        await DB.sql(`UPDATE messages
                    SET text = '${text}', 
                    is_edited = TRUE
                    WHERE id = ${message_id};
                    `)
    }

    static async deleteMessageById(message_id: string) {
        DB.sql(`DELETE FROM messages
            WHERE id = ${message_id};
            `)
    }

}