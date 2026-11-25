/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_fs = require('fs');
const cby_path = require('path');
const cby_response = require('../middlewares/cby_response');
const cby_kbModel = require('../models/cby_kbModel');
const cby_kbService = require('../services/cby_kbService');
const cby_upload = require('../middlewares/cby_upload');
const cby_docParser = require('../utils/cby_docParser');

const cby_removeFile = (cby_filePath) => {
  if (!cby_filePath) return;
  cby_fs.unlink(cby_filePath, () => {});
};

/* POST /api/kb/upload —— 上传知识库文件，解析并建立向量索引 */
const cby_uploadDocument = async (cby_req, cby_res) => {
  if (!cby_req.file) {
    return cby_response.cby_fail(cby_res, 1, '请选择要上传的知识库文件');
  }

  const cby_file = cby_req.file;
  const cby_originalName = cby_upload.cby_decodeName(cby_file.originalname);
  const cby_ext = cby_path.extname(cby_originalName).toLowerCase();

  if (!cby_docParser.cby_allowedExts.includes(cby_ext)) {
    cby_removeFile(cby_file.path);
    return cby_response.cby_fail(cby_res, 1, `不支持的文件类型 ${cby_ext || '（无扩展名）'}，仅支持 ${cby_docParser.cby_allowedExts.join('、')}`);
  }

  try {
    const cby_name = String((cby_req.body && cby_req.body.cby_name) || '').trim()
      || cby_path.basename(cby_originalName, cby_ext);

    const cby_result = await cby_kbService.cby_indexDocument({
      cby_filePath: cby_file.path,
      cby_name,
      cby_fileName: cby_originalName,
      cby_fileType: cby_ext.replace('.', ''),
      cby_fileSize: cby_file.size,
      cby_storedPath: cby_path.join('cby_uploads', cby_path.basename(cby_file.path))
    });

    cby_response.cby_success(cby_res, '知识库文件已上传并完成索引', {
      cby_doc_id: cby_result.cby_docId,
      cby_name,
      cby_file_name: cby_originalName,
      cby_file_type: cby_ext.replace('.', ''),
      cby_char_count: cby_result.cby_charCount,
      cby_chunk_count: cby_result.cby_chunkCount
    });
  } catch (cby_error) {
    cby_removeFile(cby_file.path);
    console.error('服务器错误信息：知识库文件索引失败', cby_error.message);
    const cby_code = cby_error.cby_code === 'CBY_NO_KEY' ? 2 : 1;
    cby_response.cby_fail(cby_res, cby_code, `知识库文件索引失败：${cby_error.message}`, {
      cby_error: cby_error.message
    });
  }
};

/* GET /api/kb/documents —— 知识库文档列表 */
const cby_listDocuments = async (cby_req, cby_res) => {
  try {
    const cby_list = await cby_kbModel.cby_findDocuments();
    cby_response.cby_success(cby_res, '知识库文档获取成功', {
      cby_total: cby_list.length,
      cby_documents: cby_list
    });
  } catch (cby_error) {
    console.error('服务器错误信息：知识库文档获取失败', cby_error.message);
    cby_response.cby_fail(cby_res, 1, `知识库文档获取失败：${cby_error.message}`, { cby_error: cby_error.message });
  }
};

/* DELETE /api/kb/documents/:id —— 删除知识库文档、片段与磁盘文件 */
const cby_deleteDocument = async (cby_req, cby_res) => {
  const cby_id = Number(cby_req.params.id);
  if (!Number.isInteger(cby_id) || cby_id <= 0) {
    return cby_response.cby_fail(cby_res, 1, '文档 ID 不合法');
  }

  try {
    const cby_doc = await cby_kbModel.cby_deleteDocument(cby_id);
    if (!cby_doc) return cby_response.cby_fail(cby_res, 1, '文档不存在或已被删除');

    cby_removeFile(cby_path.join(__dirname, '..', cby_doc.stored_path));
    cby_response.cby_success(cby_res, '知识库文档已删除', {
      cby_doc_id: cby_id,
      cby_name: cby_doc.name
    });
  } catch (cby_error) {
    console.error('服务器错误信息：知识库文档删除失败', cby_error.message);
    cby_response.cby_fail(cby_res, 1, `知识库文档删除失败：${cby_error.message}`, { cby_error: cby_error.message });
  }
};

/* POST /api/kb/ask —— 基于知识库检索并作答 */
const cby_ask = async (cby_req, cby_res) => {
  const cby_body = cby_req.body || {};
  const cby_question = typeof cby_body.cby_question === 'string' ? cby_body.cby_question.trim() : '';

  if (!cby_question) return cby_response.cby_fail(cby_res, 1, '请输入要提问的问题');
  if (cby_question.length > 500) return cby_response.cby_fail(cby_res, 1, '问题过长，最多 500 个字符');

  try {
    const cby_result = await cby_kbService.cby_ask(cby_question);
    cby_response.cby_success(cby_res, '知识库问答成功', cby_result);
  } catch (cby_error) {
    console.error('服务器错误信息：知识库问答失败', cby_error.message);
    let cby_code = 1;
    if (cby_error.cby_code === 'CBY_NO_KEY') cby_code = 2;
    if (cby_error.cby_code === 'CBY_EMPTY') cby_code = 3;
    cby_response.cby_fail(cby_res, cby_code, `知识库问答失败：${cby_error.message}`, {
      cby_error: cby_error.message
    });
  }
};

module.exports = { cby_uploadDocument, cby_listDocuments, cby_deleteDocument, cby_ask };
