const express = require('express');
const router = express.Router();
const userRolesController = require('../controllers/userRolesController');
const permissions = require('../middleware/permissions');

router.get('/userRoles/', permissions.authentication(), userRolesController.getUserRoles);
router.post('/userRoles/', permissions.permissionCheck(2), userRolesController.createUserRoleId);
router.put('/userRoles/:roleID([0-9]+)/', permissions.permissionCheck(2), userRolesController.updateUserRole);
router.delete('/userRoles/:roleID([0-9]+)/', permissions.permissionCheck(2), userRolesController.deleteUserRole);

module.exports = router;
