import { Router } from "express";
import CommentsController from "../controllers/comments-controller.js";


const commentsRouter = new Router();

commentsRouter.get("/comments/:recipeId", CommentsController.getComments);
commentsRouter.post("/comments/:recipeId", CommentsController.uploadComment);

export default commentsRouter;