const express = require('express');
const router = express.Router();
const { processGraph } = require('../controller/graph');

router.post('/', processGraph);

module.exports = router;
