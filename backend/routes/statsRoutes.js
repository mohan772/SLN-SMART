const express = require('express');
const { getSiteStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/', getSiteStats);

module.exports = router;
