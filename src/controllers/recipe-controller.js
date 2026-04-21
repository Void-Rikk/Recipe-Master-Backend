import RecipeModel from "../models/recipe-model.js";


class RecipeController {
    async create(req, res) {
        const { title, description, image, ingredients, instructions } = req.body;


    }

    async getAll(req, res) {
        const userId = req.query.uid;

        try {
            let result;
            if (userId !== undefined) {
                return res.status(200).json({ "poka": "ne dodelal" });
                // result = await RecipeModel.getAllRecipesWithLiked(userId);
            }
            else {
                result = await RecipeModel.getAllRecipes();
                return res.status(200).json(result.rows);
            }
        }
        catch (e) {
            return res.status(500).json("Internal Server Error");
        }
    }
}

export default new RecipeController();