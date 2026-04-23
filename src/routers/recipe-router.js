import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";

const recipeRouter = new Router();


recipeRouter.post("/createRecipe", RecipeController.create);
recipeRouter.get("/getRecipes", RecipeController.getAll);
recipeRouter.get("/getRecipes/:userId", RecipeController.getAllWithLikes);
recipeRouter.post("/toggleLike", RecipeController.toggleLike);

export default recipeRouter;