const express = require('express');
const router = express.Router();
const groupLessonsController = require('../controllers/groupLessonsController');
const permissions = require('../middleware/permissions');

router.get('/groups/:groupID([0-9]+)/lessons/', groupLessonsController.getLessonsByGroup);
router.post('/groups/:groupID([0-9]+)/lessons/', permissions.permissionCheck(8), groupLessonsController.addLessonToGroup);
router.delete('/groups/:groupID([0-9]+)/lessons/:lessonsID([0-9]+)/', permissions.permissionCheck(8), groupLessonsController.deleteLessonFromGroup);

module.exports = router;
