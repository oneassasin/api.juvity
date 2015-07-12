const express = require('express');
const router = express.Router();
const lessonTypesController = require('../controllers/lessonTypesController');
const permissions = require('../middleware/permissions');

router.get('/lessonTypes/', lessonTypesController.getLessonTypeID);
router.post('/lessonTypes/', permissions.permissionCheck(9), lessonTypesController.createLessonType);
router.put('/lessonTypes/:lessonTypesID([0-9]+)/', permissions.permissionCheck(9), lessonTypesController.updateLessonType);
router.delete('/lessonTypes/:lessonTypesID([0-9]+)/', permissions.permissionCheck(9), lessonTypesController.deleteLessonType);

module.exports = router;
