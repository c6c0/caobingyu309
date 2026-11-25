/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

/* 文本分段：按段落累积到约 420 字，相邻片段保留 60 字重叠，便于检索命中上下文 */
const cby_CHUNK_SIZE = 420;
const cby_OVERLAP = 60;

const cby_normalize = (cby_text) => String(cby_text || '')
  .replace(/\u0000/g, ' ')
  .replace(/\r\n/g, '\n')
  .replace(/[ \t]+/g, ' ')
  .replace(/ *\n */g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

/* 超长段落按窗口硬切，避免单段超过向量模型可接受长度 */
const cby_splitLongParagraph = (cby_text) => {
  const cby_parts = [];
  let cby_start = 0;
  while (cby_start < cby_text.length) {
    cby_parts.push(cby_text.slice(cby_start, cby_start + cby_CHUNK_SIZE));
    cby_start += cby_CHUNK_SIZE - cby_OVERLAP;
  }
  return cby_parts;
};

const cby_splitText = (cby_text) => {
  const cby_clean = cby_normalize(cby_text);
  if (!cby_clean) return [];

  const cby_chunks = [];
  let cby_buffer = '';

  const cby_flush = () => {
    const cby_value = cby_buffer.trim();
    if (cby_value.length > 0) cby_chunks.push(cby_value);
    cby_buffer = cby_value.length > cby_OVERLAP ? cby_value.slice(-cby_OVERLAP) : '';
  };

  cby_clean.split(/\n+/).forEach((cby_block) => {
    const cby_paragraph = cby_block.trim();
    if (!cby_paragraph) return;

    if (cby_paragraph.length > cby_CHUNK_SIZE) {
      cby_flush();
      cby_splitLongParagraph(cby_paragraph).forEach((cby_part) => cby_chunks.push(cby_part.trim()));
      return;
    }

    if (cby_buffer.length + cby_paragraph.length + 1 > cby_CHUNK_SIZE) cby_flush();
    cby_buffer = cby_buffer ? `${cby_buffer}\n${cby_paragraph}` : cby_paragraph;
  });

  if (cby_buffer.trim()) cby_chunks.push(cby_buffer.trim());
  return cby_chunks.filter((cby_item) => cby_item.length >= 10);
};

module.exports = { cby_splitText, cby_normalize };
