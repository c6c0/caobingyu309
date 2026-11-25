/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_db = require('./cby_db');

/* 新增知识库文档，返回自增主键 */
const cby_createDocument = async (cby_doc) => {
  const cby_sql = `
    INSERT INTO cby_kb_doc
      (name, file_name, file_type, file_size, stored_path, char_count, chunk_count, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [cby_result] = await cby_db.cby_pool.query(cby_sql, [
    cby_doc.cby_name,
    cby_doc.cby_fileName,
    cby_doc.cby_fileType,
    cby_doc.cby_fileSize,
    cby_doc.cby_storedPath,
    cby_doc.cby_charCount,
    cby_doc.cby_chunkCount,
    cby_doc.cby_status || 'ready'
  ]);
  return cby_result.insertId;
};

/* 批量写入片段与向量（embedding 为 JSON 字符串） */
const cby_createChunks = async (cby_docId, cby_chunks) => {
  if (!cby_chunks.length) return;
  const cby_rows = cby_chunks.map((cby_chunk, cby_index) => [
    cby_docId,
    cby_index,
    cby_chunk.cby_content,
    JSON.stringify(cby_chunk.cby_embedding)
  ]);
  const cby_sql = 'INSERT INTO cby_kb_chunk (doc_id, chunk_index, content, embedding) VALUES ?';
  await cby_db.cby_pool.query(cby_sql, [cby_rows]);
};

/* 文档列表：不返回向量，按创建时间倒序 */
const cby_findDocuments = async () => {
  const cby_sql = `
    SELECT id, name, file_name, file_type, file_size, char_count, chunk_count, status,
           DATE_FORMAT(create_time, '%Y-%m-%d %H:%i') AS create_time
      FROM cby_kb_doc
     ORDER BY id DESC
  `;
  const [cby_rows] = await cby_db.cby_pool.query(cby_sql);
  return cby_rows;
};

const cby_findDocumentById = async (cby_id) => {
  const [cby_rows] = await cby_db.cby_pool.query('SELECT * FROM cby_kb_doc WHERE id = ?', [cby_id]);
  return cby_rows[0] || null;
};

/* 删除文档及其全部片段，返回被删除的文档信息用于清理磁盘文件 */
const cby_deleteDocument = async (cby_id) => {
  const cby_doc = await cby_findDocumentById(cby_id);
  if (!cby_doc) return null;
  await cby_db.cby_pool.query('DELETE FROM cby_kb_chunk WHERE doc_id = ?', [cby_id]);
  await cby_db.cby_pool.query('DELETE FROM cby_kb_doc WHERE id = ?', [cby_id]);
  return cby_doc;
};

/* 取出全部片段（带文档名），用于内存中计算余弦相似度 */
const cby_findAllChunks = async () => {
  const cby_sql = `
    SELECT c.id, c.doc_id, c.chunk_index, c.content, c.embedding, d.name AS doc_name, d.file_name
      FROM cby_kb_chunk c
      JOIN cby_kb_doc d ON d.id = c.doc_id
     ORDER BY c.doc_id ASC, c.chunk_index ASC
  `;
  const [cby_rows] = await cby_db.cby_pool.query(cby_sql);
  return cby_rows;
};

const cby_countDocuments = async () => {
  const [cby_rows] = await cby_db.cby_pool.query('SELECT COUNT(*) AS cby_total FROM cby_kb_doc');
  return cby_rows[0].cby_total;
};

module.exports = {
  cby_createDocument,
  cby_createChunks,
  cby_findDocuments,
  cby_findDocumentById,
  cby_deleteDocument,
  cby_findAllChunks,
  cby_countDocuments
};
