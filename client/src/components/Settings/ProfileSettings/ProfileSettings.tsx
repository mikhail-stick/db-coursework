import './ProfileSettings.css';
import React, {ChangeEvent, useEffect, useState} from 'react';

import {Done} from "@mui/icons-material";
import {useAuth} from "../../../contexts/Auth/AuthContext";
import {useUserInfo} from "../../../hooks/repoHooks/UserHooks";
import {useImageUploader, useMenu} from "../../../hooks";
import {ImageUploader} from "../../ImageUploader/ImageUploader";


export function ProfileSettings(): JSX.Element {

    const {user} = useAuth();
    const {user_info, refresh_user_info, setUserInfo} = useUserInfo(user!._id);
    const {setMenuItem} = useMenu();

    const [lastName, setLastName] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [profile_image, serProfileImage] = useState<File|null>(user_info.image_path ? user_info.image : null);


    const {uploadProfileImage} = useImageUploader();

    useEffect(() => {
        setError("");
    }, [username])

    const handleChangeClick = async (): Promise<void> => {
        const username_regexp: RegExp = /^[a-z0-9_]{5,15}$/;
        let usrnm = username ? username : user_info.username;

        if (username_regexp.test(usrnm)) {
            const newUserInfo = {...user_info};

            firstName && (newUserInfo.first_name = firstName);
            lastName && (newUserInfo.last_name = lastName);
            bio && (newUserInfo.bio = bio);
            username && (newUserInfo.username = username);

            try {
                const image_url: string | undefined = await uploadProfileImage(profile_image);
                if (image_url) newUserInfo.image_path = image_url;
                await setUserInfo(newUserInfo);
                setMenuItem("settings");
            }
            catch (err: any) {
                setError(err);
            }

        }
        else {
            setError("Wrong input!");
        }

    }

    const handlePhotoClick = () => {
        const uploader: HTMLInputElement | null = document.querySelector(".image-uploader");
        uploader?.click();
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            serProfileImage(file);
        }
    };

    const image_url = 'https://avatars.mds.yandex.net/i?id=5d8db0440aae4c3265492d1b3f8de64dddf64453-8342484-images-thumbs&n=13';

    return (
        <div className="left-container profile-settings-container">
            <div className="new-group-chat-info">
                <img
                    className="new-group-chat-photo"
                    src={profile_image ? URL.createObjectURL(profile_image) : image_url}
                    alt={"new_chat_photo"}
                    onClick={handlePhotoClick}
                />
                <div style={{display: "none"}}>
                    <input className="image-uploader" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="profile-settings-inputs">
                    <input
                        type="text"
                        placeholder="First name"
                        className="profile-input"
                        defaultValue={user_info.first_name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        className="profile-input"
                        defaultValue={user_info.last_name}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="bio"
                        className="profile-input"
                        defaultValue={user_info.bio}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBio(event.target.value)}
                    />
                    <p className="profile-settings-footer">
                        Any details such as age, occupation or city. <br/>
                        Example: 19 y.o. bezdelnick from Drogichin
                    </p>
                </div>
                <div className="profile-settings-username">
                    <p className="setting-header">Username</p>
                    <input
                        type="text"
                        placeholder="Username (required)"
                        className={`profile-input username ${error ? "username-error" : ""}`}
                        minLength={5}
                        maxLength={15}
                        defaultValue={user_info.username}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                    />
                    {error && <p className="username-error-div">{error}</p>}
                    <p className="profile-settings-footer">
                        You can choose a username on <b>SocialNetwork.</b><br/>
                        You can use a–z, 0–9 and underscores. <br/>Minimum length is 5 characters.
                    </p>
                </div>
            </div>
            {(username || (user_info && user_info.username)) &&
                <button className={"add-contact-btn"} onClick={handleChangeClick}><Done /></button>
            }
        </div>
    );
}
