const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController')
const homeController = require('../controllers/homeController')
const usersController = require('../controllers/usersController')
const adminController = require('../controllers/adminController')
const groupsController = require('../controllers/groupsController')

module.exports = function() {
    router.get('/', homeController.home);

    router.get('/confirm-account/:email', usersController.confirmAccount);

    router.get('/signUp', usersController.singUpForm);
    router.post('/signUp', usersController.createNewUser);

    router.get('/signIn', usersController.singInForm);
    router.post('/signIn', authController.authenticateUser);


    router.get('/administration', authController.authenticatedUser ,adminController.administrationPanel)

    router.get('/new-group', authController.authenticatedUser, groupsController.newGroupForm)
    router.post('/new-group',
         authController.authenticatedUser, 
         groupsController.uploadImage, 
         groupsController.newGroup
        )



    return router;
}