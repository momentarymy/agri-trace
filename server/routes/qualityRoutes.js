const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/qualityController');

router.post('/', qualityController.create);
router.get('/batch/:batchId', qualityController.getByBatch);
router.get('/', qualityController.getAll);

module.exports = router;
