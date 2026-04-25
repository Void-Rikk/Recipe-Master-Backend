import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/recipe-images');
    },
    filename: (req, file, callback) => {
        const uuid = uuidv4();

        req.image_id = uuid;

        const ext = path.extname(file.originalname);
        callback(null, uuid + ext);
    }
});

export const recipeImages = multer({ storage });