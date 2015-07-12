const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const permissions = require('../middleware/permissions');

router.get('/students/', studentsController.getStudents);
router.post('/students/', permissions.permissionCheck(8), studentsController.createStudent);
router.put('/students/:studentID([0-9]+)/', permissions.permissionCheck(8), studentsController.updateStudent);
router.delete('/students/:studentID([0-9]+)/', permissions.permissionCheck(8), studentsController.deleteStudent);

module.exports = router;
