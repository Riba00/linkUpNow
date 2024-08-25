const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeCOntroller')
const usersController = require('../controllers/usersController')

module.exports = function() {
    router.get('/', homeController.home);

    router.get('/signUp', usersController.singUpForm);

    return router;
}