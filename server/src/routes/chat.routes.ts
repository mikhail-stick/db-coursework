import {PrivateChat, PrivateChatType} from "../classes/Chats/PrivateChat";
import {GroupChat, GroupChatType} from "../classes/Chats/GroupChat";

const router = require("express").Router();
import {Chat} from "../classes/Chats/Chat";


// CREATE PRIVATE CHAT
router.post("/private", async (req, res): Promise<void> => {

    try {
        const chat: PrivateChatType = await PrivateChat.CreatePrivateChat(req.body.first_user_id, req.body.second_user_id);
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// CREATE GROUP CHAT
router.post("/group", async (req, res): Promise<void> => {

    try {
        let chat: GroupChatType;

        if (req.body.hasOwnProperty('name')) {
            chat = await GroupChat.createGroupChat(req.body.users, req.body.photo, req.body.name);
        }
        else {
            chat = await GroupChat.createGroupChat(req.body.users, req.body.photo);
        }

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// GET ALL USERS IN CHAT
router.get("/users/:chatId", async (req, res): Promise<void> => {

    try {
        const users: any[] = await Chat.getAllChatUsersIds(req.params.chatId);
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// GET ALL MESSAGES IN CHAT
router.get("/messages/:chatId", async (req, res): Promise<void> => {

    try {
        const data: any = await Chat.getAllChatMessagesObjects(req.params.chatId);
        res.status(200).json(data.messages);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// GET LAST MESSAGE IN CHAT
router.get("/lastMessage/:chatId", async (req, res): Promise<any> => {

    try {
        const data: any = await Chat.getLastMessage(req.params.chatId);
        if (!data) return res.status(202).json({message_id: 0});

        res.status(200).json({message_id: data.message_id});
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// GET CHAT INFO
router.get("/:chatId", async (req, res): Promise<void> => {

    try {
        const chat: any = await Chat.findOneChatById(req.params.chatId);

        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// DELETE CHAT
router.delete("/:chatId", async (req, res): Promise<void> => {

    try {
        const chat: any = await Chat.findOneChatById(req.params.chatId);

        if (!chat) {
            res.status(404).json("Chat doesn`t exists");
            return;
        }

        await Chat.deleteChat(req.params.chatId);
        res.status(200).json("Chat has been deleted.");
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


module.exports = router;