import { NoUserError, ValidationError } from "../utils/errors.js";
import { db } from "../db/db.js";
import { validateUserUpdate } from "../utils/utils.js";


class UserModel {

    async getUserInfo(userId) {
        if (!userId) {
            throw new ValidationError("Missing userId");
        }

        const values = [userId];
        const text = 'SELECT u.first_name, u.last_name, u.bio, u.avatar_id, u.avatar_extension, COUNT(r) as recipes_count FROM users u LEFT JOIN recipes r ON r.user_id = u.id WHERE u.id = $1 GROUP BY u.first_name, u.last_name, u.bio, u.avatar_id, u.avatar_extension;'

        const userInfo = await db.query(text, values);
        if (!userInfo.rows.length) {
            throw new NoUserError(`There is no user with ${userId} id`);
        }

        return userInfo.rows[0];
    }

    async updateUser(userId, first_name, last_name, bio, image_id, image_extension) {
        validateUserUpdate(userId, first_name, last_name, bio, image_id, image_extension);

        const values = [userId];

        const checkText = 'SELECT id FROM users WHERE id = $1';
        const checkResult = await db.query(checkText, values);

        if (!checkResult.rows.length) {
            throw new NoUserError(`There is no user with ${userId} id`);
        }

        const updateValues = [first_name, last_name, bio, image_id, image_extension, userId];
        const updateText = 'UPDATE users SET first_name = $1, last_name = $2, bio = $3, avatar_id = $4, avatar_extension = $5 WHERE id = $6';

        return db.query(updateText, updateValues);
    }
}

export default new UserModel();