const express = require('express');
const router = express.Router();
const operationController = require('../controllers/operationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', operationController.getAll);
router.get('/batch/:batchId', operationController.getByBatch);
router.post('/', operationController.create);

module.exports = router;
