/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_express = require('express');
const cby_healthController = require('../controllers/cby_healthController');

const cby_router = cby_express.Router();

// GET /api/health —— 服务健康检查
cby_router.get('/health', cby_healthController.cby_getHealth);

module.exports = cby_router;
