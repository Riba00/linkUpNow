const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const usersController = require("../controllers/usersController");
const adminController = require("../controllers/adminController");
const groupsController = require("../controllers/groupsController");
const eventsController = require("../controllers/eventsController");

module.exports = function () {
  router.get("/", homeController.home);

  router.get("/confirm-account/:email", usersController.confirmAccount);

  router.get("/signUp", usersController.singUpForm);
  router.post("/signUp", usersController.createNewUser);

  router.get("/signIn", usersController.singInForm);
  router.post("/signIn", authController.authenticateUser);

  router.get(
    "/administration",
    authController.authenticatedUser,
    adminController.administrationPanel
  );

  // GROUPS
  router.get(
    "/new-group",
    authController.authenticatedUser,
    groupsController.newGroupForm
  );

  router.post(
    "/new-group",
    authController.authenticatedUser,
    groupsController.uploadImage,
    groupsController.newGroup
  );

  router.get(
    "/edit-group/:groupId",
    authController.authenticatedUser,
    groupsController.editGroupForm
  );

  router.post(
    "/edit-group/:groupId",
    authController.authenticatedUser,
    groupsController.editGroup
  );

  router.get(
    "/image-group/:groupId",
    authController.authenticatedUser,
    groupsController.editImageForm
  );

  router.post(
    "/image-group/:groupId",
    authController.authenticatedUser,
    groupsController.uploadImage,
    groupsController.editImage
  );

  router.get(
    "/delete-group/:groupId",
    authController.authenticatedUser,
    groupsController.deleteGroupForm
  );

  router.post(
    "/delete-group/:groupId",
    authController.authenticatedUser,
    groupsController.deleteGroup
  );


  // EVENTS
  router.get(
    "/new-event",
    authController.authenticatedUser,
    eventsController.newEventForm
  );

  router.post(
    "/new-event",
    authController.authenticatedUser,
    eventsController.sanitizeEvent,
    eventsController.newEvent
  );

  router.get('/edit-event/:id', 
    authController.authenticatedUser,
    eventsController.editEventForm
  )

  router.post('/edit-event/:id', 
    authController.authenticatedUser,
    eventsController.editEvent
  )

  router.get('/delete-event/:id',
    authController.authenticatedUser,
    eventsController.deleteEventForm
  )

  router.post('/delete-event/:id',
    authController.authenticatedUser,
    eventsController.deleteEvent
  )

  // PROFILE
  router.get('/edit-profile',
    authController.authenticatedUser,
    usersController.editProfileForm
  )

  router.post('/edit-profile',
    authController.authenticatedUser,
    usersController.editProfile
  )

  router.get('/change-password',
    authController.authenticatedUser,
    usersController.changePasswordForm
  )

  router.post('/change-password',
    authController.authenticatedUser,
    usersController.changePassword
  )
  
  return router;
};