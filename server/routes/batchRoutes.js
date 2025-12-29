const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', batchController.getAll);
router.post('/', batchController.create);

module.exports = router;
