import {Document, ObjectId, WithId} from "mongodb";

import {DB} from './Database'

export interface ProfileType {
    first_name: string;
    last_name: string;
    image: string;
    bio: string;
}

export class Profile {

    static readonly profilesDb: DB = new DB('profiles');

    static async addProfile(): Promise<ObjectId> {
        return await this.profilesDb.insertOne(
            {
                first_name: '',
                last_name: '',
                image: '',
                bio: ''
            }
        )
    }

    static async findProfile(query: object): Promise<any> {
        return await Profile.profilesDb.findOne(query);
    }

    static async findProfileById(user_id: string | ObjectId): Promise<WithId<Document>> {
        return await Profile.profilesDb.findOne({_id: new ObjectId(user_id.toString())});
    }

    static async findProfileByIdAndUpdate(id: string, newObject: object): Promise<void> {
        await Profile.profilesDb.findAndUpdateById(new ObjectId(id), newObject);
    }

    static async updateImage(id: string, image: string): Promise<void> {
        await Profile.profilesDb.updateOneField({_id: new ObjectId(id.toString())}, 'image', image)
    }

    static async getImage(profile_id: string): Promise<any> {
        return (await Profile.profilesDb.findOne({_id: new ObjectId(profile_id.toString())})).image;
    }
}