/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
/* 独立作用域，避免与 cby_main.js 的顶层 const 重名 */
(() => {
  'use strict';

  const cby_apiPath = '/api/news';
  const cby_apiUrlEl = document.getElementById('cby_apiUrl');
  const cby_apiStatusEl = document.getElementById('cby_apiStatus');
  const cby_countEl = document.getElementById('cby_newsCount');
  const cby_listEl = document.getElementById('cby_newsList');

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
    if (!cby_listEl) return;
    cby_listEl.textContent = '';
    cby_listEl.appendChild(cby_createEl('p', cby_className, cby_text));
  };

  /* 渲染新闻列表：标题、摘要、来源、时间，封面取 cover_img */
  const cby_renderNews = (cby_list) => {
    if (!cby_listEl) return;
    cby_listEl.textContent = '';

    if (!Array.isArray(cby_list) || cby_list.length === 0) {
      cby_showMessage('暂无新闻数据', 'cby_news_empty');
      return;
    }

    cby_list.forEach((cby_item, cby_index) => {
      const cby_card = cby_createEl('article', 'cby_news_item');

      const cby_cover = cby_createEl('img', 'cby_news_cover');
      cby_cover.src = cby_item.cover_img || 'images/cby_news_01.svg';
      cby_cover.alt = `${cby_item.title} 封面图`;
      cby_cover.loading = 'lazy';
      cby_cover.addEventListener('error', () => {
        cby_cover.style.visibility = 'hidden';
        console.error('页面错误信息：封面图加载失败', cby_cover.src);
      });

      const cby_body = cby_createEl('div', 'cby_news_body');
      cby_body.appendChild(cby_createEl('h3', 'cby_news_item_title', cby_item.title));
      cby_body.appendChild(cby_createEl('p', 'cby_news_summary', cby_item.summary));

      const cby_meta = cby_createEl('div', 'cby_news_meta');
      cby_meta.appendChild(cby_createEl('span', 'cby_news_source', `来源 · ${cby_item.source}`));
      const cby_time = cby_createEl('time', 'cby_news_time', cby_item.publish_time);
      cby_meta.appendChild(cby_time);
      cby_body.appendChild(cby_meta);

      cby_card.appendChild(cby_cover);
      cby_card.appendChild(cby_body);
      cby_card.appendChild(cby_createEl('span', 'cby_news_index', String(cby_index + 1).padStart(2, '0')));
      cby_listEl.appendChild(cby_card);
    });
  };

  /* fetch 获取新闻；服务器数据与错误信息均输出到控制台 */
  const cby_loadNews = async () => {
    if (cby_apiUrlEl) cby_apiUrlEl.textContent = cby_fullUrl;
    cby_setStatus('请求中…', '');

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('当前为本地文件预览，请通过 http://localhost:8309/news.html 访问以连接后端');
      }

      const cby_res = await fetch(cby_apiPath);
      if (!cby_res.ok) throw new Error(`HTTP 状态码 ${cby_res.status}`);
      const cby_json = await cby_res.json();
      console.log('服务器返回的数据：', cby_json);

      if (cby_json.code !== 0) {
        console.error('服务器错误信息：', cby_json.msg, cby_json.data);
        cby_setStatus('请求失败', 'cby_is_error');
        cby_showMessage(`接口返回错误：${cby_json.msg}`, 'cby_news_error');
        return;
      }

      const cby_data = cby_json.data || {};
      const cby_list = Array.isArray(cby_data.cby_news) ? cby_data.cby_news : [];
      if (cby_countEl) {
        cby_countEl.textContent = String(typeof cby_data.cby_total === 'number' ? cby_data.cby_total : cby_list.length);
      }
      cby_renderNews(cby_list);
      cby_setStatus(`成功 · ${cby_list.length} 条`, 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：', cby_error);
      cby_setStatus('请求失败', 'cby_is_error');
      cby_showMessage(`新闻加载失败：${cby_error.message}`, 'cby_news_error');
    }
  };

  if (cby_listEl) {
    cby_loadNews();
  } else {
    console.error('页面错误信息：未找到新闻列表容器');
  }
})();
