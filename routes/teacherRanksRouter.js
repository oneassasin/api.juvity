const express = require('express');
const router = express.Router();
const teacherRanksController = require('../controllers/teacherRanksController');
const permissions = require('../middleware/permissions');

router.get('/teacherRanks/', permissions.authentication(), teacherRanksController.getTeacherRanks);
router.post('/teacherRanks/', permissions.permissionCheck(7), teacherRanksController.createTeacherRank);
router.put('/teacherRanks/:teacherRankID([0-9]+)/', permissions.permissionCheck(7), teacherRanksController.updateTeacherRank);
router.delete('/teacherRanks/:teacherRankID([0-9]+)/', permissions.permissionCheck(7), teacherRanksController.deleteTeacherRank);

module.exports = router;
