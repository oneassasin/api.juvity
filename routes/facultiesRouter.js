const express = require('express');
const router = express.Router();
const facultiesController = require('../controllers/facultiesController');
const permissions = require('../middleware/permissions');
const exister = require('../middleware/exister');

router.get('/institutions/:instituteID([0-9]+)/faculties/', facultiesController.getFacultiesList);
router.post('/institutions/:instituteID([0-9]+)/faculties/', permissions.permissionCheck(6), exister.institute(), facultiesController.createFaculty);
router.put('/institutions/:instituteID([0-9]+)/faculties/:facultyID([0-9]+)/', permissions.permissionCheck(6), facultiesController.updateFaculty);
router.delete('/institutions/:instituteID([0-9]+)/faculties/:facultyID([0-9]+)/', permissions.permissionCheck(6), facultiesController.deleteFaculty);

module.exports = router;
