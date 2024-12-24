import { PrivateChat } from './Chats/PrivateChat';
import { DB } from './Database';
import { Profile } from "./Profile";

export interface UserType {
    id: number;
    username: string;
    phone_number: string;
    password: string;
    profile_id: number;
}

export class User {
    static table: string = "users";

    static async addUser(username: string, phone_number: string, password: string): Promise<any> {

        const user_id = await DB.insertOne(this.table,
            {
                username: username,
                phone_number: phone_number,
                password: password,
                profile_id: await Profile.addProfile()
            }
        )

        // await SavedMessages.createSavedMessages(user_id);

        return user_id;
    }

    static async findOneUser(query: object): Promise<any> {
        return await DB.findOne(this.table, query);
    }

    static async findOneUserById(user_id: string): Promise<any> {
        return await DB.findOne(this.table, { id: user_id });
    }

    // static async getUsername(user_id: string): Promise<any> {
    //     return (await User.usersDb.findOne({ _id: new ObjectId(user_id.toString()) })).username;
    // }

    // static async getProfileImage(user_id: string): Promise<any> {
    //     const profile_id = (await User.usersDb.findOne({ _id: new ObjectId(user_id.toString()) })).profile_id;
    //     return await Profile.getImage(profile_id);
    // }

    static async deleteUserById(id: string): Promise<void> {
        await DB.findAndDeleteById(this.table, id);
    }

    static async findUserByIdAndUpdate(id: string, newObject: object): Promise<void> {
        await DB.findAndUpdateById(this.table, id, newObject);
    }

    // static async addNewChat(user_id: ObjectId, chat_id: ObjectId): Promise<void> {
    //     await user_chats.insertOne({ user_id: user_id, chat_id: chat_id })
    // }

    static async addNewContact(user_id: string, contact_id: string) {

        const chat_id = (await PrivateChat.CreatePrivateChat(user_id.toString(), contact_id));

        console.log("chat_id", chat_id);

        // await user_contacts.insertOne(
        //     {
        //         user_id: user_id.toString(),
        //         contact_id: contact_id.toString(),
        //         chat_id: chat_id
        //     }
        // );

        // return chat_id.toString();
    }

    // static async getAllUserChatsIds(user_id: string | ObjectId): Promise<WithId<Document>[]> {
    //     return await user_chats.findAll({ user_id: new ObjectId(user_id.toString()) })
    // }

    static async getAllUserContacts(user_id: string) {
        const result = (await DB.findAll("user_contacts", { user_id })).concat(await DB.findAll("user_contacts", { contact_id: user_id }));

        const index = result.findIndex(item => item.user_id === item.contact_id);

        if (index !== -1) {
            result.splice(index, 1); // Удаляем строку
        }

        const contacts = await Promise.all(result.map(async (contact) => {
            return {
                _id: contact.id.toString(), // Преобразование id в строку
                user_id: contact.user_id.toString(),
                contact_id: contact.contact_id.toString(),
                chat_id: contact.chat_id.toString(),
            }
        })
        );

        return contacts;
    }

    static async getAllUserChats(user_id: string) {

        const result = await DB.sql(
            `
            SELECT 
                c.id AS chat_id,
                c.image AS chat_image,
                ct.name AS chat_type,
                u.id AS contact_id,
                u.username AS contact_username,
                u.phone_number AS contact_phone
            FROM user_contacts uc
            JOIN chats c ON uc.chat_id = c.id
            JOIN chat_types ct ON c.chat_type_id = ct.id
            JOIN users u ON uc.contact_id = u.id
            WHERE uc.user_id = ${user_id} OR uc.contact_id = ${user_id}
            AND ct.name = 'private'
            ORDER BY c.id ASC;
        `)
        // console.log(result.rows);

        const chats = await Promise.all(result.rows.map(async (chat) => {
            const chatInfo = await DB.findOne("user_contacts", { chat_id: chat.chat_id })

            const user_id = await chatInfo.user_id.toString();
            const contact_id = chatInfo.contact_id.toString();

            const message = (await DB.sql(`SELECT *
                                        FROM messages
                                        WHERE chat_id = ${chat.chat_id}
                                        ORDER BY id DESC
                                        LIMIT 1;`)).rows[0];
            const last_message = message ? {
                ...message,
                _id: message.id,
                attachments: ""
            } : {}
            return {
                _id: chat.chat_id.toString(), // Преобразование id в строку
                type: chat.chat_type,         // Тип чата
                interlocutor: {
                    [user_id]: contact_id,
                    [contact_id]: user_id,
                },
                last_message     // Заглушка для последнего сообщения
            }
        })
        );

        return chats;
    }

}
