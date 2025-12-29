const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stocks', warehouseController.getStocks);
router.post('/operate', warehouseController.operateStock);
router.get('/logs', warehouseController.getLogs);

module.exports = router;
