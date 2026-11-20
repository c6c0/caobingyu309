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

module.exports = { cby_pool, cby_testConnection };
