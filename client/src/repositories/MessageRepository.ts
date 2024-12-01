import axios from "axios";

export interface Message {
    _id: string;
    text: string;
    sender_id: string;
    is_edited: boolean;
    sender_username: string;
    chat_id: string,
    time: string;
    attachments: any[] | string;
}

export interface MessageDTO {
    _id: string,
    text: string,
    time: string,
    is_edited: boolean,
    sender_id: string,
    sender_username: string,
    attachments: any[] | string,
}

export class MessageRepository {
    RequestsUrl: string;

    constructor(serverUrl: string) {
        this.RequestsUrl = `${serverUrl}/api`;
    }

    async getMessageInfo(message_id: string): Promise<MessageDTO | undefined> {

        try {
            const response = await axios.get(`${this.RequestsUrl}/message/${message_id}`);
            const message: Message = response.data as Message;

            return MessageRepository.messageDTO(message);

        } catch (err: any) {
            console.log(err.toString());
        }
    }

    static async getMessageInfo(url: string, message_id: string): Promise<MessageDTO | any> {

        try {
            const response = await axios.get(`${url}/message/${message_id}`);
            const message: Message = response.data as Message;

            return MessageRepository.messageDTO(message);

        } catch (err: any) {
            console.log(err.toString());
        }
    }

    static messageDTO(message: any): MessageDTO {
        return {
            _id: message._id,
            text: message.text,
            time: message.time,
            is_edited: message.is_edited,
            sender_id: message.sender_id,
            sender_username: message.sender_username,
            attachments: message.attachments,
        };
    }
}
