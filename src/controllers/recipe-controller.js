

class RecipeController {
    async getAll(req, res) {
        try {
            const recipes = await new Promise((res, rej) => {
                setTimeout(() => res([]), 1000);
            });
            return res.json(recipes);
        }
        catch (e) {
            res.status(500).json(e);
        }
    }
}

export default new RecipeController();