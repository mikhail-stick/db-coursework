import axios from "axios";
import {useAuth} from "../../contexts/Auth/AuthContext";
import {useUserInfo} from "../repoHooks/UserHooks";
import {useGroupChat} from "./useGroupChat";

interface imageUploaderHook {
    uploadProfileImage: (file: File | null) => Promise<string | undefined>;
    uploadGroupImage: (file: File | null) => Promise<string | undefined>;
}

export function useImageUploader(): imageUploaderHook {

    const {user} = useAuth();
    const {user_info} = useUserInfo(user!._id);

    const uploadProfileImage = async (file: File | null): Promise<string | undefined> => {

        if (file) {
            const formData: FormData = new FormData();
            formData.append("profile_id", user_info.profile_id as string);
            formData.append("image", file as File);
            const response = await axios.post("http://localhost:3001/api/upload/profile-image", formData);
            console.log(response.data);
            return response.data.image_path;
        }
    }

    const uploadGroupImage = async (file: File | null): Promise<string | undefined> => {

        if (file) {
            const formData: FormData = new FormData();
            formData.append("image", file as File);
            const response = await axios.post("http://localhost:3001/api/upload/group-image", formData);
            return response.data.image_path;
        }
    }

    return {
        uploadProfileImage,
        uploadGroupImage
    };
}
