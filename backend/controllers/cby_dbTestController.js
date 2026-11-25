/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_response = require('../middlewares/cby_response');
const cby_db = require('../models/cby_db');

/* POST /api/db-test —— 主机、端口、库名取自 backend/.env；账号密码优先用前端提交值 */
const cby_testDb = async (cby_req, cby_res) => {
  const cby_body = cby_req.body || {};
  const cby_host = process.env.DB_HOST || 'localhost';
  const cby_port = Number(process.env.DB_PORT) || 3306;
  const cby_database = process.env.DB_NAME || '';

  /* 账号密码：前端有提交则用提交值，留空则回退到 .env 的默认凭据；代码中不写死任何凭据 */
  const cby_inputUser = typeof cby_body.cby_username === 'string' ? cby_body.cby_username.trim() : '';
  const cby_inputPassword = typeof cby_body.cby_password === 'string' ? cby_body.cby_password : '';
  const cby_user = cby_inputUser || process.env.DB_USER || '';
  const cby_password = cby_inputPassword !== '' ? cby_inputPassword : (process.env.DB_PASSWORD || '');

  if (!cby_user) {
    cby_response.cby_fail(cby_res, 2, '未提供数据库用户名，且 backend/.env 中也未配置 DB_USER', {});
    return;
  }

  try {
    const cby_version = await cby_db.cby_connectTest({
      cby_host,
      cby_port,
      cby_user,
      cby_password
    });

    cby_response.cby_success(cby_res, '数据库连接成功', {
      cby_version,
      cby_host,
      cby_port,
      cby_database,
      cby_user,
      cby_time: new Date().toISOString()
    });
  } catch (cby_error) {
    console.error('服务器错误信息：数据库连接失败', cby_error.message);
    cby_response.cby_fail(cby_res, 1, `数据库连接失败：${cby_error.message}`, {
      cby_error: cby_error.message,
      cby_code: cby_error.code || '',
      cby_errno: cby_error.errno || null
    });
  }
};

module.exports = { cby_testDb };
