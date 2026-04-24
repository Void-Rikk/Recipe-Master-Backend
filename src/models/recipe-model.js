import { db } from "../db/db.js";


class RecipeModel {
    async createRecipe() {

    }

    async getAllRecipes(searchQuery='') {
        searchQuery += '%';
        const text = `SELECT r.id, r.name, r.user_id, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id JOIN likes l ON r.id = l.recipe_id WHERE r.name ILIKE $1 GROUP BY r.id, r.name, r.user_id, r.name, r.id, u.first_name, u.last_name;`;
        const values = [searchQuery];

        return await db.query(text, values);
    }

    async getAllRecipesWithLiked(userId, searchQuery='') {
        searchQuery += '%'
        const likesValues = [userId];
        const likesText = 'SELECT recipe_id FROM likes WHERE user_id = $1';

        const recipesValues = [searchQuery];
        const recipesText = 'SELECT r.id, r.name, r.user_id, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id JOIN likes l ON r.id = l.recipe_id WHERE r.name ILIKE $1 GROUP BY r.id, r.name, r.user_id, r.name, r.id, u.first_name, u.last_name;';

        const recipes = await db.query(recipesText, recipesValues);
        const likes = await db.query(likesText, likesValues);

        return { recipes: recipes.rows, likes: likes.rows };
    }

    async toggleLike(userId, recipeId, likeState) {
        const values = [userId, recipeId];
        let text;
        if (likeState === true) {
            text = 'DELETE FROM likes WHERE user_id = $1 AND recipe_id = $2 RETURNING user_id, recipe_id;'
        }
        else {
            text = 'INSERT INTO likes(user_id, recipe_id) VALUES ($1, $2) RETURNING user_id, recipe_id;'
        }

        return await db.query(text, values);
    }
}

export default new RecipeModel();