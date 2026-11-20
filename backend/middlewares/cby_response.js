/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

// 统一响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }
const cby_success = (cby_res, cby_msg, cby_data) => {
  cby_res.status(200).json({
    code: 0,
    msg: cby_msg || '操作成功',
    data: cby_data || {}
  });
};

const cby_fail = (cby_res, cby_code, cby_msg, cby_data) => {
  cby_res.status(200).json({
    code: cby_code || 1,
    msg: cby_msg || '操作失败',
    data: cby_data || {}
  });
};

module.exports = { cby_success, cby_fail };
