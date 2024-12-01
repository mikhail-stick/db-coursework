import {ObjectId} from "mongodb";

import {Chat} from './Chat';
import {user_chats} from "../Database";
import {User} from "../User";


export interface PrivateChatType {
    _id?: ObjectId | null,
    type: string,
    interlocutor: Object,
    last_message: Object
}

export class PrivateChat extends Chat {

    constructor() {
        super();
    }

    async initialize(first_user_id: string, second_user_id: string): Promise<ObjectId> {

        this.id = await this.db.insertOne(
            {
                type: 'private',
                interlocutor: {
                    [first_user_id]: second_user_id,
                    [second_user_id]: first_user_id
                },
                last_message: {}
            }
        );

        await user_chats.insertOne({user_id: new ObjectId(first_user_id.toString()), chat_id: this.id});
        await user_chats.insertOne({user_id: new ObjectId(second_user_id.toString()), chat_id: this.id});

        return this.id;
    }

    static async CreatePrivateChat(first_user_id: string, second_user_id: string): Promise<PrivateChatType> {

        const new_chat_object: PrivateChatType = {
            type: 'private',
            interlocutor: {
                [first_user_id]: second_user_id,
                [second_user_id]: first_user_id
            },
            last_message: {}
        }

        const chat_id: ObjectId = await this.chatsDb.insertOne(new_chat_object);

        await user_chats.insertOne({user_id: new ObjectId(first_user_id), chat_id: chat_id});
        await user_chats.insertOne({user_id: new ObjectId(second_user_id), chat_id: chat_id});

        new_chat_object._id = chat_id;

        return new_chat_object;
    }

}
