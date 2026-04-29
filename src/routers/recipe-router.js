import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";
import { recipeImages } from "../storage/storage.js";

const recipeRouter = new Router();


recipeRouter.get("/getRecipe/:recipeId", RecipeController.getRecipeById);
recipeRouter.get("/getRecipes", RecipeController.getAll);
recipeRouter.get("/getRecipes/:userId", RecipeController.getAllWithLikes.bind(RecipeController));
recipeRouter.get("/getLikeState/:userId/:recipeId", RecipeController.getExactLikeState);
recipeRouter.get("/getRecipesByUserId/:userId", RecipeController.getRecipesByUserId);
recipeRouter.get("/getRecipesByUserIdWithLikes/:userId/:currentUserId", RecipeController.getRecipesByUserIdWithLikes.bind(RecipeController));
recipeRouter.get("/getRecipesLikedByUser/:userId", RecipeController.getRecipesLikedByUser);
recipeRouter.post("/toggleLike", RecipeController.toggleLike);
recipeRouter.post("/searchRecipes", RecipeController.searchRecipes);
recipeRouter.post("/searchRecipes/:userId", RecipeController.searchRecipesWithLikes.bind(RecipeController));
recipeRouter.post("/createRecipe", recipeImages.single("image"), RecipeController.create);

export default recipeRouter;