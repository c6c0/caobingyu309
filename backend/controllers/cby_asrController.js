/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_path = require('path');
const cby_response = require('../middlewares/cby_response');
const cby_upload = require('../middlewares/cby_upload');

/* 七牛云 AI 大模型推理服务（OpenAI 兼容）音频转写配置；模型标识必须全小写 */
const cby_qiniuKey = (process.env.QINIU_API_KEY || '').trim();
const cby_asrBaseUrl = (process.env.QINIU_ASR_BASE_URL || 'https://api.qnaigc.com/v1').replace(/\/+$/, '');
const cby_asrModel = process.env.QINIU_ASR_MODEL || 'qwen-audio-3.0-asr-flash';
const cby_allowedExts = ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac', '.aac', '.opus'];

const cby_mimeOf = (cby_ext) => {
  const cby_map = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.webm': 'audio/webm',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    '.opus': 'audio/opus'
  };
  return cby_map[cby_ext] || 'application/octet-stream';
};

/* POST /api/asr —— 上传语音，调用七牛 Qwen-Audio-3.0-ASR-Flash 转写为文字 */
const cby_transcribe = async (cby_req, cby_res) => {
  if (!cby_req.file) return cby_response.cby_fail(cby_res, 1, '请选择要识别的语音文件');

  const cby_fileName = cby_upload.cby_decodeName(cby_req.file.originalname);
  const cby_ext = cby_path.extname(cby_fileName).toLowerCase();
  if (!cby_allowedExts.includes(cby_ext)) {
    return cby_response.cby_fail(cby_res, 1, `不支持的音频格式 ${cby_ext || '（无扩展名）'}，仅支持 ${cby_allowedExts.join('、')}`);
  }

  if (!cby_qiniuKey) {
    return cby_response.cby_fail(cby_res, 2, '语音识别失败：后端未配置七牛云密钥，请在 backend/.env 中填写 QINIU_API_KEY 后重启服务', {
      cby_error: '缺少 QINIU_API_KEY'
    });
  }

  const cby_form = new FormData();
  cby_form.append('file', new Blob([cby_req.file.buffer], { type: cby_mimeOf(cby_ext) }), cby_fileName);
  cby_form.append('model', cby_asrModel);
  cby_form.append('response_format', 'json');

  console.log('发送给大模型的数据（asr）：', JSON.stringify({
    url: `${cby_asrBaseUrl}/audio/transcriptions`,
    model: cby_asrModel,
    file: cby_fileName,
    size: cby_req.file.size,
    mime: cby_mimeOf(cby_ext)
  }));

  const cby_controller = new AbortController();
  const cby_timer = setTimeout(() => cby_controller.abort(), 120000);

  try {
    const cby_resQiniu = await fetch(`${cby_asrBaseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cby_qiniuKey}` },
      body: cby_form,
      signal: cby_controller.signal
    });

    const cby_text = await cby_resQiniu.text();
    console.log('接受自大模型的数据（asr）：', cby_text.slice(0, 2000));

    let cby_json = null;
    try {
      cby_json = JSON.parse(cby_text);
    } catch (cby_error) {
      throw new Error(`七牛接口返回了非 JSON 内容：${cby_text.slice(0, 200)}`);
    }

    if (!cby_resQiniu.ok) {
      const cby_reason = (cby_json && cby_json.message)
        || (cby_json && cby_json.error && cby_json.error.message)
        || `HTTP 状态码 ${cby_resQiniu.status}`;
      throw new Error(`七牛语音识别调用失败：${cby_reason}`);
    }

    const cby_resultText = (cby_json && cby_json.text)
      || (cby_json && cby_json.data && cby_json.data.text)
      || (cby_json && cby_json.result && cby_json.result.text)
      || '';

    if (!String(cby_resultText).trim()) throw new Error('七牛语音识别返回的文本为空');

    cby_response.cby_success(cby_res, '语音识别成功', {
      cby_text: String(cby_resultText).trim(),
      cby_model: (cby_json && cby_json.model) || cby_asrModel,
      cby_file_name: cby_fileName,
      cby_file_size: cby_req.file.size
    });
  } catch (cby_error) {
    const cby_message = cby_error.name === 'AbortError' ? '请求七牛接口超时（120 秒）' : cby_error.message;
    console.error('服务器错误信息：语音识别失败', cby_message);
    cby_response.cby_fail(cby_res, 1, `语音识别失败：${cby_message}`, { cby_error: cby_message });
  } finally {
    clearTimeout(cby_timer);
  }
};

module.exports = { cby_transcribe, cby_asrModel };
