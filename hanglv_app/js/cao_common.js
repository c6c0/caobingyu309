/* =========================================================
 * 公共 JS - caobingyu
 * 包含：导航栏滚动变色、回到顶部、通用弹窗提示
 * ========================================================= */

/**
 * 效果1：顶部导航栏滚动时增加阴影（滚动距离>10px触发）
 */
function caoInitNavScroll() {
  var nav = document.querySelector('.cao_nav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      nav.classList.add('cao_nav--solid');
    } else {
      nav.classList.remove('cao_nav--solid');
    }
  }, { passive: true });
}

/**
 * 效果2：回到顶部按钮
 */
function caoInitBackTop() {
  var btn = document.querySelector('.cao_backtop');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('cao_backtop--show');
    } else {
      btn.classList.remove('cao_backtop--show');
    }
  }, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 通用弹窗（轻提示）
 */
function caoToast(msg) {
  var old = document.querySelector('.cao_toast');
  if (old) old.remove();
  var el = document.createElement('div');
  el.className = 'cao_toast';
  el.textContent = msg;
  el.style.cssText = 'position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);' +
    'background:rgba(0,0,0,.75);color:#fff;padding:10px 20px;border-radius:8px;' +
    'font-size:14px;z-index:999;animation:caoFadeIn .25s ease;';
  document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 1800);
}

/**
 * 通用 fetch 封装
 */
function caoFetch(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) throw new Error('network error: ' + res.status);
    return res.json();
  });
}

/**
 * 页面加载完成后初始化公共组件
 */
document.addEventListener('DOMContentLoaded', function () {
  caoInitNavScroll();
  caoInitBackTop();
});
