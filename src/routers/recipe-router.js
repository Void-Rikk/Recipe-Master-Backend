import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";

const recipeRouter = new Router();


recipeRouter.post("/createRecipe", RecipeController.create);
recipeRouter.get("/getRecipes", RecipeController.getAll);
recipeRouter.get("/getRecipes/:userId", RecipeController.getAllWithLikes.bind(RecipeController));
recipeRouter.post("/toggleLike", RecipeController.toggleLike);
recipeRouter.post("/searchRecipes", RecipeController.searchRecipes);
recipeRouter.post("/searchRecipes/:userId", RecipeController.searchRecipesWithLikes.bind(RecipeController));

export default recipeRouter;