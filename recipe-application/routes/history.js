const router = require('express').Router();

const { query } = require('express');
const database = require('../db');
const recipeAPI = require('recipe-api');

// return json of all the searches in the database
router.get('/', async (req, res) => {
    try {
        const results = await database.find('Results');
        res.json(results);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

// return json of all the searches associated with query parameter
router.get('/:searchTerm', async (req, res) => {
    try {
        const { params } = req;
        const { searchTerm } = params;

        const results = await database.find('Results', searchTerm);
        res.json(results);
    } catch (error) {
        res.status(500).json(error.toString());
    }
});
const router = require('express').Router();

const database = require('../db');

// return json of all the searches in the database
router.get('/', async (req, res) => {
    try {
        const { query } = req;
        const { recipe } = query;
        console.log(recipe);
        if(recipe === undefined){
            const results = await database.find('Results');
            res.json(results);
        } else {
            const results = await database.find('Results', recipe);
            res.json(results);
        }
    } catch (error) {
        res.status(500).json(error.toString());
    }
});

module.exports = router;