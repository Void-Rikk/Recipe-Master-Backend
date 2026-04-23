import RecipeModel from "../models/recipe-model.js";


class RecipeController {
    async create(req, res) {
        const { title, description, image, ingredients, instructions } = req.body;


    }

    async getAll(req, res) {
        try {
            const result = await RecipeModel.getAllRecipes();
            return res.status(200).json(result.rows);
        }
        catch (e) {
            return res.status(500).json("Internal Server Error");
        }
    }

    async getAllWithLikes(req, res) {
        const { userId } = req.params;

        try {
            const result = await RecipeModel.getAllRecipesWithLiked(userId);

            const likesMap = {};
            result.likes.forEach(row => {
                likesMap[row.recipe_id] = true;
            })

            return res.status(200).json({ recipes: result.recipes, likes: likesMap });
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async toggleLike(req, res) {
        const { userId, recipeId, likeState } = req.body;

        if (!userId || !recipeId || likeState === undefined) {
            return res.status(400).json({ error: "Missing required data"});
        }

        try {
            const result = await RecipeModel.toggleLike(userId, recipeId, likeState);
            return res.status(200).json({ ...result, likeState: !likeState});
        }
        catch (e) {
            return res.status(500).json({ error: e.message });
        }
    }
}

export default new RecipeController();