import CommentsModel from "../models/comments-model.js";
import { ValidationError } from "../utils/errors.js";


class CommentsController {

    async getComments(req, res) {

    }

    async uploadComment(req, res) {
        const { recipeId } = req.params;
        const { userId, content } = req.body;

        try {
            const result = await CommentsModel.uploadComment(recipeId, userId, content);
            return res.status(200).json({ id: result.rows[0].id });
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new CommentsController();