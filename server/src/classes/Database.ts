import {
    MongoClient,
    Collection,
    Db,
    ObjectId,
    MongoClientOptions,
    WithId,
    Document,
    InsertOneResult
} from 'mongodb';

const config = require('config');

// TODO: Change db to PostgreSQL without using ORM

const DB_URI = config.get('Dev.DB.uri');
const DB_NAME = config.get('Dev.DB.name');

const OPTIONS: MongoClientOptions = {
    ssl: true,
};

const CLIENT: MongoClient = new MongoClient(DB_URI, OPTIONS);


export class DB {

    public collection!: Collection;
    private client!: MongoClient;
    private db !: Db;


    constructor(private collectionName: string) {
        this.client = CLIENT;
        this.db = this.client.db(DB_NAME)
        this.collection = this.db.collection(this.collectionName);
    }

    async find(query?: object): Promise<WithId<Document>> {
        return (await this.collection.find(query || {})).next();
    }

    async findAll(query?: object): Promise<WithId<Document>[]> {
        return await this.collection.find(query || {}).toArray();
    }

    async findOne(query: object): Promise<WithId<Document>> {
        return await this.collection.findOne(query);
    }

    async findLastOne(query: object): Promise<WithId<Document>> {
        return (await this.collection.find(query).sort({ _id: -1 }).limit(1)).next();
    }

    async insertOne(document: object): Promise<ObjectId> {
        const result: InsertOneResult = await this.collection.insertOne(document);
        return result.insertedId;
    }

    async updateOneField(query: object, field: string, value): Promise<void> {
        let new_data: WithId<Document> = await this.findOne(query)
        new_data[field] = value
        await this.collection.updateOne(query, { $set: new_data });
    }

    async deleteOne(query: object): Promise<void> {
        await this.collection.deleteOne(query);
    }

    async deleteMany(query: object): Promise<void> {
        await this.collection.deleteMany(query);
    }

    async findAndDeleteById(id: ObjectId): Promise<void> {
        await this.collection.findOneAndDelete({ "_id": id })
    }

    async findAndUpdateById(id: ObjectId, newObject: object): Promise<void> {
        await this.collection.updateOne({ _id: id }, { $set: newObject })
    }

    async updateMany(filter: object, update: object): Promise<void> {
        await this.collection.updateMany(filter, update);
    }

    async aggregate(query: object[]): Promise<Document> {
        let res: Document[] = await (await this.collection.aggregate(query)).toArray();
        return res[0];
    }
}

export const user_chats: DB = new DB('user_chats');
export const chat_messages: DB = new DB('chat_messages');
export const user_contacts: DB = new DB('user_contacts');