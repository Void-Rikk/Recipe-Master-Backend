import AuthModel from "../models/auth-model.js";


class AuthController {
    async login(req, res) {
        const { first_name, last_name, password } = req.body;

        try {
            const result = await AuthModel.loginUser(first_name, last_name, password);

            return res.status(200).json(result);
        }
        catch (e) {
            if (e.message === "Invalid name/password") {
                return res.status(401).json({ error: e.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async register(req, res) {
        const { first_name, last_name, password } = req.body;

        try {
            const result = await AuthModel.createUser(first_name, last_name, password);

            return res.status(201).json(result.rows[0]);
        }
        catch (e) {
            if (e.message === "User already exists") {
                return res.status(409).json({ error: "User already exists" });
            }
            else {
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    }
}

export default new AuthController();