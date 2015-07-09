const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const permissions = require('../middleware/permissions');

router.post('/users/auth/', sessionsController.createSession);
router.get('/users/auth/', sessionsController.getSessionList);
router.delete('/user/auth/', permissions.authentication(), sessionsController.deleteSession);
router.delete('/users/:userID([0-9]+)/auth/', sessionsController.deleteSessionID);
router.put('/users/:userID([0-9]+)/auth/', sessionsController.updateSession);

module.exports = router;
