const router = require('express').Router();

const { query } = require('express');
const database = require('../db');
const recipeAPI = require('recipe-api');

const _formatRecipe = (recipes) => {
    return recipes.map((recipe) => {
        const id = (recipe.recipe.uri).split('_');
        return {
            recipeName: recipe.recipe.label,
            recipeID: id[1]
        };
    });
};

router.use((req, res, next) => {
    console.log('Middleware is running');

    const { headers, query } = req;

    if(req.path === '/'){
        query.metadata = {
            lastSearched : new Date()
        };

    } else if (req.path.includes('details')){

    }

    next();
});

router.get('/', async (req, res) => {
    const {query} = req;

    const {recipe, metadata} = query;

    const recipes = await recipeAPI.findRecipe(recipe);

    const promptedRecipes = _formatRecipe(recipes.hits);

    const results = {results : promptedRecipes};

    res.json(results);

    database.save('Results', {recipe, searchCount : promptedRecipes.length, lastSearched : metadata.lastSearched});
});

router.get('/:recipeID/details', async (req, res) => {
    try{
        const {params, query} = req;

        const {recipeID} = params;
        
        const details = await recipeAPI.recipeDetails(recipeID);
        const ingrList = [];

        details.recipe.ingredientLines.forEach(i => {
            ingrList.push(i);
        });

        const results = {mealType : details.recipe.mealType,
            dishType: details.recipe.dishType,
            cusineType: details.recipe.cuisineType,
            totalTime : details.recipe.totalTime,
            ingredient : ingrList,
            calories : details.recipe.calories
        };

        res.json(results);

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;