const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const permissions = require('../middleware/permissions');

router.post('/users/auth/', sessionsController.createSession);
router.get('/users/auth/', permissions.permissionCheck(0), sessionsController.getSessionList);
router.delete('/user/auth/', permissions.authentication(), sessionsController.deleteSession);
router.delete('/users/:userID([0-9]+)/auth/', permissions.permissionCheck(0), sessionsController.deleteSessionID);
router.put('/users/:userID([0-9]+)/auth/', permissions.permissionCheck(0), sessionsController.updateSession);

module.exports = router;
