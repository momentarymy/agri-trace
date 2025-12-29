const express = require('express');
const router = express.Router();
const traceController = require('../controllers/traceController');

// 溯源接口通常不需要登录即可访问（消费者扫码）
router.get('/:batchId', traceController.getTraceInfo);

module.exports = router;
