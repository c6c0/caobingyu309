/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

/* 数据库重建工具：按 cby_database.md 中的记录顺序执行全部 SQL，凭据只从 backend/.env 读取 */
const cby_fs = require('fs');
const cby_path = require('path');
const cby_dotenv = require('dotenv');

cby_dotenv.config({ path: cby_path.join(__dirname, '.env') });

const cby_mysql = require('mysql2/promise');

/* 提取 md 文件里的 sql 代码块，去掉行注释后按分号拆成单条语句 */
/* cby_onlyLatest=true 时只取最后一个代码块，用于在本机增量执行最新一条记录 */
const cby_loadSql = (cby_onlyLatest) => {
  const cby_md = cby_fs.readFileSync(cby_path.join(__dirname, 'cby_database.md'), 'utf8');
  const cby_all = [...cby_md.matchAll(/```sql\s*([\s\S]*?)```/g)].map((cby_m) => cby_m[1]);
  const cby_blocks = cby_onlyLatest ? cby_all.slice(-1) : cby_all;

  return cby_blocks
    .join('\n')
    .split('\n')
    .filter((cby_line) => !cby_line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((cby_stmt) => cby_stmt.trim())
    .filter(Boolean);
};

/* 统计记录数，表不存在时返回 null，避免初始化中途报错 */
const cby_countRows = async (cby_conn, cby_table) => {
  try {
    const [cby_rows] = await cby_conn.query(`SELECT COUNT(*) AS cby_total FROM ${cby_table}`);
    return cby_rows[0].cby_total;
  } catch (cby_error) {
    return null;
  }
};

const cby_main = async () => {
  const cby_onlyLatest = process.argv.includes('latest');
  const cby_statements = cby_loadSql(cby_onlyLatest);
  console.log(cby_onlyLatest ? '模式：仅执行最后一条 SQL 记录' : '模式：按记录顺序全量重建');
  const cby_conn = await cby_mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectTimeout: 5000
  });

  try {
    for (const cby_stmt of cby_statements) {
      await cby_conn.query(cby_stmt);
      console.log('已执行 SQL：', cby_stmt.replace(/\s+/g, ' ').slice(0, 62));
    }
    console.log('cby_news 当前记录数：', await cby_countRows(cby_conn, 'cby_news'));
    console.log('cby_gallery 当前记录数：', await cby_countRows(cby_conn, 'cby_gallery'));
    console.log('cby_kb_doc 当前记录数：', await cby_countRows(cby_conn, 'cby_kb_doc'));
    console.log('cby_kb_chunk 当前记录数：', await cby_countRows(cby_conn, 'cby_kb_chunk'));
  } finally {
    await cby_conn.end().catch(() => {});
  }
};

cby_main().catch((cby_error) => {
  console.error('数据库初始化失败：', cby_error.message);
  process.exit(1);
});
