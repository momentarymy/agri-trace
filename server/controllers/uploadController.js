const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 生成文件名: 时间戳-随机数.扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadImage = upload.single('file'); // 'file' 是前端上传时的 name

exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' });
  }
  // 返回文件访问路径
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
};
