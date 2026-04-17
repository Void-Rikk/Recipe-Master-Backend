import { Router } from "express";
import RecipeController from "../controllers/recipe-controller.js";

const recipeRouter = new Router();


recipeRouter.get("/recipes", RecipeController.getAll);

export default recipeRouter;