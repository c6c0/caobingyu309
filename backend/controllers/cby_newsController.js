/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_response = require('../middlewares/cby_response');
const cby_newsModel = require('../models/cby_newsModel');

/* GET /api/news —— 返回全部新闻（按发布时间倒序） */
const cby_getNews = async (cby_req, cby_res) => {
  try {
    const cby_list = await cby_newsModel.cby_findAll();
    cby_response.cby_success(cby_res, '新闻列表获取成功', {
      cby_news: cby_list,
      cby_total: cby_list.length
    });
  } catch (cby_error) {
    console.error('服务器错误信息：新闻列表获取失败', cby_error.message);
    cby_response.cby_fail(cby_res, 1, `新闻列表获取失败：${cby_error.message}`, {
      cby_error: cby_error.message,
      cby_code: cby_error.code || ''
    });
  }
};

module.exports = { cby_getNews };
