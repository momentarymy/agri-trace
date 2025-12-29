const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// 上传图片 (需要登录)
router.post('/image', authMiddleware, uploadController.uploadImage, uploadController.handleUpload);

module.exports = router;
