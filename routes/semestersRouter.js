const express = require('express');
const router = express.Router();
const semestersController = require('../controllers/semestersController');
const permissions = require('../middleware/permissions');

router.get('/semesters/', semestersController.getSemesters);
router.post('/semesters/', permissions.permissionCheck(9), semestersController.createSemester);
router.put('/semesters/:semesterID([0-9]+)/', permissions.permissionCheck(9), semestersController.updateSemester);
router.delete('/semesters/:semesterID([0-9]+)/', permissions.permissionCheck(9), semestersController.deleteSemester);

module.exports = router;
