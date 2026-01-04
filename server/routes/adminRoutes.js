const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// Middleware to check if user is admin (omitted for brevity, but should be here)
// const { protect, admin } = require('../middleware/authMiddleware'); 

router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);

module.exports = router;
