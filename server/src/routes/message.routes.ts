import {Message, MessageType} from "../classes/Message";
import {Router} from "express";

const router: Router = require("express").Router();


// SEND NEW MESSAGE
router.post("/", async (req, res): Promise<void> => {

    try {
        const new_message: MessageType = await Message.addMessage(req.body.text, req.body.sender_id, req.body.chat_id);

        res.status(200).json(new_message);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


// GET MESSAGE INFO
router.get("/:messageId", async (req, res): Promise<void> => {

    try {
        const message: MessageType = await Message.findMessageById(req.params.messageId);

        if (!message) {
            res.status(404).json("Message doens`t exists");
            return;
        }

        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
});


// EDIT MESSAGE
router.put("/:messageId", async (req, res): Promise<void> => {

    try {
        const message: MessageType = await Message.findMessageById(req.params.messageId);

        if (!message) {
            res.status(404).json("Message doesn`t exists");
            return;
        }

        if (message.sender_id.toString() === req.body.user_id) {
            await Message.setNewMessageText(req.params.messageId, req.body.text);
            res.status(200).json("Message has been updated");
        }
        else {
            res.status(403).json("You can update only your messages");
        }
    }
    catch (err) {
        res.status(500).json({error: err.toString()});
    }

});


// DELETE MESSAGE
router.delete("/:messageId", async (req, res): Promise<void> => {

    try {
        const message: MessageType = await Message.findMessageById(req.params.messageId);

        if (!message) {
            res.status(404).json("Message doesn`t exists");
            return;
        }

        if (message.sender_id.toString() === req.body._id) {
            await Message.deleteMessageById(req.params.messageId);
            res.status(200).json("Message has been deleted");
        }
        else {
            res.status(403).json("You can delete only your messages");
        }

    } catch (err) {
        res.status(500).json({error: err.toString()});
    }

});


module.exports = router;