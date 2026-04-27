import { ValidationError } from "./errors.js";

export function validateAuth(first_name, last_name, password) {
    if (!first_name || !last_name || !password) {
        throw new ValidationError("Missing required fields");
    }
    else if (first_name.length < 2) {
        throw new ValidationError("First name must contain at least 2 characters");
    }
    else if (last_name.length < 2) {
        throw new ValidationError("Last name must contain at least 2 characters");
    }
    else if (password.length < 8) {
        throw new ValidationError("Password must contain at least 8 characters");
    }
}

export function validateRecipeCreation(name, description, image_id, image_extension, ingredients, instructions, user_id) {
    if (!name || !description || !image_id || !image_extension || !ingredients.length || !instructions.length || !user_id) {
        throw new ValidationError("Missing required fields");
    }
}

export function validateCommentUploading(recipeId, userId, content) {
    if (!recipeId || !userId || !content) {
        throw new ValidationError("Missing required data");
    }
    if (content.length === 0) {
        throw new ValidationError("Comment text can`t be empty");
    }
}