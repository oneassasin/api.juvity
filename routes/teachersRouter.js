const express = require('express');
const router = express.Router();
const teachersController = require('../controllers/teachersController');
const permissions = require('../middleware/permissions');
const exister = require('../middleware/exister');

router.get('/departments/:departmentID([0-9]+)/teachers/', teachersController.getTeachersList);
router.post('/departments/:departmentID([0-9]+)/teachers/', permissions.permissionCheck(7), exister.department(), teachersController.createTeacher);
router.put('/departments/:departmentID([0-9]+)/teachers/:teacherID([0-9]+)/', permissions.permissionCheck(7), teachersController.updateTeacher);
router.delete('/departments/:departmentID([0-9]+)/teachers/:teacherID([0-9]+)/', permissions.permissionCheck(7), teachersController.deleteTeacher);

module.exports = router;
