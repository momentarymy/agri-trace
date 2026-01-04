/* 
  数据库初始化脚本
  运行方式：在 Navicat 或 MySQL 命令行中运行此文件
*/

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS `agri_trace` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `agri_trace`;

-- 2. 用户表 (sys_users)
CREATE TABLE IF NOT EXISTS `sys_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '加密密码',
  `role` ENUM('admin', 'farmer', 'enterprise', 'consumer') NOT NULL DEFAULT 'consumer' COMMENT '角色',
  `phone` VARCHAR(20) COMMENT '手机号',
  `avatar` VARCHAR(255) COMMENT '头像URL',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1正常, 0待审核, 2禁用',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB COMMENT='系统用户表';

-- 3. 地块信息表 (base_farmlands)
CREATE TABLE IF NOT EXISTS `base_farmlands` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT '地块名称',
  `location` VARCHAR(255) COMMENT '地理位置/GPS',
  `area` DECIMAL(10, 2) COMMENT '面积(亩)',
  `owner_id` INT NOT NULL COMMENT '所属农户ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`owner_id`) REFERENCES `sys_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='地块信息表';

-- 4. 生产批次表 (prod_batches) - 核心表
CREATE TABLE IF NOT EXISTS `prod_batches` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_no` VARCHAR(50) NOT NULL UNIQUE COMMENT '批次号',
  `crop_name` VARCHAR(50) NOT NULL COMMENT '农作物名称',
  `farmland_id` INT NOT NULL COMMENT '所属地块',
  `planting_date` DATE COMMENT '种植日期',
  `status` TINYINT DEFAULT 0 COMMENT '状态: 0种植中, 1已采摘, 2已上市',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`farmland_id`) REFERENCES `base_farmlands`(`id`)
) ENGINE=InnoDB COMMENT='生产批次表';

-- 5. 农事操作记录表 (prod_operations)
CREATE TABLE IF NOT EXISTS `prod_operations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `type` VARCHAR(50) NOT NULL COMMENT '操作类型: 施肥/浇水/除虫',
  `description` TEXT COMMENT '操作描述',
  `images` TEXT COMMENT '图片URL集合(JSON格式)',
  `operator` VARCHAR(50) COMMENT '操作人',
  `operate_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='农事操作记录';

-- 6. 溯源码表 (trace_codes)
CREATE TABLE IF NOT EXISTS `trace_codes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) NOT NULL UNIQUE COMMENT '唯一溯源ID',
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `scan_count` INT DEFAULT 0 COMMENT '扫码次数',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='溯源码表';

-- 7. 质量检测表 (quality_checks)
CREATE TABLE IF NOT EXISTS `quality_checks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL,
  `check_item` VARCHAR(100) COMMENT '检测项目',
  `result` ENUM('pass', 'fail') NOT NULL COMMENT '检测结果',
  `report_image` VARCHAR(255) COMMENT '检测报告图',
  `check_date` DATE COMMENT '检测日期',
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='质量检测表';

-- 8. 物流运输表 (logistics_info)
CREATE TABLE IF NOT EXISTS `logistics_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL,
  `transport_no` VARCHAR(50) COMMENT '运单号',
  `vehicle_no` VARCHAR(20) COMMENT '车牌号',
  `driver_name` VARCHAR(50) COMMENT '司机姓名',
  `start_location` VARCHAR(100) COMMENT '出发地',
  `dest_location` VARCHAR(100) COMMENT '目的地',
  `status` TINYINT DEFAULT 0 COMMENT '0运输中, 1已送达',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='物流运输信息';

-- 9. 采摘记录表 (prod_harvests)
CREATE TABLE IF NOT EXISTS `prod_harvests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `harvest_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '采摘时间',
  `quantity` VARCHAR(50) NOT NULL COMMENT '采摘数量',
  `grade` VARCHAR(20) DEFAULT '合格' COMMENT '等级',
  `images` TEXT COMMENT '图片URL集合(JSON)',
  `operator` VARCHAR(50) COMMENT '操作人',
  `notes` TEXT COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='采摘记录表';

-- 10. 库存表 (wh_stocks)
CREATE TABLE IF NOT EXISTS `wh_stocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL UNIQUE COMMENT '关联批次',
  `quantity` DECIMAL(10, 2) NOT NULL DEFAULT 0 COMMENT '当前库存量',
  `unit` VARCHAR(20) DEFAULT 'kg' COMMENT '单位',
  `location` VARCHAR(100) COMMENT '仓库位置',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='库存表';

-- 11. 出入库记录表 (wh_stock_logs)
CREATE TABLE IF NOT EXISTS `wh_stock_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `type` ENUM('in', 'out') NOT NULL COMMENT '类型: in入库, out出库',
  `quantity` DECIMAL(10, 2) NOT NULL COMMENT '数量',
  `operator` VARCHAR(50) NOT NULL COMMENT '操作人',
  `remark` VARCHAR(255) COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='出入库记录表';

-- 12. 物流运输详细表 (logistics_transports)
CREATE TABLE IF NOT EXISTS `logistics_transports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `vehicle_no` VARCHAR(20) NOT NULL COMMENT '车牌号',
  `driver_name` VARCHAR(50) NOT NULL COMMENT '司机姓名',
  `driver_phone` VARCHAR(20) COMMENT '司机电话',
  `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
  `start_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发车时间',
  `end_time` DATETIME COMMENT '到达时间',
  `status` TINYINT DEFAULT 0 COMMENT '0运输中, 1已送达',
  `temperature_logs` TEXT COMMENT '温度记录(JSON)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='物流运输详细表';

-- 13. 传感器数据表 (iot_sensor_data)
CREATE TABLE IF NOT EXISTS `iot_sensor_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transport_id` INT COMMENT '关联运输记录',
  `temperature` DECIMAL(5, 2) NOT NULL COMMENT '温度',
  `humidity` DECIMAL(5, 2) NOT NULL COMMENT '湿度',
  `location` VARCHAR(100) COMMENT 'GPS位置',
  `device_id` VARCHAR(50) NOT NULL COMMENT '设备ID',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`transport_id`) REFERENCES `logistics_transports`(`id`)
) ENGINE=InnoDB COMMENT='传感器数据表';

-- 14. 质量检测记录表 (quality_checks)
CREATE TABLE IF NOT EXISTS `quality_checks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `batch_id` INT NOT NULL COMMENT '关联批次',
  `check_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '检测日期',
  `check_item` VARCHAR(100) NOT NULL COMMENT '检测项目',
  `result` VARCHAR(50) NOT NULL COMMENT '检测结果',
  `inspector` VARCHAR(50) NOT NULL COMMENT '检测员',
  `image` VARCHAR(255) COMMENT '检测报告图片',
  `remarks` TEXT COMMENT '备注',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`batch_id`) REFERENCES `prod_batches`(`id`)
) ENGINE=InnoDB COMMENT='质量检测记录表';

-- 插入测试数据 (管理员账号: admin / 123456)
-- 注意：这里的密码是经过 bcrypt 加密后的密文 ($2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qa8qkrBm 对应 123456)
INSERT INTO `sys_users` (`username`, `password`, `role`, `phone`, `status`) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qa8qkrBm', 'admin', '13800138000', 1),
('farmer01', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7qa8qkrBm', 'farmer', '13900139000', 1);
