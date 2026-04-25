import { db } from "../db/db.js";


class RecipeModel {
    async createRecipe(name, description, image_id, ingredients, instructions, user_id) {
        const recipeText = 'INSERT INTO recipes(name, description, image_id, user_id) VALUES ($1, $2, $3, $4) RETURNING id;';
        const recipesValues = [name, description, image_id, user_id];

        const recipeId = (await db.query(recipeText, recipesValues)).rows[0].id;

        const ingredientsTextValues = ingredients
            .map((item, idx) => `($1, $${idx + 2})`)
            .join(', ');
        const ingredientsValues = [recipeId, ...ingredients.map(item => item.description)];
        const ingredientsText = `INSERT INTO ingredients(recipe_id, description) VALUES ${ingredientsTextValues};`;

        const instructionsTextValues = instructions
            .map((item, idx) => `($1, $${idx + 2}, $${instructions.length + idx + 2})`)
            .join(', ');
        const instructionsValues = [recipeId, ...instructions.map((item, idx) => Number(idx + 1)), ...instructions.map(item => item.description)];
        const instructionsText = `INSERT INTO instructions(recipe_id, display_order, description) VALUES ${instructionsTextValues};`;

        await db.query(ingredientsText, ingredientsValues);
        await db.query(instructionsText, instructionsValues);
        return { status: "Success", message: "Recipe was successfully created" };
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
        const recipesText = 'SELECT r.id, r.name, r.user_id, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE r.name ILIKE $1 GROUP BY r.id, r.name, r.user_id, r.created_at, u.first_name, u.last_name ORDER BY r.created_at DESC;';

        const recipes = await db.query(recipesText, recipesValues);
        const likes = await db.query(likesText, likesValues);

        console.log(recipes.rows);

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