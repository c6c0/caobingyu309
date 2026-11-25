/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_mysql = require('mysql2/promise');

// 数据库凭据仅从 backend/.env 读取，禁止硬编码
const cby_pool = cby_mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const cby_testConnection = async () => {
  const cby_conn = await cby_pool.getConnection();
  try {
    await cby_conn.ping();
    return true;
  } finally {
    cby_conn.release();
  }
};

/* 按调用方传入的凭据建立一次性连接，读取数据库版本后关闭连接 */
/* 凭据由控制器从 backend/.env 与请求参数中取得，本文件不硬编码任何账号密码 */
const cby_connectTest = async (cby_options) => {
  /* mysql2/promise 的 createConnection 返回 Promise，await 后才是 PromiseConnection */
  const cby_conn = await cby_mysql.createConnection({
    host: cby_options.cby_host,
    port: cby_options.cby_port,
    user: cby_options.cby_user,
    password: cby_options.cby_password,
    connectTimeout: 5000
  });

  try {
    const [cby_rows] = await cby_conn.query('SELECT VERSION() AS cby_version');
    return cby_rows[0].cby_version;
  } finally {
    await cby_conn.end().catch(() => {});
  }
};

module.exports = { cby_pool, cby_testConnection, cby_connectTest };
