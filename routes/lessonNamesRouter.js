const express = require('express');
const router = express.Router();
const lessonNamesController = require('../controllers/lessonNamesController');
const permissions = require('../middleware/permissions');

router.get('/lessonNames/', lessonNamesController.getLessonNameID);
router.post('/lessonNames/', permissions.permissionCheck(9), lessonNamesController.createLessonName);
router.put('/lessonNames/:lessonNameID([0-9]+)/', permissions.permissionCheck(9), lessonNamesController.updateLessonName);
router.delete('/lessonNames/:lessonNameID([0-9]+)/', permissions.permissionCheck(9), lessonNamesController.deleteLessonName);

module.exports = router;
