import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import recipeRouter from "./routers/recipe-router.js";
import authRouter from "./routers/auth-router.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", recipeRouter);
app.use("/api", authRouter);
app.use("/api/user-avatars", express.static("static/user-avatars"));
app.use("/api/recipe-images", express.static("static/recipe-images"));

function startApp() {
    app.listen(PORT, () => {
        console.log(`SERVER STARTED AT PORT: ${PORT}`);
    });
}

startApp();