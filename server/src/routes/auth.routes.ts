import {Document, WithId} from "mongodb";
import {User} from '../classes/User';

const router = require("express").Router();
const bcrypt = require("bcrypt");



//REGISTER
router.post("/register", async (req, res): Promise<void> => {

    try {
        // check if user with such phone number or username exists
        if (await User.findOneUser({phone_number: req.body.phone_number}))
        {
            res.status(404).json("User with this phone number already exists!");
            return;
        }
        if (await User.findOneUser({username: req.body.username})) {
            res.status(404).json("User with this username already exists!");
            return;
        }

        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user_id = await User.addUser(req.body.username, req.body.phone_number, hashedPassword);

        res.status(200).json({_id: user_id});
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


//LOGIN
router.post("/login", async (req, res): Promise<void> => {

    try {
        //try to found user with such phone number
        const user: WithId<Document> = await User.findOneUser({phone_number: req.body.phone_number});
        if (!user) {
            res.status(404).json("There is no user with this phone number!");
            return;
        }

        //check if password correct
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(400).json("Wrong password!");
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({error: err.toString()});
    }
});


module.exports = router;