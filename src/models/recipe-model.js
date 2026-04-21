import { db } from "../db/db.js";


class RecipeModel {
    async createRecipe() {

    }

    async getAllRecipes() {
        const text = 'SELECT r.id, r.name, r.user_id, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id JOIN likes l ON r.id = l.recipe_id GROUP BY r.id, r.name, r.user_id, r.name, r.id, u.first_name, u.last_name;';

        return await db.query(text);
    }

    async getAllRecipesWithLiked(userId) {

    }
}

export default new RecipeModel();