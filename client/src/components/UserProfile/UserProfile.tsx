import './UserProfile.css';
import React from 'react';
import {PhoneOutlined, AlternateEmailOutlined, InfoOutlined} from '@mui/icons-material';
import {useAuth} from "../../contexts/Auth/AuthContext";
import {useUserInfo} from "../../hooks/repoHooks/UserHooks";
import {ImageUploader} from "../ImageUploader/ImageUploader";

export function UserProfile(): JSX.Element {


    const {user} = useAuth();
    const {user_info, isUserInfoLoading, refresh_user_info, isUserInfoError} = useUserInfo(user!._id);
    
    return (
        <div className="user-profile">
            {!isUserInfoLoading && !isUserInfoError ?
                <>
                    <div className="user-profile-header">
                        <img
                            className="user-profile-image"
                            src={URL.createObjectURL(user_info.image)}
                            alt={user_info.username}/>
                        <h2 className="user-profile-name">{user_info.username}</h2>
                    </div>
                    <div className="content">
                        <div className="item-preview">
                            <PhoneOutlined/>
                            <div className="user-item-description">
                                <p>{user_info.phone_number}</p>
                                <small>Phone</small>
                            </div>
                        </div>
                        <div className="item-preview">
                            <AlternateEmailOutlined/>
                            <div className="user-item-description">
                                <p>{user_info.username}</p>
                                <small>Username</small>
                            </div>
                        </div>
                        <div className="item-preview no-pointer">
                            <InfoOutlined/>
                            <div className="user-item-description">
                                <p>{user_info.bio.length ? user_info.bio : "No bio yet."}</p>
                                <small>Bio</small>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div>Loading...</div>
            }
        </div>
    );
}
