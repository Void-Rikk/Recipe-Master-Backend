import { NoUserError, ValidationError } from "../utils/errors.js";
import { db } from "../db/db.js";


class UserModel {

    async getUserInfo(userId) {
        if (!userId) {
            throw new ValidationError("Missing userId");
        }

        const values = [userId];
        const text = 'SELECT u.first_name, u.last_name, u.bio, u.avatar_id, u.avatar_extension, COUNT(r) FROM users u LEFT JOIN recipes r ON r.user_id = u.id WHERE u.id = $1 GROUP BY u.first_name, u.last_name, u.bio, u.avatar_id, u.avatar_extension;'

        const userInfo = await db.query(text, values);
        if (!userInfo.rows.length) {
            throw new NoUserError(`There is no user with ${userId} id`);
        }

        return userInfo.rows[0];
    }
}

export default new UserModel();