import { Router } from "express";
import UserController from "../controllers/user-controller.js";
import { userAvatars } from "../storage/storage.js";


const userRouter = new Router();

userRouter.get("/user/:userId", UserController.getUserInfo);
userRouter.patch("/updateUser/:userId", userAvatars.single("image"), UserController.updateUser);

export default userRouter;