import {MessageRepository, MessageDTO} from "./MessageRepository";
import axios from "axios";
import {UserDTO, UserRepository} from "./UserRepository";

export interface Chat {
    _id: string;
    name: string;
    type: string;
    image: string | File;
    last_message: string | MessageDTO;
}

export interface PrivateChat {
    _id: string;
    interlocutor: Record<string, string>;
    name?: string;
    image?: File;
    type: string;
    last_message: string | MessageDTO;
}

export interface ChatDTO {
    _id: string;
    name: string;
    type: string;
    image: File;
    last_message: MessageDTO;
}

export class ChatRepository {
    private readonly RequestsUrl: string;

    constructor(serverUrl: string) {
        this.RequestsUrl = `${serverUrl}/api`;
    }

    public async getLastMessage(chat_id: string): Promise<MessageDTO | undefined> {
        try {
            const response: any = await axios.get(`${this.RequestsUrl}/chat/lastMessage/${chat_id}`);
            const data = response.data;

            if (data) {
                const message_id = data.message_id;
                if (message_id) {
                    return await MessageRepository.getMessageInfo(this.RequestsUrl, message_id);
                }
            }

        } catch (err: any) {
            console.log(err.toString());
        }
    }

    private async chatDTO(chat: Chat | PrivateChat, last_message?: MessageDTO, user_id?: string): Promise<ChatDTO  | undefined> {

        try{

            if (chat.type === "private") {
                const interlocutor_info: UserDTO | undefined = await UserRepository.getUserInfo(
                    this.RequestsUrl,
                    (chat as PrivateChat).interlocutor[user_id!]
                );
                chat.name = interlocutor_info?.username;
                chat.image = interlocutor_info?.image;
            }
            if (last_message) {
                chat.last_message = MessageRepository.messageDTO(last_message);
            }

            if (typeof chat.image === "string") {

                if (chat.image.length) {
                    const response: Response = await fetch(`http://localhost:3001/public/images/chat/${chat.image}`);
                    const blob: Blob = await response.blob();
                    chat.image = new File([blob], chat.image as string, { type: blob.type });
                }
                else {
                    const response: Response = await fetch(`http://localhost:3001/public/images/chat/default.jpg`);
                    const blob: Blob = await response.blob();
                    chat.image = new File([blob], "default.jpg", { type: blob.type });
                }
            }

            return chat as ChatDTO;
        }
        catch (err: any) {
            console.log(err.toString());
        }

    }

    public async getChatInfo(user_id: string, chat_id: string | Chat): Promise<ChatDTO | undefined> {

        try {
            let chat: Chat;

            if (typeof chat_id === "string") {
                const chat_response = await axios.get(`${this.RequestsUrl}/chat/${chat_id}`);
                chat = chat_response.data as Chat;
            }
            else {
                chat = chat_id;
            }

            const last_message: MessageDTO | undefined = await this.getLastMessage(chat._id);
            return (await this.chatDTO(chat, last_message, user_id));

        } catch (err: any) {
            console.log(err.toString());
        }
    }

    public async getChatMessages(chat_id: string): Promise<MessageDTO[]> {
        try {

            const response: any = await axios.get(`${this.RequestsUrl}/chat/messages/${chat_id}`);

            if (response.data.length) {
                const chat_messages = response.data;
                return chat_messages.map(MessageRepository.messageDTO);
            } else {
                return [];
            }

        } catch (err: any) {
            console.log(err.toString());
            return [];
        }
    }
}
