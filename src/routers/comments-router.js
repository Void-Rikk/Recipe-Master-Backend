import { Router } from "express";
import CommentsController from "../controllers/comments-controller.js";


const commentsRouter = new Router();

commentsRouter.get("/getComments/:recipeId", CommentsController.getComments);
commentsRouter.post("/uploadComment/:recipeId", CommentsController.uploadComment);

export default commentsRouter;