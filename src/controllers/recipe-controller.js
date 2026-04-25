import RecipeModel from "../models/recipe-model.js";


class RecipeController {
    async create(req, res) {
        const { name, description, ingredients, instructions, user_id } = req.body;
        const image_id = req.image_id;
        const parsedIngredients = JSON.parse(ingredients);
        const parsedInstructions = JSON.parse(instructions);

        try {
            const result = await RecipeModel.createRecipe(name, description, image_id, parsedIngredients, parsedInstructions, user_id);

            return res.status(200).json(result);
        }
        catch (e) {
            res.status(400).json({ error: e.message });
        }
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

            const likesMap = this._createLikesMap(result.likes);

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

    async searchRecipes(req, res) {
        const { searchQuery } = req.body;

        try {
            const result = await RecipeModel.getAllRecipes(searchQuery);
            return res.status(200).json(result.rows);
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    async searchRecipesWithLikes(req, res) {
        const { searchQuery } = req.body;
        const { userId } = req.params;

        try {
            const result = await RecipeModel.getAllRecipesWithLiked(userId, searchQuery);

            const likesMap = this._createLikesMap(result.likes);

            return res.status(200).json({ ...result, likes: likesMap });
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }

    _createLikesMap(likes) {
        const likesMap = {};
        likes.forEach(row => {
            likesMap[row.recipe_id] = true;
        })

        return likesMap;
    }
}
export default new RecipeController();