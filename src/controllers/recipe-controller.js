import RecipeModel from "../models/recipe-model.js";
import { NoRecipeError, ValidationError } from "../utils/errors.js";


class RecipeController {
    async create(req, res) {
        const { name, description, ingredients, instructions, user_id } = req.body;
        const image_id = req.image_id;
        const image_extension = req.image_extension;
        const parsedIngredients = JSON.parse(ingredients);
        const parsedInstructions = JSON.parse(instructions);

        try {
            const result = await RecipeModel.createRecipe(name, description, image_id, image_extension, parsedIngredients, parsedInstructions, user_id);

            return res.status(200).json(result);
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getAll(req, res) {
        try {
            const result = await RecipeModel.getAllRecipes();
            return res.status(200).json(result.rows);
        }
        catch (e) {
            return res.status(500).json("Internal server error");
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
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async toggleLike(req, res) {
        const { userId, recipeId, likeState } = req.body;

        try {
            const result = await RecipeModel.toggleLike(userId, recipeId, likeState);
            return res.status(200).json({ ...result, likeState: !likeState});
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
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
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getRecipeById(req, res) {
        const { recipeId } = req.params;

        try {
            const result = await RecipeModel.getRecipeById(recipeId);
            return res.status(200).json(result);
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            else if (e instanceof NoRecipeError) {
                return res.status(404).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getExactLikeState(req, res) {
        const { userId, recipeId } = req.params;

        try {
            const result = await RecipeModel.getExactLikeState(userId, recipeId);
            return res.status(200).json({ state: result });
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: e.message });
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