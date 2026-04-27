import { validateCommentUploading } from "../utils/utils.js";
import { db } from "../db/db.js";


class CommentsModel {

    async getComments() {

    }

    async uploadComment(recipeId, userId, content) {
        validateCommentUploading(recipeId, userId, content);

        const values = [recipeId, userId, content];
        const text = 'INSERT INTO comments(recipe_id, user_id, content) VALUES ($1, $2, $3) RETURNING id;'

        return await db.query(text, values);
    }
}

export default new CommentsModel();