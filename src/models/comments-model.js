import { validateCommentUploading } from "../utils/utils.js";
import { db } from "../db/db.js";
import { ValidationError } from "../utils/errors.js";


class CommentsModel {

    async getComments(recipeId) {
        if (!recipeId) {
            throw new ValidationError("Missing recipeId");
        }

        const values = [recipeId];
        const text = 'SELECT c.id, c.content, u.id as user_id, u.first_name, u.last_name FROM comments c JOIN users u ON u.id = c.user_id WHERE c.recipe_id = $1;'

        return await db.query(text, values);
    }

    async uploadComment(recipeId, userId, content) {
        validateCommentUploading(recipeId, userId, content);

        const values = [recipeId, userId, content];
        const text = 'INSERT INTO comments(recipe_id, user_id, content) VALUES ($1, $2, $3) RETURNING id;'

        return await db.query(text, values);
    }
}

export default new CommentsModel();