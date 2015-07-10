const express = require('express');
const router = express.Router();
const institutionsController = require('../controllers/institutionsController');
const permissions = require('../middleware/permissions');

router.get('/universities/:universityID([0-9]+)/institutions', institutionsController.getInstitutions);
router.post('/universities/:universityID([0-9]+)/institutions', permissions.permissionCheck(3), institutionsController.createInstitute);
router.put('/universities/:universityID([0-9]+)/institutions/:instituteID([0-9]+)', permissions.permissionCheck(3), institutionsController.updateInstitute);
router.delete('/universities/:universityID([0-9]+)/institutions/:instituteID([0-9]+)', permissions.permissionCheck(3), institutionsController.deleteInstitute);

module.exports = router;
