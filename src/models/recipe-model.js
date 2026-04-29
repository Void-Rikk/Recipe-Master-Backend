import { db } from "../db/db.js";
import { NoRecipeError, ValidationError } from "../utils/errors.js";
import { validateRecipeCreation } from "../utils/utils.js";


class RecipeModel {
    async createRecipe(name, description, image_id, image_extension, ingredients, instructions, user_id) {
        validateRecipeCreation(name, description, image_id, image_extension, ingredients, instructions, user_id);

        const recipeText = 'INSERT INTO recipes(name, description, image_id, image_extension, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id;';
        const recipesValues = [name, description, image_id, image_extension, user_id];

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
        searchQuery = '%' + searchQuery + '%';

        const text = `SELECT r.id, r.name, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE r.name ILIKE $1 GROUP BY r.id, u.id, r.created_at ORDER BY r.created_at DESC;`;
        const values = [searchQuery];

        return await db.query(text, values);
    }

    async getAllRecipesWithLiked(userId, searchQuery='') {
        if (!userId) {
            throw new ValidationError("Missing userId");
        }

        searchQuery = '%' + searchQuery + '%';

        const likesValues = [userId];
        const likesText = 'SELECT recipe_id FROM likes WHERE user_id = $1';

        const recipesValues = [searchQuery];
        const recipesText = 'SELECT r.id, r.name, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE r.name ILIKE $1 GROUP BY r.id, u.id, r.created_at ORDER BY r.created_at DESC;';

        const recipes = await db.query(recipesText, recipesValues);
        const likes = await db.query(likesText, likesValues);

        return { recipes: recipes.rows, likes: likes.rows };
    }

    async toggleLike(userId, recipeId, likeState) {
        if (!userId || !recipeId || likeState === undefined) {
            throw new ValidationError("Missing required data");
        }

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

    async getRecipeById(recipeId) {
        if (!recipeId) {
            throw new ValidationError("Missing recipeId");
        }

        const values = [recipeId];

        const recipeText = 'SELECT r.name, r.description, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT as likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE r.id = $1 GROUP BY r.id, u.id;';
        const ingredientsText = 'SELECT i.id, i.description FROM ingredients i WHERE i.recipe_id = $1;';
        const instructionsText = 'SELECT i.id, i.description, i.display_order FROM instructions i WHERE i.recipe_id = $1;';

        const recipe = await db.query(recipeText, values);
        const ingredients = await db.query(ingredientsText, values);
        const instructions = await db.query(instructionsText, values);

        if (!recipe.rows.length) {
            throw new NoRecipeError(`There is no recipe with ${ recipeId } id`);
        }

        return {
            recipe: recipe.rows[0],
            ingredients: ingredients.rows,
            instructions: instructions.rows,
        };
    }

    async getExactLikeState(userId, recipeId) {
        if (!userId || !recipeId) {
            throw new Error("Missing required data");
        }

        const values = [userId, recipeId];
        const text = 'SELECT * FROM likes WHERE user_id = $1 AND recipe_id = $2;';

        const result = await db.query(text, values);

        return !!result.rows.length;
    }

    async getRecipesByUserId(userId) {
        if (!userId) {
            throw new ValidationError("Missing required data");
        }

        const values = [userId];
        const text = 'SELECT r.id, r.name, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE u.id = $1 GROUP BY r.id, u.id, r.created_at ORDER BY r.created_at DESC;';

        return await db.query(text, values);
    }

    async getRecipesByUserIdWithLikes(userId, currentUserId) {
        if (!userId || !currentUserId) {
            throw new ValidationError("Missing required data");
        }

        const likesValues = [currentUserId];
        const likesText = 'SELECT recipe_id FROM likes WHERE user_id = $1';

        const recipesValues = [userId];
        const recipesText = 'SELECT r.id, r.name, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE u.id = $1 GROUP BY r.id, u.id, r.created_at ORDER BY r.created_at DESC;';

        const recipes = await db.query(recipesText, recipesValues);
        const likes = await db.query(likesText, likesValues);

        return { recipes: recipes.rows, likes: likes.rows };
    }

    async getRecipesLikedByUser(userId) {
        if (!userId) {
            throw new ValidationError("Missing required data");
        }

        const values = [userId];
        const text = 'SELECT r.id, r.name, r.user_id, r.image_id, r.image_extension, u.first_name, u.last_name, COUNT(l.user_id)::INT AS likes_count FROM recipes r JOIN users u ON r.user_id = u.id LEFT JOIN likes l ON r.id = l.recipe_id WHERE r.id IN (SELECT l2.recipe_id FROM likes l2 WHERE l2.user_id = $1) GROUP BY r.id, u.id, r.created_at ORDER BY r.created_at DESC;';

        return await db.query(text, values);
    }
}

export default new RecipeModel();