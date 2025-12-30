const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/realtime', iotController.getRealTimeData);
router.get('/history', iotController.getHistoryData);
router.post('/report', iotController.reportData);

module.exports = router;
