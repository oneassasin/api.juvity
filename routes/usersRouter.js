const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const permissions = require('../middleware/permissions');

router.get('/users/count/', permissions.authentication(), usersController.getUsersCount);
router.get('/users/:userID([0-9]+)/', permissions.authentication(), usersController.getUserId);
router.post('/users/', usersController.createUser);
router.put('/user/', permissions.authentication(), usersController.updateUser);
router.put('/users/:userID([0-9]+)/', permissions.permissionCheck(1), usersController.updateUserId);

module.exports = router;
