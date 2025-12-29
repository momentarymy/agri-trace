const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', transportController.getList);
router.post('/', transportController.create);
router.post('/:id/arrive', transportController.arrive);
router.post('/:id/temp', transportController.addTempLog);

module.exports = router;
