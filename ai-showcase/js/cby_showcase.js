/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
/* 五模块合并页：Tab 切换 iframe，并定位到知识库的上传区 / 问答区 */
(function () {
  'use strict';

  var cby_tabs = Array.prototype.slice.call(document.querySelectorAll('.cby_show_tab'));
  var cby_frames = Array.prototype.slice.call(document.querySelectorAll('.cby_show_frame'));

  /* 五个 Tab 复用到 4 个真实页面，知识库的两个模块共用同一个 iframe */
  var cby_viewMap = {
    service: 'service',
    'kb-upload': 'kb',
    'kb-ask': 'kb',
    vision: 'vision',
    asr: 'asr'
  };

  /* 知识库的两个模块进入后滚到对应区域 */
  var cby_anchorMap = {
    'kb-upload': 'cby_dropZone',
    'kb-ask': 'cby_qaInput'
  };

  var cby_ensureFrame = function (cby_frame) {
    var cby_iframe = cby_frame.querySelector('.cby_show_iframe');
    if (cby_iframe && !cby_iframe.getAttribute('src')) {
      cby_iframe.src = cby_frame.getAttribute('data-cby-src');
    }
    return cby_iframe;
  };

  var cby_scrollToAnchor = function (cby_iframe, cby_anchorId) {
    if (!cby_iframe || !cby_anchorId) return;

    var cby_apply = function () {
      try {
        var cby_doc = cby_iframe.contentDocument;
        var cby_target = cby_doc && cby_doc.getElementById(cby_anchorId);
        if (cby_target) cby_target.scrollIntoView({ block: 'center' });
      } catch (cby_error) {
        console.warn('定位知识库区域失败：', cby_error.message);
      }
    };

    var cby_ready = cby_iframe.contentDocument && cby_iframe.contentDocument.readyState === 'complete';
    if (cby_ready) {
      setTimeout(cby_apply, 160);
    } else {
      cby_iframe.addEventListener('load', function () { setTimeout(cby_apply, 220); }, { once: true });
    }
  };

  var cby_activate = function (cby_view) {
    var cby_frameKey = cby_viewMap[cby_view];
    if (!cby_frameKey) return;

    cby_tabs.forEach(function (cby_tab) {
      var cby_on = cby_tab.getAttribute('data-cby-view') === cby_view;
      cby_tab.classList.toggle('cby_is_active', cby_on);
      cby_tab.setAttribute('aria-selected', cby_on ? 'true' : 'false');
    });

    var cby_activeFrame = null;
    cby_frames.forEach(function (cby_frame) {
      var cby_on = cby_frame.getAttribute('data-cby-frame') === cby_frameKey;
      cby_frame.classList.toggle('cby_is_active', cby_on);
      if (cby_on) cby_activeFrame = cby_frame;
    });

    if (!cby_activeFrame) return;
    var cby_iframe = cby_ensureFrame(cby_activeFrame);
    cby_scrollToAnchor(cby_iframe, cby_anchorMap[cby_view]);

    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + cby_view);
    }
  };

  cby_tabs.forEach(function (cby_tab) {
    cby_tab.addEventListener('click', function () {
      cby_activate(cby_tab.getAttribute('data-cby-view'));
    });
  });

  /* 支持直接用 #kb-ask 之类的地址打开指定模块 */
  var cby_initial = (window.location.hash || '').replace('#', '');
  cby_activate(cby_viewMap[cby_initial] ? cby_initial : 'service');
})();
