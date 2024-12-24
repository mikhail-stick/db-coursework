
import { Pool, PoolConfig } from 'pg';
import { UserType } from './User';

const dotenv = require('dotenv');
dotenv.config();

const DB_CONFIG: PoolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
};

const pool = new Pool(DB_CONFIG);
let client;
(async () => {
    client = await pool.connect();

    client.release();
})()

export class DB {
    private static client = client;
    private static pool = pool;

    static async insertOne(table: string, values: Record<string, any>) {
        const keys = Object.keys(values);
        const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        const params = Object.values(values);
        const result = await DB.pool.query(query, params);
        return result.rows[0].id;
    }

    static async find(table: string, conditions?: Record<string, any>): Promise<any> {
        const where = conditions ?
            `WHERE ${Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ')}` : '';
        const query = `SELECT * FROM ${table} ${where} LIMIT 1`;
        const params = conditions ? Object.values(conditions) : [];
        const result = await DB.pool.query(query, params);
        return result.rows;
    }

    static async findOne(table: string, conditions: Record<string, any>) {
        const result = await this.find(table, conditions)
        return result.length === 0 ? null : result[0];
    }

    static async findAndUpdateById(table: string, id: string, newObject: Record<string, any>): Promise<void> {
        const keys = Object.keys(newObject);
        const setClause = keys.map((key, idx) => `${key} = $${idx + 2}`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE id = $1`;
        const params = [id, ...Object.values(newObject)];
        await DB.pool.query(query, params);
    }

    static async findAll(table: string, conditions?: Record<string, any>): Promise<any[]> {
        const where = conditions ?
            `WHERE ${Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ')}` : '';
        const query = `SELECT * FROM ${table} ${where}`;
        const params = conditions ? Object.values(conditions) : [];
        const result = await DB.pool.query(query, params);
        return result.rows;
    }

    static async findLastOne(table: string, conditions?: Record<string, any>): Promise<any> {
        const where = conditions ?
            `WHERE ${Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ')}` : '';
        const query = `SELECT * FROM ${table} ${where} ORDER BY id DESC LIMIT 1`;
        const [result] = await DB.client.query(query, conditions ? Object.values(conditions) : []);
        return result;
    }

    static async updateOneField(table: string, conditions: Record<string, any>, field: string, value: any): Promise<void> {
        const where = Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
        const params = [...Object.values(conditions), value];
        const query = `UPDATE ${table} SET ${field} = $${params.length} WHERE ${where}`;
        await DB.client.query(query, params);
    }

    static async deleteOne(table: string, conditions: Record<string, any>): Promise<void> {
        const where = Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
        const query = `DELETE FROM ${table} WHERE ${where} LIMIT 1`;
        await DB.client.query(query, Object.values(conditions));
    }

    static async deleteMany(table: string, conditions: Record<string, any>): Promise<void> {
        const where = Object.keys(conditions).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
        const query = `DELETE FROM ${table} WHERE ${where}`;
        await DB.client.query(query, Object.values(conditions));
    }

    static async findAndDeleteById(table: string, id: string): Promise<void> {
        const query = `DELETE FROM ${table} WHERE id = $1 LIMIT 1`;
        await DB.client.query(query, [id]);
    }

    static async updateMany(table: string, filter: Record<string, any>, update: Record<string, any>): Promise<void> {
        const filterClause = Object.keys(filter).map((key, idx) => `${key} = $${idx + 1}`).join(' AND ');
        const updateClause = Object.keys(update).map((key, idx) => `${key} = $${idx + 1 + Object.keys(filter).length}`).join(', ');
        const query = `UPDATE ${table} SET ${updateClause} WHERE ${filterClause}`;
        const params = [...Object.values(filter), ...Object.values(update)];
        await DB.client.query(query, params);
    }

    static async aggregate(table: string, groupByField: string, aggregateField: string, aggregateFunc: string): Promise<any> {
        const query = `SELECT ${aggregateFunc}(${aggregateField}) as result, ${groupByField} FROM ${table} GROUP BY ${groupByField}`;
        const results = await DB.client.query(query);
        return results[0];
    }

    static async sql(query: string) {
        const results = await DB.pool.query(query);
        return results;
    };
}