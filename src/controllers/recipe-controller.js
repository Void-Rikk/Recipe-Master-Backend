import RecipeModel from "../models/recipe-model.js";
import { NoRecipeError, NoUserError, ValidationError } from "../utils/errors.js";


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
        const { userId } = req.query;

        try {
            const result = await RecipeModel.getAllRecipes(userId);

            const likesMap = this._createLikesMap(result.likes);

            return res.status(200).json({ recipes: result.recipes, likes: likesMap });
        }
        catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async addLike(req, res) {
        const { userId, recipeId } = req.params;

        try {
            await RecipeModel.addLike(userId, recipeId);
            return res.status(200).json({ status: "success" });
        }
        catch (e) {
            if (e instanceof ValidationError || e instanceof NoRecipeError || e instanceof  NoUserError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: e.message });
        }
    }

    async removeLike(req, res) {
        const { userId, recipeId } = req.params;

        try {
            await RecipeModel.removeLike(userId, recipeId);
            return res.status(200).json({ status: "success" });
        }
        catch (e) {
            if (e instanceof ValidationError || e instanceof NoRecipeError || e instanceof  NoUserError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: e.message });
        }
    }

    async searchRecipes(req, res) {
        const { query } = req.params;
        const { userId } = req.query;

        try {
            const result = await RecipeModel.getAllRecipes(userId, query);

            const likesMap = this._createLikesMap(result.likes);

            return res.status(200).json({ ...result, likes: likesMap });
        }
        catch (e) {
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

    async getRecipesByUserId(req, res) {
        const { userId } = req.params;
        const { currentUserId } = req.query;

        try {
            const result = await RecipeModel.getRecipesByUserId(userId, currentUserId);

            const likesMap = this._createLikesMap(result.likes);

            return res.status(200).json({ recipes: result.recipes, likes: likesMap });
        }
        catch (e) {
            if (e instanceof ValidationError || e instanceof NoUserError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getRecipesLikedByUser(req, res) {
        const { userId } = req.params;

        try {
            const result = await RecipeModel.getRecipesLikedByUser(userId);
            return res.status(200).json(result.rows);
        }
        catch (e) {
            if (e instanceof ValidationError || e instanceof NoUserError) {
                return res.status(400).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
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