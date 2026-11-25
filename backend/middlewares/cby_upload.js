/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_fs = require('fs');
const cby_path = require('path');
const cby_multer = require('multer');

/* 知识库原文件保存目录（不进版本库，删除文档时同步清理） */
const cby_uploadDir = cby_path.join(__dirname, '..', 'cby_uploads');
cby_fs.mkdirSync(cby_uploadDir, { recursive: true });

/* multer 默认按 latin1 解析文件名，这里转回 UTF-8，避免中文文件名乱码 */
const cby_decodeName = (cby_name) => {
  if (!cby_name) return '未命名文件';
  if (/[^\u0000-\u00ff]/.test(cby_name)) return cby_name;
  try {
    const cby_fixed = Buffer.from(cby_name, 'latin1').toString('utf8');
    return cby_fixed.includes('\ufffd') ? cby_name : cby_fixed;
  } catch (cby_error) {
    return cby_name;
  }
};

const cby_storage = cby_multer.diskStorage({
  destination: (cby_req, cby_file, cby_cb) => cby_cb(null, cby_uploadDir),
  filename: (cby_req, cby_file, cby_cb) => {
    const cby_ext = cby_path.extname(cby_decodeName(cby_file.originalname)).toLowerCase();
    cby_cb(null, `cby_kb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${cby_ext}`);
  }
});

/* 知识库文件落盘保存，便于查看与重新解析 */
const cby_uploadDoc = cby_multer({
  storage: cby_storage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

/* 图片与音频只在内存中处理，不落盘 */
const cby_uploadMemory = cby_multer({
  storage: cby_multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = { cby_uploadDoc, cby_uploadMemory, cby_decodeName, cby_uploadDir };
