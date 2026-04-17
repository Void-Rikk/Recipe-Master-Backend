import { db } from "../db/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

class AuthModel {
    async createUser(first_name, last_name, password) {
        const hashedPassword = await bcrypt.hash(password, +process.env.BCRYPT_ROUNDS || 10);
        const values = [first_name, last_name, hashedPassword];
        const text = 'INSERT INTO users(first_name, last_name, password) VALUES ($1, $2, $3) RETURNING id, first_name, last_name';

        try {
            return await db.query(text, values);
        }
        catch (e) {
            if (e.code === "23505") {
                throw new Error("User already exists");
            }
            throw e;
        }
    }

    async loginUser(first_name, last_name, password) {
        const values = [first_name, last_name];
        const text = 'SELECT id, first_name, last_name, password FROM users WHERE first_name = $1 AND last_name = $2';

        const result = await db.query(text, values);
        if (!result.rows.length) {
            throw new Error("Invalid name/password");
        }
        const user = result.rows[0];

        const hashPassword = user.password;
        const isValidPassword = await bcrypt.compare(password, hashPassword);

        if (!isValidPassword) {
            throw new Error("Invalid name/password");
        }

        return {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name
        };
    }
}

export default new AuthModel();