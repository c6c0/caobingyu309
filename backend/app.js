/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_path = require('path');
const cby_dotenv = require('dotenv');

cby_dotenv.config({ path: cby_path.join(__dirname, '.env') });

const cby_express = require('express');
const cby_cors = require('cors');
const cby_apiRouter = require('./routes/cby_api');

const cby_app = cby_express();
const cby_port = 8309;
const cby_frontendDir = cby_path.join(__dirname, '..', 'frontend');

// 课程作业环境：开放全部跨域访问
cby_app.use(cby_cors());
cby_app.use(cby_express.json());
cby_app.use(cby_express.urlencoded({ extended: true }));

// 托管前端静态资源，访问 http://localhost:8309/ 即可打开首页
cby_app.use(cby_express.static(cby_frontendDir));

// 所有接口统一以 /api/ 为前缀
cby_app.use('/api', cby_apiRouter);

cby_app.use('/api', (cby_req, cby_res) => {
  cby_res.status(404).json({ code: 404, msg: '接口不存在', data: {} });
});

cby_app.use((cby_err, cby_req, cby_res, cby_next) => {
  console.error('服务器错误信息：', cby_err);
  cby_res.status(500).json({ code: 500, msg: '服务器内部错误', data: {} });
});

cby_app.listen(cby_port, () => {
  console.log(`后端服务已启动：http://localhost:${cby_port}`);
  console.log(`静态资源目录：${cby_frontendDir}`);
});

module.exports = cby_app;
