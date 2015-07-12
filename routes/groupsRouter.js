const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');
const permissions = require('../middleware/permissions');
const exister = require('../middleware/exister');

router.get('/departments/:departmentID([0-9]+)/groups/', groupsController.getGroupsList);
router.post('/departments/:departmentID([0-9]+)/groups/', permissions.permissionCheck(8), exister.department(), groupsController.createGroup);
router.put('/departments/:departmentID([0-9]+)/groups/:groupID([0-9]+)/', permissions.permissionCheck(8), groupsController.updateGroup);
router.delete('/departments/:departmentID([0-9]+)/groups/:groupID([0-9]+)/', permissions.permissionCheck(8), groupsController.deleteGroup);

module.exports = router;
