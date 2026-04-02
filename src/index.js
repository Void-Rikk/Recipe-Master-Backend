import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import recipeRouter from "./recipe-router.js";


dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", recipeRouter);

function startApp() {
    app.listen(PORT, () => console.log(`SERVER STARTED AT PORT: ${PORT}`));
}

startApp();