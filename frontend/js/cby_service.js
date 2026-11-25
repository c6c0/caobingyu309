/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
/* 独立作用域，避免与 cby_main.js 的顶层 const 重名 */
(() => {
  'use strict';

  const cby_apiPath = '/api/chat';
  const cby_maxLength = 1000;
  const cby_historyLimit = 12;
  const cby_reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* 前端只保存平台名与展示信息，Key 永远留在后端 .env */
  const cby_platformInfo = {
    siliconflow: { cby_label: '硅基流动', cby_model: 'Qwen/Qwen2.5-7B-Instruct' },
    qiniu: { cby_label: '七牛', cby_model: 'qwen/qwen3.8-flash-next' }
  };

  let cby_history = [];
  let cby_pending = false;

  const cby_apiUrlEl = document.getElementById('cby_apiUrl');
  const cby_apiStatusEl = document.getElementById('cby_apiStatus');
  const cby_messagesEl = document.getElementById('cby_chatMessages');
  const cby_formEl = document.getElementById('cby_chatForm');
  const cby_inputEl = document.getElementById('cby_chatInput');
  const cby_sendEl = document.getElementById('cby_chatSend');
  const cby_clearEl = document.getElementById('cby_chatClear');
  const cby_countEl = document.getElementById('cby_chatCount');
  const cby_quickListEl = document.getElementById('cby_quickList');
  const cby_platformSelectEl = document.getElementById('cby_platformSelect');
  const cby_platformLabelEl = document.getElementById('cby_platformLabel');
  const cby_modelNameEl = document.getElementById('cby_modelName');

  const cby_currentPlatform = () => (
    cby_platformSelectEl && cby_platformInfo[cby_platformSelectEl.value]
      ? cby_platformSelectEl.value
      : 'siliconflow'
  );

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

  const cby_now = () => {
    const cby_date = new Date();
    return `${String(cby_date.getHours()).padStart(2, '0')}:${String(cby_date.getMinutes()).padStart(2, '0')}`;
  };

  const cby_scrollToBottom = () => {
    if (cby_messagesEl) cby_messagesEl.scrollTop = cby_messagesEl.scrollHeight;
  };

  /* 追加一条消息，返回气泡元素；kind: bot / user / error */
  const cby_addMessage = (cby_kind, cby_text) => {
    if (!cby_messagesEl) return null;

    const cby_row = cby_createEl('div', `cby_msg cby_msg_${cby_kind}`);
    const cby_avatar = cby_createEl('span', 'cby_msg_avatar', cby_kind === 'user' ? '我' : (cby_kind === 'error' ? '!' : '曹'));
    const cby_body = cby_createEl('div', 'cby_msg_body');
    const cby_bubble = cby_createEl('div', 'cby_msg_bubble', cby_text);
    const cby_time = cby_createEl('span', 'cby_msg_time', cby_now());

    cby_body.appendChild(cby_bubble);
    cby_body.appendChild(cby_time);
    cby_row.appendChild(cby_avatar);
    cby_row.appendChild(cby_body);
    cby_messagesEl.appendChild(cby_row);
    cby_scrollToBottom();
    return cby_bubble;
  };

  /* “正在输入”占位，返回移除函数 */
  const cby_addTyping = () => {
    if (!cby_messagesEl) return () => {};

    const cby_row = cby_createEl('div', 'cby_msg cby_msg_bot');
    cby_row.appendChild(cby_createEl('span', 'cby_msg_avatar', '曹'));
    const cby_body = cby_createEl('div', 'cby_msg_body');
    const cby_bubble = cby_createEl('div', 'cby_msg_bubble');
    const cby_dots = cby_createEl('span', 'cby_dots');
    cby_dots.appendChild(cby_createEl('i'));
    cby_dots.appendChild(cby_createEl('i'));
    cby_dots.appendChild(cby_createEl('i'));
    cby_bubble.appendChild(cby_dots);
    cby_body.appendChild(cby_bubble);
    cby_row.appendChild(cby_body);
    cby_messagesEl.appendChild(cby_row);
    cby_scrollToBottom();

    return () => {
      if (cby_row.parentNode) cby_row.parentNode.removeChild(cby_row);
    };
  };

  /* 打字机效果逐字显示回复 */
  const cby_typewrite = (cby_bubble, cby_text) => new Promise((cby_resolve) => {
    if (!cby_bubble || cby_reduceMotion) {
      if (cby_bubble) cby_bubble.textContent = cby_text;
      cby_scrollToBottom();
      cby_resolve();
      return;
    }

    let cby_index = 0;
    const cby_step = () => {
      cby_index = Math.min(cby_text.length, cby_index + 2);
      cby_bubble.textContent = cby_text.slice(0, cby_index);
      cby_scrollToBottom();
      if (cby_index < cby_text.length) {
        window.setTimeout(cby_step, 16);
      } else {
        cby_resolve();
      }
    };
    cby_step();
  });

  const cby_setPending = (cby_value) => {
    cby_pending = cby_value;
    if (cby_sendEl) cby_sendEl.disabled = cby_value;
    if (cby_inputEl) cby_inputEl.disabled = cby_value;
    if (cby_quickListEl) {
      cby_quickListEl.querySelectorAll('.cby_quick_btn').forEach((cby_btn) => {
        cby_btn.disabled = cby_value;
      });
    }
  };

  const cby_updateCount = () => {
    if (!cby_inputEl || !cby_countEl) return;
    cby_countEl.textContent = `${cby_inputEl.value.length} / ${cby_maxLength}`;
  };

  const cby_resizeInput = () => {
    if (!cby_inputEl) return;
    cby_inputEl.style.height = 'auto';
    cby_inputEl.style.height = `${Math.min(cby_inputEl.scrollHeight, 118)}px`;
  };

  /* 发送消息：历史记录只带最近 12 条，密钥由后端负责 */
  const cby_send = async (cby_rawText) => {
    const cby_text = String(cby_rawText || '').trim();
    if (!cby_text || cby_pending) return;

    if (cby_text.length > cby_maxLength) {
      cby_addMessage('error', `消息过长，请控制在 ${cby_maxLength} 个字符以内`);
      return;
    }

    const cby_past = cby_history.slice(-cby_historyLimit);

    cby_addMessage('user', cby_text);
    cby_history.push({ role: 'user', content: cby_text });

    if (cby_inputEl) {
      cby_inputEl.value = '';
      cby_resizeInput();
      cby_updateCount();
    }

    cby_setPending(true);
    cby_setStatus('正在生成…', '');

    const cby_removeTyping = cby_addTyping();

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('当前为本地文件预览，请通过 http://localhost:8309/service.html 访问以连接后端');
      }

      const cby_res = await fetch(cby_apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cby_message: cby_text,
          cby_history: cby_past,
          cby_platform: cby_currentPlatform()
        })
      });
      if (!cby_res.ok) throw new Error(`HTTP 状态码 ${cby_res.status}`);

      const cby_json = await cby_res.json();
      console.log('服务器返回的数据：', cby_json);

      if (cby_json.code !== 0) {
        console.error('服务器错误信息：', cby_json.msg, cby_json.data);
        cby_removeTyping();
        cby_setStatus(cby_json.code === 2 ? '未配置密钥' : '请求失败', 'cby_is_error');
        cby_addMessage('error', cby_json.msg || '客服回复失败，请稍后重试');
        return;
      }

      const cby_data = cby_json.data || {};
      const cby_reply = cby_data.cby_reply || '';
      if (cby_data.cby_model && cby_modelNameEl) cby_modelNameEl.textContent = cby_data.cby_model;
      if (cby_data.cby_platform_label && cby_platformLabelEl) cby_platformLabelEl.textContent = cby_data.cby_platform_label;

      cby_removeTyping();
      const cby_bubble = cby_addMessage('bot', '');
      await cby_typewrite(cby_bubble, cby_reply);

      cby_history.push({ role: 'assistant', content: cby_reply });
      cby_setStatus(`成功 · ${cby_data.cby_platform_label || '大模型'} · ${cby_data.cby_model || ''}`.trim(), 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：', cby_error);
      cby_removeTyping();
      cby_setStatus('请求失败', 'cby_is_error');
      cby_addMessage('error', `客服回复失败：${cby_error.message}`);
    } finally {
      cby_setPending(false);
      if (cby_inputEl) cby_inputEl.focus();
    }
  };

  /* 切换平台时只更新展示信息，历史消息保留，可接着对话 */
  const cby_applyPlatform = (cby_announce) => {
    const cby_key = cby_currentPlatform();
    const cby_info = cby_platformInfo[cby_key];
    if (cby_platformLabelEl) cby_platformLabelEl.textContent = cby_info.cby_label;
    if (cby_modelNameEl) cby_modelNameEl.textContent = cby_info.cby_model;
    if (cby_announce) cby_setStatus(`已切换为${cby_info.cby_label}，可直接继续提问`, '');
  };

  const cby_showWelcome = () => {
    if (!cby_messagesEl) return;
    cby_messagesEl.textContent = '';
    cby_addMessage('bot', '你好，我是中华美食街的在线客服“小食”。\n我目前只解答三类问题：营业时间、招牌菜、配送范围。其它问题我会请你留言，由工作人员回复。\n你可以直接点击左侧常见问题，也可以切换上方的模型平台（硅基流动 / 七牛）再提问。');
  };

  /* 清空对话 */
  const cby_reset = () => {
    cby_history = [];
    cby_showWelcome();
    cby_setStatus('等待对话', '');
  };

  const cby_init = () => {
    if (!cby_messagesEl || !cby_formEl || !cby_inputEl) {
      console.error('页面错误信息：未找到在线客服所需的页面元素');
      return;
    }

    if (cby_apiUrlEl) cby_apiUrlEl.textContent = cby_fullUrl;
    cby_applyPlatform(false);
    cby_showWelcome();
    cby_updateCount();

    cby_formEl.addEventListener('submit', (cby_event) => {
      cby_event.preventDefault();
      cby_send(cby_inputEl.value);
    });

    cby_inputEl.addEventListener('input', () => {
      cby_updateCount();
      cby_resizeInput();
    });

    cby_inputEl.addEventListener('keydown', (cby_event) => {
      if (cby_event.key === 'Enter' && !cby_event.shiftKey && !cby_event.isComposing) {
        cby_event.preventDefault();
        cby_send(cby_inputEl.value);
      }
    });

    if (cby_quickListEl) {
      cby_quickListEl.addEventListener('click', (cby_event) => {
        const cby_btn = cby_event.target.closest('.cby_quick_btn');
        if (!cby_btn) return;
        cby_send(cby_btn.dataset.cbyQ || cby_btn.textContent);
      });
    }

    if (cby_clearEl) {
      cby_clearEl.addEventListener('click', () => {
        if (cby_pending) return;
        cby_reset();
      });
    }

    if (cby_platformSelectEl) {
      cby_platformSelectEl.addEventListener('change', () => {
        cby_applyPlatform(true);
        console.log('已切换模型平台：', cby_platformSelectEl.value);
      });
    }
  };

  cby_init();
})();
