import {Document, ObjectId, WithId} from "mongodb";

import {DB, user_chats, user_contacts} from './Database';
import {Profile} from "./Profile";
import {SavedMessages} from "./Chats/SavedMessages";
import {PrivateChat} from "./Chats/PrivateChat";


export interface UserType {
    _id: ObjectId;
    username: string;
    phone_number: string;
    password: string;
    profile_id: ObjectId;
}

export class User {

    static readonly usersDb: DB = new DB('users');
    

    static async addUser(username: string, phone_number: string, password: string): Promise<any> {

        const user_id: ObjectId = await this.usersDb.insertOne(
            {
                username: username,
                phone_number: phone_number,
                password: password,
                profile_id: await Profile.addProfile()
            }
        )

        await SavedMessages.createSavedMessages(user_id);

        return user_id;
    }

    static async findOneUser(query: object): Promise<any> {
        return await User.usersDb.findOne(query);
    }

    static async findOneUserById(user_id: string): Promise<any> {
        return await User.usersDb.findOne({_id: new ObjectId(user_id)});
    }

    static async getUsername(user_id: string): Promise<any> {
        return (await User.usersDb.findOne({_id: new ObjectId(user_id.toString())})).username;
    }

    static async getProfileImage(user_id: string): Promise<any> {
        const profile_id = (await User.usersDb.findOne({_id: new ObjectId(user_id.toString())})).profile_id;
        return await Profile.getImage(profile_id);
    }

    static async deleteUserById(id: string): Promise<void> {
        await User.usersDb.findAndDeleteById(new ObjectId(id));
    }

    static async findUserByIdAndUpdate(id: string, newObject: object): Promise<void> {
        await User.usersDb.findAndUpdateById(new ObjectId(id), newObject);
    }

    static async addNewChat(user_id: ObjectId, chat_id: ObjectId): Promise<void> {
        await user_chats.insertOne({user_id: user_id, chat_id: chat_id})
    }

    static async addNewContact(user_id: ObjectId | string, contact_id: ObjectId | string): Promise<string> {

        const chat_id: ObjectId = (await PrivateChat.CreatePrivateChat(user_id.toString(), contact_id.toString()))._id;

        await user_contacts.insertOne(
            {
                user_id: new ObjectId(user_id.toString()),
                contact_id: new ObjectId(contact_id.toString()),
                chat_id: chat_id
            }
        );

        return chat_id.toString();
    }

    static async getAllUserChatsIds(user_id: string | ObjectId): Promise<WithId<Document>[]> {
        return await user_chats.findAll({user_id: new ObjectId(user_id.toString())})
    }

    static async getAllUserContacts(user_id: string): Promise<WithId<Document>[]> {
        return await user_contacts.findAll({user_id: new ObjectId(user_id)})
    }

    static async getAllUserChats(user_id: string): Promise<Document> {

        return await user_chats.aggregate([

            {
                $lookup: {
                    from: "chats",
                    localField: "chat_id",
                    foreignField: "_id",
                    as: "chat"
                }
            },
            {$match: {user_id: new ObjectId(user_id)}},
            {$unwind: "$chat"},
            {
                $group: {
                    _id: "$user_id",
                    chats: {
                        $push: "$chat"
                    }
                }
            },
            {$project: {_id: 0, chats: 1}}
        ]);
    }

}
