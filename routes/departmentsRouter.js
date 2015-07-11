const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');
const permissions = require('../middleware/permissions');
const exister = require('../middleware/exister');

router.get('/faculties/:facultyID([0-9]+)/departments/', departmentsController.getDepartmentsList);
router.post('/faculties/:facultyID([0-9]+)/departments/', permissions.permissionCheck(5), exister.faculty(), departmentsController.createDepartment);
router.put('/faculties/:facultyID([0-9]+)/departments/:departmentID([0-9]+)/', permissions.permissionCheck(5), departmentsController.updateDepartment);
router.delete('/faculties/:facultyID([0-9]+)/departments/:departmentID([0-9]+)/', permissions.permissionCheck(5), departmentsController.deleteDepartment);

module.exports = router;
