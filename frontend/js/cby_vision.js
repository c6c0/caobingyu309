/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
/* 图像识别：选择图片 → 预览 → 调用 POST /api/vision 获取描述 */
(() => {
  'use strict';

  const cby_allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
  let cby_file = null;
  let cby_busy = false;
  let cby_objectUrl = '';

  const cby_el = (cby_id) => document.getElementById(cby_id);
  const cby_drop = cby_el('cby_imageDrop');
  const cby_input = cby_el('cby_imageInput');
  const cby_preview = cby_el('cby_imagePreview');
  const cby_recognizeBtn = cby_el('cby_recognizeBtn');
  const cby_hint = cby_el('cby_visionHint');
  const cby_status = cby_el('cby_visionStatus');
  const cby_result = cby_el('cby_visionResult');
  const cby_meta = cby_el('cby_visionMeta');
  const cby_modelEl = cby_el('cby_visionModel');
  const cby_apiUrl = cby_el('cby_visionApiUrl');

  const cby_setHint = (cby_text, cby_kind) => {
    cby_hint.textContent = cby_text;
    cby_hint.className = `cby_status_line${cby_kind ? ` ${cby_kind}` : ''}`;
  };

  const cby_setStatus = (cby_text, cby_kind) => {
    cby_status.textContent = cby_text;
    cby_status.className = `cby_ai_api_hint${cby_kind ? ` ${cby_kind}` : ''}`;
  };

  const cby_showFile = (cby_selected) => {
    const cby_ext = cby_selected.name.slice(cby_selected.name.lastIndexOf('.')).toLowerCase();
    if (!cby_allowedExts.includes(cby_ext)) {
      cby_setHint(`不支持的图片格式 ${cby_ext}`, 'cby_is_error');
      return;
    }
    if (cby_selected.size > 20 * 1024 * 1024) {
      cby_setHint('图片超过 20MB，请压缩后再上传', 'cby_is_error');
      return;
    }

    cby_file = cby_selected;
    if (cby_objectUrl) URL.revokeObjectURL(cby_objectUrl);
    cby_objectUrl = URL.createObjectURL(cby_selected);

    cby_preview.textContent = '';
    const cby_img = document.createElement('img');
    cby_img.src = cby_objectUrl;
    cby_img.alt = '待识别图片预览';
    cby_preview.appendChild(cby_img);

    cby_recognizeBtn.disabled = false;
    cby_setHint(`已选择：${cby_selected.name}（${(cby_selected.size / 1024).toFixed(0)} KB）`, '');
    cby_setStatus('等待识别', '');
    cby_result.textContent = '点击「开始识别」，稍候即可看到图片描述。';
    cby_meta.textContent = '';
  };

  const cby_recognize = async () => {
    if (!cby_file || cby_busy) return;

    cby_busy = true;
    cby_recognizeBtn.disabled = true;
    cby_setHint('正在调用视觉大模型识别，请稍候…', '');
    cby_setStatus('识别中…', '');
    cby_result.textContent = '识别中，请稍候…';
    cby_meta.textContent = '';

    const cby_form = new FormData();
    cby_form.append('cby_image', cby_file);

    try {
      const cby_res = await fetch('/api/vision', { method: 'POST', body: cby_form });
      const cby_json = await cby_res.json();
      console.log('图像识别返回的数据：', cby_json);

      if (cby_json.code !== 0) {
        cby_setStatus(cby_json.code === 2 ? '未配置密钥' : '识别失败', 'cby_is_error');
        cby_setHint(cby_json.msg || '识别失败', 'cby_is_error');
        cby_result.textContent = cby_json.msg || '识别失败，请稍后重试';
        return;
      }

      const cby_data = cby_json.data || {};
      cby_result.textContent = cby_data.cby_description || '（没有返回描述）';
      if (cby_data.cby_model && cby_modelEl) cby_modelEl.textContent = `模型：${cby_data.cby_model}`;

      const cby_usage = cby_data.cby_usage || {};
      const cby_parts = [
        `文件：${cby_data.cby_file_name || cby_file.name}`,
        `模型：${cby_data.cby_model || '未知'}`
      ];
      if (cby_usage.total_tokens) cby_parts.push(`消耗 tokens：${cby_usage.total_tokens}`);
      cby_meta.textContent = cby_parts.join(' · ');

      cby_setStatus('识别成功', 'cby_is_ok');
      cby_setHint('识别完成，可更换图片继续识别', 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：图像识别失败', cby_error);
      cby_setStatus('请求失败', 'cby_is_error');
      cby_setHint(`识别失败：${cby_error.message}`, 'cby_is_error');
      cby_result.textContent = `识别失败：${cby_error.message}`;
    } finally {
      cby_busy = false;
      cby_recognizeBtn.disabled = false;
    }
  };

  const cby_init = () => {
    if (!cby_input) return;
    if (window.location.origin && window.location.origin !== 'null') {
      cby_apiUrl.textContent = `${window.location.origin}/api/vision`;
    }

    cby_drop.addEventListener('click', (cby_event) => {
      if (cby_event.target.tagName !== 'INPUT') cby_input.click();
    });

    cby_input.addEventListener('change', () => {
      if (cby_input.files && cby_input.files[0]) cby_showFile(cby_input.files[0]);
    });

    ['dragenter', 'dragover'].forEach((cby_type) => {
      cby_drop.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_drop.classList.add('cby_is_drag');
      });
    });

    ['dragleave', 'drop'].forEach((cby_type) => {
      cby_drop.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_drop.classList.remove('cby_is_drag');
      });
    });

    cby_drop.addEventListener('drop', (cby_event) => {
      const cby_files = cby_event.dataTransfer && cby_event.dataTransfer.files;
      if (cby_files && cby_files[0]) cby_showFile(cby_files[0]);
    });

    cby_recognizeBtn.addEventListener('click', cby_recognize);
  };

  cby_init();
})();
