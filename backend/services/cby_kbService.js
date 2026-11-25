/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_kbModel = require('../models/cby_kbModel');
const cby_chatModel = require('../models/cby_chatModel');
const cby_embedding = require('./cby_embedding');
const cby_docParser = require('../utils/cby_docParser');
const cby_textSplit = require('../utils/cby_textSplit');

const cby_TOP_K = 4;

/* 余弦相似度：向量均为普通浮点数组 */
const cby_cosine = (cby_a, cby_b) => {
  let cby_dot = 0;
  let cby_normA = 0;
  let cby_normB = 0;
  const cby_len = Math.min(cby_a.length, cby_b.length);
  for (let cby_i = 0; cby_i < cby_len; cby_i += 1) {
    cby_dot += cby_a[cby_i] * cby_b[cby_i];
    cby_normA += cby_a[cby_i] * cby_a[cby_i];
    cby_normB += cby_b[cby_i] * cby_b[cby_i];
  }
  if (!cby_normA || !cby_normB) return 0;
  return cby_dot / (Math.sqrt(cby_normA) * Math.sqrt(cby_normB));
};

/* 解析 → 分块 → 向量化 → 写入数据库，返回新建文档与片段数 */
const cby_indexDocument = async (cby_options) => {
  const cby_text = await cby_docParser.cby_parseFile(cby_options.cby_filePath);
  const cby_chunks = cby_textSplit.cby_splitText(cby_text);

  if (!cby_chunks.length) throw new Error('解析出的文本过短，无法建立索引');

  const cby_vectors = await cby_embedding.cby_embedTexts(cby_chunks);

  const cby_docId = await cby_kbModel.cby_createDocument({
    cby_name: cby_options.cby_name,
    cby_fileName: cby_options.cby_fileName,
    cby_fileType: cby_options.cby_fileType,
    cby_fileSize: cby_options.cby_fileSize,
    cby_storedPath: cby_options.cby_storedPath,
    cby_charCount: cby_text.length,
    cby_chunkCount: cby_chunks.length
  });

  await cby_kbModel.cby_createChunks(cby_docId, cby_chunks.map((cby_content, cby_index) => ({
    cby_content,
    cby_embedding: cby_vectors[cby_index]
  })));

  return {
    cby_docId,
    cby_charCount: cby_text.length,
    cby_chunkCount: cby_chunks.length
  };
};

/* 基于知识库检索并作答；sources 返回命中的片段用于前端展示依据 */
const cby_ask = async (cby_question) => {
  const cby_total = await cby_kbModel.cby_countDocuments();
  if (!cby_total) {
    const cby_error = new Error('知识库还没有文件，请先上传知识库文件');
    cby_error.cby_code = 'CBY_EMPTY';
    throw cby_error;
  }

  const [cby_questionVector] = await cby_embedding.cby_embedTexts([cby_question]);
  const cby_chunks = await cby_kbModel.cby_findAllChunks();

  const cby_ranked = cby_chunks
    .map((cby_chunk) => {
      let cby_vector = [];
      try {
        cby_vector = JSON.parse(cby_chunk.embedding);
      } catch (cby_error) {
        cby_vector = [];
      }
      return {
        cby_docId: cby_chunk.doc_id,
        cby_docName: cby_chunk.doc_name,
        cby_chunkIndex: cby_chunk.chunk_index,
        cby_content: cby_chunk.content,
        cby_score: cby_cosine(cby_questionVector, cby_vector)
      };
    })
    .sort((cby_a, cby_b) => cby_b.cby_score - cby_a.cby_score)
    .slice(0, cby_TOP_K);

  const cby_context = cby_ranked
    .map((cby_item, cby_index) => `[${cby_index + 1}] 来源：${cby_item.cby_docName}\n${cby_item.cby_content}`)
    .join('\n\n');

  const cby_messages = [
    {
      role: 'system',
      content: '你是严谨的知识库问答助手。只能依据【知识库片段】回答问题：片段中有答案时用简体中文分点作答，并在句末标注来源编号（如 [1]）；片段中没有答案时直接回答“知识库中暂未找到相关内容”，不要编造信息。'
    },
    {
      role: 'user',
      content: `【知识库片段】\n${cby_context}\n\n【问题】\n${cby_question}`
    }
  ];

  const cby_result = await cby_chatModel.cby_completion(cby_messages, {
    cby_temperature: 0.3,
    cby_maxTokens: 900
  });

  return {
    cby_answer: cby_result.cby_reply,
    cby_model: cby_result.cby_model,
    cby_usage: cby_result.cby_usage,
    cby_sources: cby_ranked.map((cby_item, cby_index) => ({
      cby_rank: cby_index + 1,
      cby_doc_id: cby_item.cby_docId,
      cby_doc_name: cby_item.cby_docName,
      cby_chunk_index: cby_item.cby_chunkIndex,
      cby_score: Number(cby_item.cby_score.toFixed(4)),
      cby_snippet: cby_item.cby_content.slice(0, 120)
    }))
  };
};

module.exports = { cby_indexDocument, cby_ask };
