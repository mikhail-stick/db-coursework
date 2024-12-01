import {Document, ObjectId, WithId} from "mongodb";

import {Message} from "../Message";
import {chat_messages, DB, user_chats} from "../Database";


export abstract class Chat{

    protected id: ObjectId;
    protected db: DB;
    protected static chatsDb: DB = new DB('chats');


    protected constructor() {this.db = Chat.chatsDb;}

    static async findOneChatById(chat_id: string | ObjectId): Promise<WithId<Document>> {
        return await Chat.chatsDb.findOne({_id: new ObjectId(chat_id.toString())});
    }

    static async deleteChat(chat_id: string | ObjectId): Promise<void> {
        chat_id = new ObjectId(chat_id.toString());

        await Chat.chatsDb.deleteOne({_id: chat_id});
        await chat_messages.deleteMany({chat_id: chat_id});
        await user_chats.deleteMany({chat_id: chat_id});
    }

    static async getAllChatMessagesObjects(chat_id: string | ObjectId): Promise<Document> {

        return await chat_messages.aggregate([
            {
                $lookup: {
                    from: "messages",
                    localField: "message_id",
                    foreignField: "_id",
                    as: "message"
                }
            },
            {$match: {chat_id: new ObjectId(chat_id.toString())}},
            {$unwind: "$message"},
            {
                $group: {
                    _id: "$chat_id",
                    messages: {
                        $push: "$message"
                    }
                }
            },
            {$project: {_id: 0, messages: 1}}
        ]);
    }

    static async getAllChatUsersIds(chat_id: string | ObjectId): Promise<any[]> {
        const users: WithId<Document>[] = await user_chats.findAll({'chat_id': new ObjectId(chat_id.toString())});
        return users.map((obj: WithId<Document>) => obj.user_id);
    }

    static async setLastMessage(chat_id: string | ObjectId, message_id: string | ObjectId): Promise<void> {
        await Chat.chatsDb.updateOneField(
            {_id: new ObjectId(chat_id.toString())},
            'last_message',
            new ObjectId(message_id.toString()
            )
        );
    }

    static async getLastMessage(chat_id: string | ObjectId,): Promise<WithId<Document>> {
        return await chat_messages.findLastOne({chat_id: new ObjectId(chat_id.toString())});
    }

    static async sendMessage(chat_id: string | ObjectId, sender_id: string | ObjectId, text: string, attachments: string = ''): Promise<void> {

        await Message.addMessage(
            text,
            new ObjectId(sender_id.toString()),
            new ObjectId(chat_id.toString()),
            attachments
        );
    }
}