var express = require('express');
var router = express.Router();
const athleteController = require('../controller/athleteController');

// GET athlete
router.get('/athlete', athleteController.getAthletes);
// GET athlete by id
router.get('/athlete/:id_athlete', athleteController.getAthleteById);
// Search athlete by firstname
router.get('/auto-athlete', athleteController.searchAthleteByFirstName);
// Get data by period
router.get('/total', athleteController.getDataByPeriod);
// Get data athlete by period
router.get('/total-athlete', athleteController.getDataAthleteByPeriod);



module.exports = router;
