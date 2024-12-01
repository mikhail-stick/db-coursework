import {PrivateChat} from "./PrivateChat";
import {GroupChat} from "./GroupChat";
import {SavedMessages} from "./SavedMessages";


export enum ChatTypes {
    PRIVATE = 'private',
    GROUP = 'group',
    MSG = 'saved_messages'
}

export class ChatFactory {

    static createChat(chat_type: ChatTypes ): PrivateChat | GroupChat | SavedMessages {

        if (chat_type === ChatTypes.PRIVATE){
            return new PrivateChat();

        } else if (chat_type === ChatTypes.GROUP) {
            return new GroupChat();

        } else if (chat_type === ChatTypes.MSG) {
            return new SavedMessages();

        } else {
            throw new Error('Invalid chat type');
        }
    }
}


