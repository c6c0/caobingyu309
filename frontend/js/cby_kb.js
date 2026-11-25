/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
/* 知识库问答：上传、列表、删除、检索问答 */
(() => {
  'use strict';

  const cby_allowedExts = ['.txt', '.md', '.pdf', '.doc', '.docx', '.ppt', '.pptx'];
  let cby_busy = false;

  const cby_el = (cby_id) => document.getElementById(cby_id);
  const cby_dropZone = cby_el('cby_dropZone');
  const cby_fileInput = cby_el('cby_fileInput');
  const cby_uploadStatus = cby_el('cby_uploadStatus');
  const cby_docList = cby_el('cby_docList');
  const cby_docCount = cby_el('cby_docCount');
  const cby_qaList = cby_el('cby_qaList');
  const cby_qaForm = cby_el('cby_qaForm');
  const cby_qaInput = cby_el('cby_qaInput');
  const cby_qaSend = cby_el('cby_qaSend');
  const cby_qaClear = cby_el('cby_qaClear');
  const cby_kbApiUrl = cby_el('cby_kbApiUrl');
  const cby_kbStatus = cby_el('cby_kbStatus');

  const cby_setHint = (cby_node, cby_text, cby_kind) => {
    if (!cby_node) return;
    cby_node.textContent = cby_text;
    cby_node.className = cby_kind ? `${cby_node.className.split(' ')[0]} ${cby_kind}` : cby_node.className.split(' ')[0];
  };

  const cby_scrollQa = () => {
    if (cby_qaList) cby_qaList.scrollTop = cby_qaList.scrollHeight;
  };

  const cby_addQa = (cby_kind, cby_text) => {
    const cby_msg = document.createElement('div');
    cby_msg.className = `cby_qa_msg cby_qa_msg_${cby_kind}`;
    cby_msg.textContent = cby_text;
    cby_qaList.appendChild(cby_msg);
    cby_scrollQa();
    return cby_msg;
  };

  const cby_renderSources = (cby_msg, cby_sources) => {
    if (!Array.isArray(cby_sources) || !cby_sources.length) return;
    const cby_box = document.createElement('div');
    cby_box.className = 'cby_qa_sources';
    const cby_title = document.createElement('div');
    cby_title.textContent = '检索到的知识库片段：';
    cby_box.appendChild(cby_title);

    cby_sources.forEach((cby_source) => {
      const cby_row = document.createElement('div');
      cby_row.className = 'cby_qa_source';
      const cby_head = document.createElement('strong');
      cby_head.textContent = `[${cby_source.cby_rank}] ${cby_source.cby_doc_name} · 相似度 ${cby_source.cby_score}`;
      const cby_text = document.createElement('div');
      cby_text.textContent = cby_source.cby_snippet;
      cby_row.appendChild(cby_head);
      cby_row.appendChild(cby_text);
      cby_box.appendChild(cby_row);
    });

    cby_msg.appendChild(cby_box);
    cby_scrollQa();
  };

  /* 文档列表 */
  const cby_loadDocs = async () => {
    try {
      const cby_res = await fetch('/api/kb/documents');
      const cby_json = await cby_res.json();
      console.log('知识库文档列表：', cby_json);

      cby_docList.textContent = '';
      if (cby_json.code !== 0) {
        cby_docCount.textContent = '加载失败';
        return;
      }

      const cby_docs = (cby_json.data && cby_json.data.cby_documents) || [];
      cby_docCount.textContent = `${cby_docs.length} 个文件`;

      if (!cby_docs.length) {
        const cby_empty = document.createElement('p');
        cby_empty.className = 'cby_empty';
        cby_empty.textContent = '还没有知识库文件，先上传一份试试';
        cby_docList.appendChild(cby_empty);
        return;
      }

      cby_docs.forEach((cby_doc) => {
        const cby_item = document.createElement('div');
        cby_item.className = 'cby_doc_item';

        const cby_badge = document.createElement('span');
        cby_badge.className = 'cby_doc_badge';
        cby_badge.textContent = cby_doc.file_type;

        const cby_main = document.createElement('div');
        cby_main.className = 'cby_doc_main';
        const cby_name = document.createElement('span');
        cby_name.className = 'cby_doc_name';
        cby_name.textContent = cby_doc.name;
        cby_name.title = cby_doc.file_name;
        const cby_meta = document.createElement('span');
        cby_meta.className = 'cby_doc_meta';
        cby_meta.textContent = `${cby_doc.char_count} 字 · ${cby_doc.chunk_count} 个片段 · ${cby_doc.create_time}`;
        cby_main.appendChild(cby_name);
        cby_main.appendChild(cby_meta);

        const cby_del = document.createElement('button');
        cby_del.type = 'button';
        cby_del.className = 'cby_doc_del';
        cby_del.textContent = '删除';
        cby_del.addEventListener('click', () => cby_deleteDoc(cby_doc));

        cby_item.appendChild(cby_badge);
        cby_item.appendChild(cby_main);
        cby_item.appendChild(cby_del);
        cby_docList.appendChild(cby_item);
      });
    } catch (cby_error) {
      console.error('服务器错误信息：文档列表加载失败', cby_error);
      cby_setHint(cby_uploadStatus, '文档列表加载失败，请确认后端已启动', 'cby_is_error');
      cby_docCount.textContent = '加载失败';
    }
  };

  const cby_deleteDoc = async (cby_doc) => {
    if (!window.confirm(`确定删除「${cby_doc.name}」及其全部向量片段吗？`)) return;
    try {
      const cby_res = await fetch(`/api/kb/documents/${cby_doc.id}`, { method: 'DELETE' });
      const cby_json = await cby_res.json();
      console.log('删除知识库文档：', cby_json);
      cby_setHint(cby_uploadStatus, cby_json.msg, cby_json.code === 0 ? 'cby_is_ok' : 'cby_is_error');
      await cby_loadDocs();
    } catch (cby_error) {
      console.error('服务器错误信息：删除失败', cby_error);
      cby_setHint(cby_uploadStatus, '删除失败，请检查网络或后端服务', 'cby_is_error');
    }
  };

  /* 上传并建立索引 */
  const cby_uploadFile = async (cby_file) => {
    if (!cby_file || cby_busy) return;

    const cby_ext = cby_file.name.slice(cby_file.name.lastIndexOf('.')).toLowerCase();
    if (!cby_allowedExts.includes(cby_ext)) {
      cby_setHint(cby_uploadStatus, `不支持的文件类型 ${cby_ext}`, 'cby_is_error');
      return;
    }

    cby_busy = true;
    cby_setHint(cby_uploadStatus, `正在解析并向量化「${cby_file.name}」，请稍候…`, '');

    const cby_form = new FormData();
    cby_form.append('cby_file', cby_file);

    try {
      const cby_res = await fetch('/api/kb/upload', { method: 'POST', body: cby_form });
      const cby_json = await cby_res.json();
      console.log('上传知识库返回的数据：', cby_json);

      if (cby_json.code === 0) {
        const cby_data = cby_json.data || {};
        cby_setHint(cby_uploadStatus, `已索引「${cby_data.cby_name}」：${cby_data.cby_char_count} 字，${cby_data.cby_chunk_count} 个片段`, 'cby_is_ok');
        await cby_loadDocs();
      } else {
        cby_setHint(cby_uploadStatus, cby_json.msg || '上传失败', 'cby_is_error');
      }
    } catch (cby_error) {
      console.error('服务器错误信息：知识库上传失败', cby_error);
      cby_setHint(cby_uploadStatus, '上传失败，请确认后端已启动并检查网络', 'cby_is_error');
    } finally {
      cby_busy = false;
      cby_fileInput.value = '';
    }
  };

  /* 提问 */
  const cby_ask = async () => {
    const cby_question = cby_qaInput.value.trim();
    if (!cby_question || cby_busy) return;

    cby_addQa('user', cby_question);
    cby_qaInput.value = '';
    cby_busy = true;
    cby_qaSend.disabled = true;
    cby_setHint(cby_kbStatus, '检索并生成中…', '');
    const cby_wait = cby_addQa('bot', '正在检索知识库并生成回答…');

    try {
      const cby_res = await fetch('/api/kb/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cby_question })
      });
      const cby_json = await cby_res.json();
      console.log('知识库问答返回的数据：', cby_json);

      cby_wait.remove();
      if (cby_json.code !== 0) {
        const cby_hint = cby_json.code === 3 ? '知识库为空' : (cby_json.code === 2 ? '未配置密钥' : '请求失败');
        cby_setHint(cby_kbStatus, cby_hint, 'cby_is_error');
        cby_addQa('error', cby_json.msg || '问答失败，请稍后重试');
        return;
      }

      const cby_data = cby_json.data || {};
      const cby_msg = cby_addQa('bot', cby_data.cby_answer || '（没有返回内容）');
      cby_renderSources(cby_msg, cby_data.cby_sources);
      cby_setHint(cby_kbStatus, `成功 · ${cby_data.cby_model || '硅基流动'}`, 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：知识库问答失败', cby_error);
      cby_wait.remove();
      cby_setHint(cby_kbStatus, '请求失败', 'cby_is_error');
      cby_addQa('error', `问答失败：${cby_error.message}`);
    } finally {
      cby_busy = false;
      cby_qaSend.disabled = false;
      cby_qaInput.focus();
    }
  };

  const cby_init = () => {
    if (!cby_qaList) return;

    if (window.location.origin && window.location.origin !== 'null') {
      cby_kbApiUrl.textContent = `${window.location.origin}/api/kb/ask`;
    }

    cby_addQa('bot', '你好，我是知识库问答助手。先在左侧上传知识库文件（例如课程 FAQ、项目说明），再向我提问，我会只依据知识库内容回答，并给出检索到的片段。');
    cby_loadDocs();

    cby_dropZone.addEventListener('click', (cby_event) => {
      if (cby_event.target.tagName !== 'INPUT') cby_fileInput.click();
    });

    cby_fileInput.addEventListener('change', () => {
      if (cby_fileInput.files && cby_fileInput.files[0]) cby_uploadFile(cby_fileInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach((cby_type) => {
      cby_dropZone.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_dropZone.classList.add('cby_is_drag');
      });
    });

    ['dragleave', 'drop'].forEach((cby_type) => {
      cby_dropZone.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_dropZone.classList.remove('cby_is_drag');
      });
    });

    cby_dropZone.addEventListener('drop', (cby_event) => {
      const cby_files = cby_event.dataTransfer && cby_event.dataTransfer.files;
      if (cby_files && cby_files[0]) cby_uploadFile(cby_files[0]);
    });

    cby_qaForm.addEventListener('submit', (cby_event) => {
      cby_event.preventDefault();
      cby_ask();
    });

    cby_qaInput.addEventListener('keydown', (cby_event) => {
      if (cby_event.key === 'Enter' && !cby_event.shiftKey && !cby_event.isComposing) {
        cby_event.preventDefault();
        cby_ask();
      }
    });

    cby_qaClear.addEventListener('click', () => {
      if (cby_busy) return;
      cby_qaList.textContent = '';
      cby_addQa('bot', '对话已清空，继续提问吧。');
      cby_setHint(cby_kbStatus, '等待提问', '');
    });
  };

  cby_init();
})();
