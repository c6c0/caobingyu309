/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_response = require('../middlewares/cby_response');
const cby_galleryModel = require('../models/cby_galleryModel');

/* GET /api/gallery —— 返回全部图文数据（按创建时间倒序） */
const cby_getGallery = async (cby_req, cby_res) => {
  try {
    const cby_list = await cby_galleryModel.cby_findAll();
    cby_response.cby_success(cby_res, '图文列表获取成功', {
      cby_gallery: cby_list,
      cby_total: cby_list.length
    });
  } catch (cby_error) {
    console.error('服务器错误信息：图文列表获取失败', cby_error.message);
    cby_response.cby_fail(cby_res, 1, `图文列表获取失败：${cby_error.message}`, {
      cby_error: cby_error.message,
      cby_code: cby_error.code || ''
    });
  }
};

module.exports = { cby_getGallery };
