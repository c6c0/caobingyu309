/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
'use strict';

const cby_fs = require('fs');
const cby_path = require('path');
const cby_mammoth = require('mammoth');
const cby_pdfModule = require('pdf-parse');
const cby_JSZip = require('jszip');
const cby_WordExtractor = require('word-extractor');

/* 知识库允许上传的扩展名 */
const cby_allowedExts = ['.txt', '.md', '.pdf', '.doc', '.docx', '.ppt', '.pptx'];
const cby_fileTypeLabels = {
  '.txt': '纯文本',
  '.md': 'Markdown',
  '.pdf': 'PDF',
  '.doc': 'Word 97-2003',
  '.docx': 'Word',
  '.ppt': 'PowerPoint 97-2003',
  '.pptx': 'PowerPoint'
};

const cby_cleanText = (cby_text) => String(cby_text || '')
  .replace(/\u0000/g, ' ')
  .replace(/\r\n/g, '\n')
  .replace(/[ \t]+/g, ' ')
  .replace(/ *\n */g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

/* 解析 docx（mammoth：只取纯文本，不保留样式） */
const cby_parseDocx = async (cby_filePath) => {
  const cby_result = await cby_mammoth.extractRawText({ path: cby_filePath });
  return cby_result.value;
};

/* 解析 pdf：兼容 pdf-parse 2.x 的 PDFParse 类写法 */
const cby_parsePdf = async (cby_filePath) => {
  const cby_buffer = cby_fs.readFileSync(cby_filePath);
  if (typeof cby_pdfModule.PDFParse === 'function') {
    const cby_parser = new cby_pdfModule.PDFParse({ data: cby_buffer });
    try {
      const cby_result = await cby_parser.getText();
      return cby_result.text;
    } finally {
      if (typeof cby_parser.destroy === 'function') await cby_parser.destroy().catch(() => {});
    }
  }
  const cby_result = await cby_pdfModule(cby_buffer);
  return cby_result.text;
};

const cby_decodeXml = (cby_text) => String(cby_text)
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&amp;/g, '&');

/* 解析 pptx：按幻灯片顺序读取 <a:t> 文本节点 */
const cby_parsePptx = async (cby_filePath) => {
  const cby_zip = await cby_JSZip.loadAsync(cby_fs.readFileSync(cby_filePath));
  const cby_slides = Object.keys(cby_zip.files)
    .filter((cby_name) => /^ppt\/slides\/slide\d+\.xml$/i.test(cby_name))
    .sort((cby_a, cby_b) => Number(cby_a.match(/(\d+)/)[1]) - Number(cby_b.match(/(\d+)/)[1]));

  const cby_blocks = [];
  for (const cby_slide of cby_slides) {
    const cby_xml = await cby_zip.file(cby_slide).async('string');
    const cby_texts = [...cby_xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)].map((cby_match) => cby_decodeXml(cby_match[1]));
    if (cby_texts.length) cby_blocks.push(`【第 ${cby_slides.indexOf(cby_slide) + 1} 页】\n${cby_texts.join('\n')}`);
  }
  return cby_blocks.join('\n\n');
};

/* 解析 .doc：word-extractor 直接读取正文 */
const cby_parseDoc = async (cby_filePath) => {
  const cby_extractor = new cby_WordExtractor();
  const cby_doc = await cby_extractor.extract(cby_filePath);
  return cby_doc.getBody();
};

/* 旧版 .ppt / .doc 兜底：二进制流中的 UTF-16LE 文本片段 */
const cby_extractBinaryText = (cby_filePath) => {
  const cby_buffer = cby_fs.readFileSync(cby_filePath);
  const cby_runs = [];
  let cby_current = '';

  const cby_isPrintable = (cby_code) => (
    (cby_code >= 0x20 && cby_code <= 0x7e)
    || (cby_code >= 0x4e00 && cby_code <= 0x9fff)
    || (cby_code >= 0x3000 && cby_code <= 0x303f)
    || (cby_code >= 0xff00 && cby_code <= 0xffef)
    || (cby_code >= 0x2000 && cby_code <= 0x206f)
  );

  for (let cby_i = 0; cby_i + 1 < cby_buffer.length; cby_i += 2) {
    const cby_code = cby_buffer.readUInt16LE(cby_i);
    if (cby_isPrintable(cby_code)) {
      cby_current += String.fromCharCode(cby_code);
    } else {
      if (cby_current.length >= 6) cby_runs.push(cby_current);
      cby_current = '';
    }
  }
  if (cby_current.length >= 6) cby_runs.push(cby_current);
  return cby_runs.join('\n');
};

/* 统一入口：按扩展名选择解析器，返回纯文本 */
const cby_parseFile = async (cby_filePath) => {
  const cby_ext = cby_path.extname(cby_filePath).toLowerCase();
  let cby_text = '';

  if (cby_ext === '.txt' || cby_ext === '.md') {
    cby_text = cby_fs.readFileSync(cby_filePath, 'utf8').replace(/^\uFEFF/, '');
  } else if (cby_ext === '.docx') {
    cby_text = await cby_parseDocx(cby_filePath);
  } else if (cby_ext === '.pdf') {
    cby_text = await cby_parsePdf(cby_filePath);
  } else if (cby_ext === '.pptx') {
    cby_text = await cby_parsePptx(cby_filePath);
  } else if (cby_ext === '.doc') {
    try {
      cby_text = await cby_parseDoc(cby_filePath);
    } catch (cby_error) {
      console.error('文档解析提示：.doc 使用 word-extractor 失败，改用二进制兜底提取', cby_error.message);
      cby_text = cby_extractBinaryText(cby_filePath);
    }
  } else if (cby_ext === '.ppt') {
    cby_text = cby_extractBinaryText(cby_filePath);
  } else {
    throw new Error(`暂不支持的文件类型：${cby_ext || '未知'}`);
  }

  const cby_clean = cby_cleanText(cby_text);
  if (!cby_clean) throw new Error('未能从文件中解析出文字内容，请确认文件不是扫描件或空文档');
  return cby_clean;
};

module.exports = { cby_parseFile, cby_allowedExts, cby_fileTypeLabels };
