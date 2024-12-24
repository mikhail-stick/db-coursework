import { DB } from "../Database";
import { Message } from "../Message";


export abstract class Chat {

    protected id: number;
    protected static table = "chats";

    static async findOneChatById(chat_id: string) {
        const chatInfo = await DB.findOne("user_contacts", { chat_id: chat_id });

        const user_id = await chatInfo.user_id.toString();
        const contact_id = chatInfo.contact_id.toString();

        return {
            _id: chat_id.toString(), // Преобразование id в строку
            type: "private",         // Тип чата
            interlocutor: {
                [user_id]: contact_id,
                [contact_id]: user_id,
            },
            last_message: {}            // Заглушка для последнего сообщения
        }

        // return await DB.findOne(this.table, { id: chat_id });
    }

    // static async deleteChat(chat_id: string | ObjectId): Promise<void> {
    //     chat_id = new ObjectId(chat_id.toString());

    //     await Chat.chatsDb.deleteOne({_id: chat_id});
    //     await chat_messages.deleteMany({chat_id: chat_id});
    //     await user_chats.deleteMany({chat_id: chat_id});
    // }

    static async getAllChatMessagesObjects(chat_id: string) {
        const result = (await DB.sql(`SELECT *
                                    FROM messages
                                    WHERE chat_id = ${chat_id}
                                    ORDER BY id ASC;
                                    `)).rows;

        const chats = await Promise.all(result.map(async (chat) => {
            return {
                ...chat,
                attachments: "",
                _id: chat.id
            }
        })
        );

        return chats
    }

    // static async getAllChatUsersIds(chat_id: string | ObjectId): Promise<any[]> {
    //     const users: WithId<Document>[] = await user_chats.findAll({'chat_id': new ObjectId(chat_id.toString())});
    //     return users.map((obj: WithId<Document>) => obj.user_id);
    // }

    static async setLastMessage(chat_id: string, message_id: string): Promise<void> {
        DB.sql(`UPDATE chats
            SET last_message_id = ${message_id}
            WHERE id = ${chat_id};
            `)
    }

    static async getLastMessage(chat_id: string,) {
        const message = (await DB.sql(`SELECT *
            FROM messages
            WHERE chat_id = ${chat_id}
            ORDER BY time DESC
            LIMIT 1;`)).rows[0];
        const last_message = message ? {
            ...message,
            _id: message.id,
            attachments: ""
        } : {};
        return last_message;
    }

    static async sendMessage(chat_id: string, sender_id: string, text: string, attachments: string = '') {
        await Message.addMessage(
            text,
            sender_id.toString(),
            chat_id.toString(),
            attachments
        );
    }
}