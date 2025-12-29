const express = require('express');
const router = express.Router();
const farmlandController = require('../controllers/farmlandController');
const authMiddleware = require('../middleware/authMiddleware');

// 所有接口都需要登录
router.use(authMiddleware);

router.get('/', farmlandController.getAll);
router.post('/', farmlandController.create);
router.delete('/:id', farmlandController.delete);

module.exports = router;
