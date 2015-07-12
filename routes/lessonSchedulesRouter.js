const express = require('express');
const router = express.Router();
const lessonSchedulesController = require('../controllers/lessonSchedulesController');
const permissions = require('../middleware/permissions');

router.get('/lessonSchedules/', lessonSchedulesController.getLessonSchedules);
router.post('/lessonSchedules/', permissions.permissionCheck(9), lessonSchedulesController.createLessonSchedule);
router.delete('/lessonSchedules/:lessonScheduleID([0-9]+)/', permissions.permissionCheck(9), lessonSchedulesController.deleteLessonSchedule);

module.exports = router;
