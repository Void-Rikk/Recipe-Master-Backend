import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";

const recipeRouter = new Router();


recipeRouter.post("/create", RecipeController.create);
recipeRouter.get("/getRecipes", RecipeController.getAll);

export default recipeRouter;