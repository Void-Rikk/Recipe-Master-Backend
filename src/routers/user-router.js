import { Router } from "express";
import UserController from "../controllers/user-controller.js";


const userRouter = new Router();

userRouter.get("/user/:userId", UserController.getUserInfo);

export default userRouter;