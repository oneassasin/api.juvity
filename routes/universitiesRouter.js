const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universitiesController');
const permissions = require('../middleware/permissions');

router.get('/universities/', universityController.getUniversities);
router.post('/universities/', permissions.permissionCheck(4), universityController.createUniversity);
router.put('/universities/:universityID([0-9]+)/', permissions.permissionCheck(4), universityController.updateUniversity);
router.delete('/universities/:universityID([0-9]+)/', permissions.permissionCheck(4), universityController.deleteUniversity);

module.exports = router;
