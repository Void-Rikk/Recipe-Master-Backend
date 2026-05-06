import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";
import { recipeImages } from "../storage/storage.js";


const recipeRouter = new Router();


// Home page
recipeRouter.get("/recipes", RecipeController.getAll.bind(RecipeController));
recipeRouter.post("/recipes/search", RecipeController.searchRecipes.bind(RecipeController));

// Recipe page
recipeRouter.get("/recipes/:recipeId", RecipeController.getRecipeById);
recipeRouter.get("/like/:userId/:recipeId", RecipeController.getExactLikeState);

// User page
recipeRouter.get("/recipes/user/:userId", RecipeController.getRecipesByUserId.bind(RecipeController));
recipeRouter.get("/recipes/user/:userId/liked", RecipeController.getRecipesLikedByUser);

// General
recipeRouter.post("/like/:userId/:recipeId", RecipeController.addLike);
recipeRouter.delete("/like/:userId/:recipeId", RecipeController.removeLike);

// Create recipe page
recipeRouter.post("/recipes/create", recipeImages.single("image"), RecipeController.create);

export default recipeRouter;