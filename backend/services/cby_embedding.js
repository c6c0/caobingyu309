/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

/* 文本向量化：使用硅基流动 BAAI/bge-m3，向量以 JSON 数组字符串存入 MySQL */
const cby_baseUrl = (process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1').replace(/\/+$/, '');
const cby_apiKey = (process.env.SILICONFLOW_API_KEY || '').trim();
const cby_embeddingModel = process.env.SILICONFLOW_EMBEDDING_MODEL || 'BAAI/bge-m3';
const cby_batchSize = 16;

const cby_embedTexts = async (cby_texts) => {
  if (!cby_apiKey) {
    const cby_error = new Error('后端未配置硅基流动密钥，无法进行文本向量化');
    cby_error.cby_code = 'CBY_NO_KEY';
    throw cby_error;
  }

  const cby_vectors = [];

  for (let cby_start = 0; cby_start < cby_texts.length; cby_start += cby_batchSize) {
    const cby_batch = cby_texts.slice(cby_start, cby_start + cby_batchSize);

    console.log('发送给大模型的数据（embedding）：', JSON.stringify({
      model: cby_embeddingModel,
      input: cby_batch.map((cby_text) => cby_text.slice(0, 120))
    }));

    const cby_res = await fetch(`${cby_baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cby_apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: cby_embeddingModel,
        input: cby_batch,
        encoding_format: 'float'
      })
    });

    const cby_text = await cby_res.text();
    let cby_json = null;
    try {
      cby_json = JSON.parse(cby_text);
    } catch (cby_error) {
      throw new Error(`向量化接口返回了非 JSON 内容：${cby_text.slice(0, 200)}`);
    }

    if (!cby_res.ok) {
      const cby_reason = (cby_json && cby_json.message)
        || (cby_json && cby_json.error && cby_json.error.message)
        || `HTTP 状态码 ${cby_res.status}`;
      throw new Error(`向量化调用失败：${cby_reason}`);
    }

    const cby_data = Array.isArray(cby_json.data) ? cby_json.data : [];
    console.log('接受自大模型的数据（embedding）：', JSON.stringify({
      model: cby_json.model || cby_embeddingModel,
      count: cby_data.length,
      dimension: cby_data[0] && cby_data[0].embedding ? cby_data[0].embedding.length : 0,
      usage: cby_json.usage || null
    }));

    cby_data
      .sort((cby_a, cby_b) => (cby_a.index || 0) - (cby_b.index || 0))
      .forEach((cby_item) => cby_vectors.push(cby_item.embedding));
  }

  if (cby_vectors.length !== cby_texts.length) {
    throw new Error(`向量数量与文本数量不一致（${cby_vectors.length}/${cby_texts.length}）`);
  }
  return cby_vectors;
};

module.exports = { cby_embedTexts, cby_embeddingModel };
