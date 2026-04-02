const testRecipes = [
    {id: "1", name: "Spaghetti", author: {id: "1", firstname: "John", lastname: "Johnson"}, likes: 12, isLiked: false},
    {id: "2", name: "Burger", author: {id: "2", firstname: "Ken", lastname: "Clash"}, likes: 2, isLiked: true},
    {id: "3", name: "Pickles", author: {id: "3", firstname: "Alex", lastname: "Melikh"}, likes: 10, isLiked: false},
    {id: "4", name: "Pizza", author: {id: "4", firstname: "Danil", lastname: "Bratsev"}, likes: 5, isLiked: true},
    {id: "5", name: "Pasta", author: {id: "5", firstname: "Bruh", lastname: "Bruhov"}, likes: 0, isLiked: false},
    {id: "6", name: "Cake", author: {id: "6", firstname: "Lian", lastname: "Li"}, likes: 34, isLiked: true}
];

class RecipeController {
    async getAll(req, res) {
        try {
            const recipes = await new Promise((res, rej) => {
                setTimeout(() => res(testRecipes), 1000);
            });
            return res.json(recipes);
        }
        catch (e) {
            res.status(500).json(e);
        }
    }
}

export default new RecipeController();