/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_path = require('path');
const cby_response = require('../middlewares/cby_response');
const cby_chatModel = require('../models/cby_chatModel');

const cby_visionModel = process.env.SILICONFLOW_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct';
const cby_allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];

/* POST /api/vision —— 上传图片，调用视觉大模型返回描述 */
const cby_describeImage = async (cby_req, cby_res) => {
  if (!cby_req.file) return cby_response.cby_fail(cby_res, 1, '请选择要识别的图片');

  const cby_ext = cby_path.extname(cby_req.file.originalname || '').toLowerCase();
  if (!cby_allowedExts.includes(cby_ext)) {
    return cby_response.cby_fail(cby_res, 1, `不支持的图片格式 ${cby_ext || '（无扩展名）'}，仅支持 ${cby_allowedExts.join('、')}`);
  }

  const cby_mime = cby_ext === '.jpg' ? 'image/jpeg' : `image/${cby_ext.replace('.', '')}`;
  const cby_dataUrl = `data:${cby_mime};base64,${cby_req.file.buffer.toString('base64')}`;

  const cby_messages = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: '请用简体中文详细描述这张图片：主体内容、场景环境、颜色与光线、画面中的文字（如有），最后用一句话概括整体氛围。控制在 250 字以内。'
        },
        { type: 'image_url', image_url: { url: cby_dataUrl } }
      ]
    }
  ];

  try {
    const cby_result = await cby_chatModel.cby_completion(cby_messages, {
      cby_model: cby_visionModel,
      cby_temperature: 0.4,
      cby_maxTokens: 600
    });

    cby_response.cby_success(cby_res, '图片描述生成成功', {
      cby_description: cby_result.cby_reply,
      cby_model: cby_result.cby_model,
      cby_usage: cby_result.cby_usage,
      cby_file_name: cby_req.file.originalname,
      cby_file_size: cby_req.file.size
    });
  } catch (cby_error) {
    console.error('服务器错误信息：图片识别失败', cby_error.message);
    const cby_code = cby_error.cby_code === 'CBY_NO_KEY' ? 2 : 1;
    cby_response.cby_fail(cby_res, cby_code, `图片识别失败：${cby_error.message}`, {
      cby_error: cby_error.message
    });
  }
};

module.exports = { cby_describeImage, cby_visionModel };
