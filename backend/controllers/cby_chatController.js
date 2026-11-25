/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_response = require('../middlewares/cby_response');
const cby_chatModel = require('../models/cby_chatModel');

const cby_MAX_MESSAGE_LENGTH = 1000;
const cby_MAX_HISTORY = 12;

/* 只保留 user / assistant 的历史消息，防止前端传入异常角色 */
const cby_sanitizeHistory = (cby_history) => {
  if (!Array.isArray(cby_history)) return [];
  return cby_history
    .filter((cby_item) => cby_item
      && (cby_item.role === 'user' || cby_item.role === 'assistant')
      && typeof cby_item.content === 'string'
      && cby_item.content.trim())
    .slice(-cby_MAX_HISTORY)
    .map((cby_item) => ({
      role: cby_item.role,
      content: cby_item.content.trim().slice(0, cby_MAX_MESSAGE_LENGTH)
    }));
};

/* POST /api/chat —— 调用大模型生成客服回复，支持硅基流动 / 七牛热切换 */
const cby_chat = async (cby_req, cby_res) => {
  const cby_body = cby_req.body || {};
  const cby_message = typeof cby_body.cby_message === 'string' ? cby_body.cby_message.trim() : '';
  /* 平台只接受白名单值，非法值回落到默认平台 */
  const cby_platform = cby_chatModel.cby_getPlatformKey(cby_body.cby_platform);

  if (!cby_message) {
    return cby_response.cby_fail(cby_res, 1, '消息内容不能为空');
  }
  if (cby_message.length > cby_MAX_MESSAGE_LENGTH) {
    return cby_response.cby_fail(cby_res, 1, `消息过长，最多 ${cby_MAX_MESSAGE_LENGTH} 个字符`);
  }

  const cby_messages = [
    ...cby_sanitizeHistory(cby_body.cby_history),
    { role: 'user', content: cby_message }
  ];

  try {
    const cby_result = await cby_chatModel.cby_chat(cby_messages, cby_platform);
    cby_response.cby_success(cby_res, '回复生成成功', {
      cby_reply: cby_result.cby_reply,
      cby_model: cby_result.cby_model,
      cby_platform: cby_result.cby_platform,
      cby_platform_label: cby_result.cby_platform_label,
      cby_usage: cby_result.cby_usage
    });
  } catch (cby_error) {
    console.error('服务器错误信息：在线客服回复失败', cby_error.message);
    const cby_code = cby_error.cby_code === 'CBY_NO_KEY' ? 2 : 1;
    cby_response.cby_fail(cby_res, cby_code, `在线客服回复失败：${cby_error.message}`, {
      cby_error: cby_error.message
    });
  }
};

module.exports = { cby_chat };
