/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_db = require('./cby_db');

/* 查询全部新闻，按发布时间倒序；时间格式化为字符串，避免前端出现时区偏移 */
const cby_findAll = async () => {
  const cby_sql = `
    SELECT id, title, summary, content, source,
           DATE_FORMAT(publish_time, '%Y-%m-%d %H:%i') AS publish_time,
           cover_img
      FROM cby_news
     ORDER BY cby_news.publish_time DESC, cby_news.id DESC
  `;
  const [cby_rows] = await cby_db.cby_pool.query(cby_sql);
  return cby_rows;
};

module.exports = { cby_findAll };
