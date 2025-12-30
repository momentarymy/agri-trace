const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const farmlandRoutes = require('./routes/farmlandRoutes');
const batchRoutes = require('./routes/batchRoutes');
const operationRoutes = require('./routes/operationRoutes');
const harvestRoutes = require('./routes/harvestRoutes');
const traceRoutes = require('./routes/traceRoutes');
const transportRoutes = require('./routes/transportRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const iotRoutes = require('./routes/iotRoutes');
const qualityRoutes = require('./routes/qualityRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 静态资源托管 (用于访问上传的图片)
app.use('/uploads', express.static('uploads'));

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/farmlands', farmlandRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/trace', traceRoutes);
app.use('/api/transports', transportRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/quality', qualityRoutes);

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ 
    message: err.message || '服务器内部错误', 
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
});

// 启动服务
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`
   服务运行中...
  --------------------------
  本地访问: http://localhost:${PORT}
  --------------------------
    `);
  });
};

startServer();
