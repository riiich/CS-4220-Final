// requirements to make api call
const superagent = require('superagent');
const base = 'https://api.edamam.com/api/recipes/v2';
const appID = '64eae0d9';
const appKey = '6aaa7e8d3f2601815b5b6cc5d293ce4f';

// finding recipes based on ingredient (argument) given through command line
const findRecipe = async (ingredient) => {
    try{
        // creating query to get results
        const recipeURL = `${base}?type=public&q=${ingredient}&app_id=${appID}&app_key=${appKey}`;
        const res = await superagent.get(recipeURL);
        
        // returning the response body in json format
        return res.body;
    } catch(error){
        console.log(error);
    }
};

// finding recipe details based on selected recipe from prompt
const recipeDetails = async (recipeID) => {
    try {
        // reusing past function to get response 
        const recipeIDUrl = `${base}/${recipeID}?type=public&app_id=${appID}&app_key=${appKey}`;
        const res = await superagent.get(recipeIDUrl);

        return res.body;
    }catch (error){
        console.log(error);
    }
};

module.exports = {
    findRecipe,
    recipeDetails
};