/*
  作者：曹炳宇
  建立时间：2026-11-13 14:08
  使用大模型：Trae-CN-Proprietary
  功能名称：诗词数据服务器（读取 db.json 的 poems 数组，端口 3004）
*/
const express = require('express');
const fs = require('fs');
const path = require('path');

const cby_PORT = 3004;
const cby_DB_PATH = path.join(__dirname, 'db.json');

const cby_app = express();

// 功能：给所有响应加上跨域头，让用 file:// 直接打开的 poems.html 也能正常请求接口
cby_app.use(function (cby_req, cby_res, cby_next) {
  cby_res.setHeader('Access-Control-Allow-Origin', '*');
  cby_res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  cby_res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (cby_req.method === 'OPTIONS') {
    cby_res.sendStatus(204);
    return;
  }
  cby_next();
});

// 功能：每次请求都重新读取 db.json，返回解析后的对象，保证改完数据刷新页面就能看到
function cby_readDb() {
  const cby_text = fs.readFileSync(cby_DB_PATH, 'utf8');
  return JSON.parse(cby_text);
}

// 功能：接口 /api/poems，把 db.json 里的 poems 数组返回给前端
cby_app.get('/api/poems', function (cby_req, cby_res) {
  try {
    const cby_db = cby_readDb();
    cby_res.json(Array.isArray(cby_db.poems) ? cby_db.poems : []);
  } catch (cby_err) {
    cby_res.status(500).json({ error: '读取 db.json 失败：' + cby_err.message });
  }
});

// 功能：访问其他路径时给出 404 提示，方便排查接口地址写错的问题
cby_app.use(function (cby_req, cby_res) {
  cby_res.status(404).json({ error: '接口不存在，请访问 http://localhost:' + cby_PORT + '/api/poems' });
});

// 功能：启动服务器并打印接口地址
cby_app.listen(cby_PORT, function () {
  console.log('数据服务器已启动：http://localhost:' + cby_PORT + '/api/poems');
});
