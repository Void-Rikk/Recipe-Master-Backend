import { NoUserError, ValidationError } from "../utils/errors.js";
import UserModel from "../models/user-model.js";


class UserController {

    async getUserInfo(req, res) {
        const { userId } = req.params;

        try {
            const userInfo = await UserModel.getUserInfo(userId);
            return res.status(200).json(userInfo);
        }
        catch (e) {
            if (e instanceof ValidationError) {
                return res.status(400).json({ error: e.message });
            }
            else if (e instanceof NoUserError) {
                return res.status(404).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new UserController();