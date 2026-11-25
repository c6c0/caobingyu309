/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_db = require('./cby_db');

/* 查询全部图文数据，按创建时间倒序；时间格式化为字符串，避免前端出现时区偏移 */
const cby_findAll = async () => {
  const cby_sql = `
    SELECT id, title, description, img_url, category,
           DATE_FORMAT(create_time, '%Y-%m-%d %H:%i') AS create_time
      FROM cby_gallery
     ORDER BY cby_gallery.create_time DESC, cby_gallery.id DESC
  `;
  const [cby_rows] = await cby_db.cby_pool.query(cby_sql);
  return cby_rows;
};

module.exports = { cby_findAll };
