import {MessageRepository, MessageDTO} from "repositories";
import {useQuery} from "react-query";

const messageRepo: MessageRepository = new MessageRepository("http://localhost:3001");

export const useMessageInfo = (message_id: string | null) => {
    const {
        data,
    } = useQuery<any, Error>(['message_info', message_id], async () => {
        if (message_id) {
            return await messageRepo.getMessageInfo(message_id);
        }
        else {
            return '';
        }

    });

    return {
        message_info: data,
    };
};