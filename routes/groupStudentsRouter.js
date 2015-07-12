const express = require('express');
const router = express.Router();
const groupStudentsController = require('../controllers/groupStudentsController');
const permissions = require('../middleware/permissions');

router.get('/groups/:groupID([0-9]+)/students/', groupStudentsController.getStudentsByGroup);
router.post('/groups/:groupID([0-9]+)/students/', permissions.permissionCheck(8), groupStudentsController.addStudentToGroup);
router.delete('/groups/:groupID([0-9]+)/students/:studentID([0-9]+)/', permissions.permissionCheck(8), groupStudentsController.deleteStudentFromGroup);

module.exports = router;
