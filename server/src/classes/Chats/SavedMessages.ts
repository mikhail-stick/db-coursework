import {ObjectId} from "mongodb";

import {Chat} from './Chat';
import {user_chats} from "../Database";

export class SavedMessages extends Chat {

    constructor() {
        super();
    }

    async initialize(user_id: string | ObjectId): Promise<ObjectId> {
        this.id = await this.db.insertOne(
            {
                type: 'saved_messages',
                name: 'Saved Messages',
                image: 'saved_messages.jpg',
                last_message: {}
            }
        );

        await user_chats.insertOne({user_id: new ObjectId(user_id.toString()), chat_id: this.id});

        return this.id;
    }

    static async createSavedMessages(user_id: ObjectId): Promise<ObjectId> {

        const chat_id: ObjectId = await this.chatsDb.insertOne(
            {
                type: 'saved_messages',
                name: 'Saved Messages',
                image: 'saved_messages.jpg',
                last_message: {}
            }
        );

        await user_chats.insertOne({user_id: new ObjectId(user_id.toString()), chat_id: chat_id});

        return chat_id;
    }

}
