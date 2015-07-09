var express = require('express');
var router = express.Router();
var sessionsController = require('../controllers/sessionsController');

router.post('/users/auth/', sessionsController.createSession);
router.get('/users/auth/', sessionsController.getSessionList);
router.delete('/user/auth/', sessionsController.deleteSession);
router.delete('/users/:sessionID([0-9]+)/auth/', sessionsController.deleteSession);
router.update('/users/:sessionID([0-9]+)/auth/', sessionsController.updateSession);

module.exports = router;
