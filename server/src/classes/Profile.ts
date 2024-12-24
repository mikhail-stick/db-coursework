import { DB } from './Database'

export interface ProfileType {
    first_name: string;
    last_name: string;
    image: string;
    bio: string;
}

export class Profile {

    static readonly table = "profiles";

    static async addProfile() {
        return await DB.insertOne(this.table,
            {
                first_name: '',
                last_name: '',
                image: '',
                bio: ''
            }
        )
    }

    // static async findProfile(query: object): Promise<any> {
    //     return await Profile.profilesDb.findOne(query);
    // }

    static async findProfileById(user_id: number) {
        return await DB.findOne(this.table, { id: user_id });
    }

    static async findProfileByIdAndUpdate(id: string, newObject: object): Promise<void> {
        await DB.findAndUpdateById(this.table, id, newObject);
    }

    // static async updateImage(id: string, image: string): Promise<void> {
    //     await Profile.profilesDb.updateOneField({_id: new ObjectId(id.toString())}, 'image', image)
    // }

    // static async getImage(profile_id: string): Promise<any> {
    //     return (await Profile.profilesDb.findOne({_id: new ObjectId(profile_id.toString())})).image;
    // }
}