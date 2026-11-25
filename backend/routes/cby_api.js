/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_express = require('express');
const cby_healthController = require('../controllers/cby_healthController');
const cby_dbTestController = require('../controllers/cby_dbTestController');
const cby_newsController = require('../controllers/cby_newsController');
const cby_galleryController = require('../controllers/cby_galleryController');
const cby_chatController = require('../controllers/cby_chatController');
const cby_kbController = require('../controllers/cby_kbController');
const cby_visionController = require('../controllers/cby_visionController');
const cby_asrController = require('../controllers/cby_asrController');
const cby_upload = require('../middlewares/cby_upload');

const cby_router = cby_express.Router();

// GET /api/health —— 服务健康检查
cby_router.get('/health', cby_healthController.cby_getHealth);

// POST /api/db-test —— 测试 MySQL 连接并读取数据库版本
cby_router.post('/db-test', cby_dbTestController.cby_testDb);

// GET /api/news —— 返回全部科技新闻（按发布时间倒序）
cby_router.get('/news', cby_newsController.cby_getNews);

// GET /api/gallery —— 返回全部图文数据（按创建时间倒序）
cby_router.get('/gallery', cby_galleryController.cby_getGallery);

// POST /api/chat —— 在线客服，调用硅基流动大模型生成回复
cby_router.post('/chat', cby_chatController.cby_chat);

// 知识库（RAG）：上传解析、文档管理、向量检索问答
cby_router.post('/kb/upload', cby_upload.cby_uploadDoc.single('cby_file'), cby_kbController.cby_uploadDocument);
cby_router.get('/kb/documents', cby_kbController.cby_listDocuments);
cby_router.delete('/kb/documents/:id', cby_kbController.cby_deleteDocument);
cby_router.post('/kb/ask', cby_kbController.cby_ask);

// POST /api/vision —— 图像识别，返回图片描述
cby_router.post('/vision', cby_upload.cby_uploadMemory.single('cby_image'), cby_visionController.cby_describeImage);

// POST /api/asr —— 语音识别，七牛 Qwen-Audio-3.0-ASR-Flash
cby_router.post('/asr', cby_upload.cby_uploadMemory.single('cby_audio'), cby_asrController.cby_transcribe);

module.exports = cby_router;
