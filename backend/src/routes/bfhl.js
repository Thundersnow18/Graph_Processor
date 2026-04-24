const express = require('express');
const router = express.Router();
const { processGraph } = require('../controller/bfhl');

router.post('/', processGraph);

module.exports = router;
