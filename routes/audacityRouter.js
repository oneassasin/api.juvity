const express = require('express');
const router = express.Router();
const audacityController = require('../controllers/audacityController');
const permissions = require('../middleware/permissions');
const exister = require('../middleware/exister');

router.get('/groups/:groupID([0-9]+)/time/:time([0-9]+)', audacityController.getAudacityTable);
router.post('/groups/:groupID([0-9]+)/time/:time([0-9]+)', permissions.permissionCheck(10), exister.group(), audacityController.createAudacity);
router.put('/groups/:groupID([0-9]+)/time/:time([0-9]+)', permissions.permissionCheck(10), exister.group(), audacityController.updateAudacity);

module.exports = router;
