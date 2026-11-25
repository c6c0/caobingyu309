/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
/* 独立作用域，避免与 cby_main.js 的顶层 const 重名 */
(() => {
  'use strict';

  const cby_form = document.getElementById('cby_dbForm');
  const cby_userInput = document.getElementById('cby_dbUser');
  const cby_passwordInput = document.getElementById('cby_dbPassword');
  const cby_testBtn = document.getElementById('cby_dbTestBtn');
  const cby_result = document.getElementById('cby_dbResult');

  /* 追加一行键值信息 */
  const cby_appendRow = (cby_list, cby_key, cby_value) => {
    const cby_row = document.createElement('div');
    cby_row.className = 'cby_result_row';
    const cby_keyEl = document.createElement('span');
    cby_keyEl.className = 'cby_result_key';
    cby_keyEl.textContent = cby_key;
    const cby_valueEl = document.createElement('span');
    cby_valueEl.className = 'cby_result_value';
    cby_valueEl.textContent = String(cby_value === undefined || cby_value === null || cby_value === '' ? '—' : cby_value);
    cby_row.appendChild(cby_keyEl);
    cby_row.appendChild(cby_valueEl);
    cby_list.appendChild(cby_row);
  };

  /* 渲染结果：成功绿色、失败红色 */
  const cby_renderResult = (cby_ok, cby_msg, cby_detail) => {
    if (!cby_result) return;
    cby_result.className = `cby_result ${cby_ok ? 'cby_result_success' : 'cby_result_error'}`;
    cby_result.textContent = '';

    const cby_head = document.createElement('div');
    cby_head.className = 'cby_result_head';
    const cby_dot = document.createElement('span');
    cby_dot.className = 'cby_result_dot';
    const cby_title = document.createElement('strong');
    cby_title.className = 'cby_result_title';
    cby_title.textContent = cby_ok ? '连接成功' : '连接失败';
    cby_head.appendChild(cby_dot);
    cby_head.appendChild(cby_title);
    cby_result.appendChild(cby_head);

    const cby_msgEl = document.createElement('p');
    cby_msgEl.className = 'cby_result_msg';
    cby_msgEl.textContent = cby_msg;
    cby_result.appendChild(cby_msgEl);

    const cby_list = document.createElement('div');
    cby_list.className = 'cby_result_list';
    Object.keys(cby_detail).forEach((cby_key) => {
      cby_appendRow(cby_list, cby_key, cby_detail[cby_key]);
    });
    cby_result.appendChild(cby_list);
  };

  /* 提交表单：调用 /api/db-test，数据与错误均输出到控制台 */
  const cby_handleSubmit = async (cby_event) => {
    cby_event.preventDefault();
    if (!cby_form || !cby_userInput || !cby_passwordInput || !cby_testBtn) {
      console.error('页面错误信息：表单元素缺失');
      return;
    }

    const cby_payload = {
      cby_username: cby_userInput.value.trim(),
      cby_password: cby_passwordInput.value
    };
    console.log('提交的连接参数：', { cby_username: cby_payload.cby_username, cby_password: '***' });

    cby_testBtn.disabled = true;
    cby_testBtn.textContent = '测试中…';

    try {
      if (window.location.protocol === 'file:') {
        throw new Error('当前为本地文件预览，请通过 http://localhost:8309/database.html 访问以连接后端');
      }

      const cby_res = await fetch('/api/db-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cby_payload)
      });
      if (!cby_res.ok) throw new Error(`HTTP 状态码 ${cby_res.status}`);

      const cby_json = await cby_res.json();
      console.log('服务器返回的数据：', cby_json);

      const cby_ok = cby_json.code === 0;
      if (!cby_ok) console.error('服务器错误信息：', cby_json.msg, cby_json.data);

      const cby_data = cby_json.data || {};
      cby_renderResult(cby_ok, cby_json.msg, cby_ok ? {
        '数据库版本': cby_data.cby_version,
        '主机': cby_data.cby_host,
        '端口': cby_data.cby_port,
        '数据库': cby_data.cby_database,
        '用户名': cby_data.cby_user,
        '时间': cby_data.cby_time
      } : {
        '错误详情': cby_data.cby_error,
        '错误码': cby_data.cby_code,
        '错误号': cby_data.cby_errno
      });
    } catch (cby_error) {
      console.error('服务器错误信息：', cby_error);
      cby_renderResult(false, `请求失败：${cby_error.message}`, { '错误详情': cby_error.message });
    } finally {
      cby_testBtn.disabled = false;
      cby_testBtn.textContent = '测试连接';
    }
  };

  if (cby_form) {
    cby_form.addEventListener('submit', cby_handleSubmit);
  } else {
    console.error('页面错误信息：未找到数据库连接测试表单');
  }
})();
