/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_response = require('../middlewares/cby_response');

const cby_getHealth = (cby_req, cby_res) => {
  const cby_data = {
    cby_service: 'cby_ccerwe_backend',
    cby_status: 'running',
    cby_port: 8309,
    cby_time: new Date().toISOString()
  };
  cby_response.cby_success(cby_res, '服务运行正常', cby_data);
};

module.exports = { cby_getHealth };
