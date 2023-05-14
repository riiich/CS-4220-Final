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
        // const idVal = req.path.split('/');
        // query.metadata = {
        //     selections : []
        // };

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

    const val = await database.find('Results', recipe);

    if(val === null){   
        database.save('Results', {searchTerm : recipe, searchCount : promptedRecipes.length, 
            lastSearched : metadata.lastSearched});
    } else {
        database.update('Results', recipe, {lastSearched : metadata.lastSearched});
    }
});

router.get('/:recipeID/details', async (req, res) => {
    try{
        const {params, query} = req;

        const {recipeID} = params;

        const {recipe, metadata} = query;
        
        const detailsRecipe = await recipeAPI.recipeDetails(recipeID);
        const ingrList = [];

        detailsRecipe.recipe.ingredientLines.forEach(i => {
            ingrList.push(i);
        });

        console.log(detailsRecipe);

        const results = {
            dishName: detailsRecipe.recipe.label,
            mealType : detailsRecipe.recipe.mealType[0],
            dishType: detailsRecipe.recipe.dishType[0],
            cuisineType: detailsRecipe.recipe.cuisineType[0],
            totalTime : detailsRecipe.recipe.totalTime,
            ingredients : ingrList,
            calories : detailsRecipe.recipe.calories
        };

        res.json(results);

        const original = await database.find('Results', recipe);

        if(original !== null){
            if ('selections' in original){
                database.update('Results', recipe, 
                    {...original, selections : original.selections.concat([{id : recipeID, results}])});

            } else {
                database.update('Results', recipe, 
                    {...original, selections : [{id : recipeID, results}]});
            }
        } else {
            console.log('recipe is not in database yet');
        }


    } catch (error) {
        console.log(error);
    }
});

module.exports = router;