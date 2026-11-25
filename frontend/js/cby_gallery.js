/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
/* 独立作用域，避免与 cby_main.js 的顶层 const 重名 */
(() => {
  'use strict';

  const cby_apiPath = '/api/gallery';
  const cby_apiUrlEl = document.getElementById('cby_galleryApiUrl');
  const cby_apiStatusEl = document.getElementById('cby_galleryApiStatus');
  const cby_countEl = document.getElementById('cby_galleryCount');
  const cby_gridEl = document.getElementById('cby_galleryGrid');

  const cby_origin = window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : '';
  const cby_fullUrl = cby_origin ? cby_origin + cby_apiPath : cby_apiPath;

  const cby_createEl = (cby_tag, cby_className, cby_text) => {
    const cby_el = document.createElement(cby_tag);
    if (cby_className) cby_el.className = cby_className;
    if (cby_text !== undefined) cby_el.textContent = String(cby_text);
    return cby_el;
  };

  const cby_setStatus = (cby_text, cby_kind) => {
    if (!cby_apiStatusEl) return;
    cby_apiStatusEl.className = `cby_api_hint${cby_kind ? ` ${cby_kind}` : ''}`;
    cby_apiStatusEl.textContent = cby_text;
  };

  const cby_showMessage = (cby_text, cby_className) => {
    if (!cby_gridEl) return;
    cby_gridEl.textContent = '';
    cby_gridEl.appendChild(cby_createEl('p', cby_className, cby_text));
  };

  /* 图片加载失败后的占位色块：只放 div 与文字，页面上不保留任何 img 元素 */
  const cby_makePlaceholder = () => {
    const cby_ph = cby_createEl('div', 'cby_gallery_placeholder');
    cby_ph.appendChild(cby_createEl('span', 'cby_gallery_placeholder_text', '图片暂不可用 · 占位展示'));
    return cby_ph;
  };

  /* 先用离屏 Image 预加载，成功才把 img 挂进页面；失败则整块替换为占位色块，绝不出现破图图标 */
  const cby_makeMedia = (cby_item) => {
    const cby_wrap = cby_createEl('div', 'cby_gallery_media');
    cby_wrap.appendChild(cby_createEl('div', 'cby_gallery_loading', '图片加载中…'));

    const cby_fallback = (cby_reason) => {
      console.error('页面错误信息：图片加载失败', cby_item.title, cby_item.img_url || '(空)', cby_reason);
      cby_wrap.textContent = '';
      cby_wrap.appendChild(cby_makePlaceholder());
    };

    if (!cby_item.img_url) {
      cby_fallback('img_url 为空');
      return cby_wrap;
    }

    const cby_probe = new Image();
    cby_probe.onload = () => {
      const cby_img = cby_createEl('img', 'cby_gallery_img');
      cby_img.alt = `${cby_item.title} 配图`;
      cby_img.addEventListener('error', () => cby_fallback('img 元素加载失败'));
      cby_img.src = cby_item.img_url;
      cby_wrap.textContent = '';
      cby_wrap.appendChild(cby_img);
    };
    cby_probe.onerror = () => cby_fallback('预加载失败');
    cby_probe.src = cby_item.img_url;
    return cby_wrap;
  };

  /* 渲染「上图下文」卡片：图片、标题、描述，附分类与创建时间 */
  const cby_renderGallery = (cby_list) => {
    if (!cby_gridEl) return;
    cby_gridEl.textContent = '';

    if (!Array.isArray(cby_list) || cby_list.length === 0) {
      cby_showMessage('暂无图文数据', 'cby_gallery_empty');
      return;
    }

    cby_list.forEach((cby_item) => {
      const cby_card = cby_createEl('article', 'cby_gallery_card');
      cby_card.appendChild(cby_makeMedia(cby_item));

      const cby_body = cby_createEl('div', 'cby_gallery_body');
      cby_body.appendChild(cby_createEl('h3', 'cby_gallery_card_title', cby_item.title));
      cby_body.appendChild(cby_createEl('p', 'cby_gallery_desc', cby_item.description));

      const cby_meta = cby_createEl('div', 'cby_gallery_meta');
      cby_meta.appendChild(cby_createEl('span', 'cby_gallery_category', cby_item.category));
      cby_meta.appendChild(cby_createEl('time', 'cby_gallery_time', cby_item.create_time));
      cby_body.appendChild(cby_meta);

      cby_card.appendChild(cby_body);
      cby_gridEl.appendChild(cby_card);
    });
  };

  /* fetch 获取图文数据；服务器数据与错误信息均输出到控制台 */
  const cby_loadGallery = async () => {
    if (cby_apiUrlEl) cby_apiUrlEl.textContent = cby_fullUrl;
    cby_setStatus('请求中…', '');

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('当前为本地文件预览，请通过 http://localhost:8309/gallery.html 访问以连接后端');
      }

      const cby_res = await fetch(cby_apiPath);
      if (!cby_res.ok) throw new Error(`HTTP 状态码 ${cby_res.status}`);
      const cby_json = await cby_res.json();
      console.log('服务器返回的数据：', cby_json);

      if (cby_json.code !== 0) {
        console.error('服务器错误信息：', cby_json.msg, cby_json.data);
        cby_setStatus('请求失败', 'cby_is_error');
        cby_showMessage(`接口返回错误：${cby_json.msg}`, 'cby_gallery_error');
        return;
      }

      const cby_data = cby_json.data || {};
      const cby_list = Array.isArray(cby_data.cby_gallery) ? cby_data.cby_gallery : [];
      if (cby_countEl) {
        cby_countEl.textContent = String(typeof cby_data.cby_total === 'number' ? cby_data.cby_total : cby_list.length);
      }
      cby_renderGallery(cby_list);
      cby_setStatus(`成功 · ${cby_list.length} 条`, 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：', cby_error);
      cby_setStatus('请求失败', 'cby_is_error');
      cby_showMessage(`图文数据加载失败：${cby_error.message}`, 'cby_gallery_error');
    }
  };

  if (cby_gridEl) {
    cby_loadGallery();
  } else {
    console.error('页面错误信息：未找到图文网格容器');
  }
})();
