const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');
const permissions = require('../middleware/permissions');

router.get('/lessons/', lessonsController.getLessonID);
router.post('/lessons/', permissions.permissionCheck(9), lessonsController.createLesson);
router.delete('/lessons/:lessonID([0-9]+)/', permissions.permissionCheck(9), lessonsController.deleteLesson);

module.exports = router;
