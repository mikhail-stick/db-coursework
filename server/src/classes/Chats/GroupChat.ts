import {Chat} from './Chat';
import {ObjectId} from "mongodb";
import {user_chats} from "../Database";


export interface GroupChatType {
    _id?: ObjectId | null;
    type: string;
    name: string;
    image: string;
    last_message: Object;
}

export class GroupChat extends Chat {

    constructor() {
        super();
    }

    async initialize(users: ObjectId[], name: string = "New group chat"): Promise<ObjectId> {

        this.id = await this.db.insertOne(
            {
                type: 'group',
                name: name,
                photo: '',
                last_message: {}
            }
        );

        for (let i: number = 0; i < users.length; i++) {
            await user_chats.insertOne({user_id: new ObjectId(users[i].toString()), chat_id: this.id});
        }

        return this.id;
    }

    static async createGroupChat(users: ObjectId[] | string[], image:string, name: string = "New group chat"): Promise<GroupChatType> {

        const new_chat_object: GroupChatType = {
            type: 'group',
            name: name,
            image: image,
            last_message: {}
        }

        const chat_id: ObjectId = await this.chatsDb.insertOne(new_chat_object);
        for (let i = 0; i < users.length; i++) {
            await user_chats.insertOne({user_id: new ObjectId(users[i].toString()), chat_id: chat_id});
        }
        new_chat_object._id = chat_id;

        return new_chat_object;
    }

    static async addNewUserInChat(chat_id: string | ObjectId, user_id: string | ObjectId): Promise<void> {

        await user_chats.insertOne(
            {
                chat_id: new ObjectId(chat_id.toString()),
                user_id: new ObjectId(user_id.toString())
            }
        );
    }
}
