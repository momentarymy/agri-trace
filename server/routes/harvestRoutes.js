const express = require('express');
const router = express.Router();
const harvestController = require('../controllers/harvestController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', harvestController.create);
router.get('/batch/:batchId', harvestController.getByBatch);

module.exports = router;
