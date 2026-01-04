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
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析 JSON 请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 静态资源托管 (用于访问上传的图片)
app.use('/uploads', express.static('uploads'));

// 路由配置 (Route Configuration)

// 1. 认证与系统管理 (Authentication & System)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // 文件上传

// 2. 生产管理 (Production Management)
app.use('/api/farmlands', farmlandRoutes); // 地块
app.use('/api/batches', batchRoutes);      // 批次
app.use('/api/operations', operationRoutes); // 农事操作
app.use('/api/harvests', harvestRoutes);   // 采摘

// 3. 仓储与物流 (Warehouse & Logistics)
app.use('/api/warehouse', warehouseRoutes); // 仓储
app.use('/api/transports', transportRoutes); // 物流运输

// 4. 质量与物联网 (Quality & IoT)
app.use('/api/quality', qualityRoutes);    // 质检
app.use('/api/iot', iotRoutes);            // 传感器数据

// 5. 溯源与统计 (Traceability & Statistics)
app.use('/api/trace', traceRoutes);        // 溯源查询
app.use('/api/stats', statsRoutes);        // 数据统计

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
