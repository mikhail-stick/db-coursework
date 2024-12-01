import express, {Router} from 'express';
import multer from 'multer';
import * as fs from 'fs';
import {Profile} from "../classes/Profile";
import {User} from "../classes/User";
import {Chat} from "../classes/Chats/Chat";

const router: Router = express.Router();
const upload_profile: multer.Multer = multer({ dest: '../public/images/profile' });
const upload_group: multer.Multer = multer({ dest: '../public/images/chat' });

router.post('/profile-image', upload_profile.single('image'), async (req: any, res) => {

    try {
        const {path, mimetype} = req.file!;
        const extension: string = mimetype.split("/")[1];
        const newFileName: string = `${path}.${extension}`;
        fs.renameSync(path, newFileName);

        const previousImage: string | undefined = (await Profile.findProfileById(req.body.profile_id))?.image

        if (previousImage) {
            fs.unlink(`../../public/images/profile/${previousImage}`, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('File deleted successfully');
            });
        }

        res.status(200).json({image_path: newFileName.split("/").slice(-1)[0]});

    }
    catch (err: any) {
        res.status(500).json({error: err.toString()});
    }
});

router.post('/group-image', upload_group.single('image'), async (req: any, res) => {

    try {
        const {path, mimetype} = req.file!;
        const extension: string = mimetype.split("/")[1];
        const newFileName: string = `${path}.${extension}`;
        fs.renameSync(path, newFileName);

        res.status(200).json({image_path: newFileName.split("/").slice(-1)[0]});

    }
    catch (err: any) {
        res.status(500).json({error: err.toString()});
    }
});

module.exports = router;