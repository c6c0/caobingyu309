/* =========================================================
 * 首页 JS - caobingyu
 * 效果：Banner轮播（自动+手动）、城市交换动画、
 *       fetch 加载banner数据、查询表单校验
 * ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 效果3：Banner 自动轮播（fetch 数据渲染） ---------- */
  var track = document.querySelector('.cao_banner__track');
  var dots  = document.querySelector('.cao_banner__dots');
  if (track && dots) {
    caoFetch('data/banners.json').then(function (json) {
      var list = json.data || [];
      track.innerHTML = list.map(function (b) {
        return '<div class="cao_banner__slide" style="background-image:url(' + b.image + ')">' +
                 '<div class="cao_banner__text">' +
                   '<h2>' + b.title + '</h2>' +
                   '<p>' + b.subtitle + '</p>' +
                 '</div>' +
               '</div>';
      }).join('');
      dots.innerHTML = list.map(function (_, i) {
        return '<span class="cao_banner__dot' + (i === 0 ? ' cao_banner__dot--active' : '') + '"></span>';
      }).join('');

      var idx = 0;
      var dotsEl = dots.querySelectorAll('.cao_banner__dot');
      function go(n) {
        idx = (n + list.length) % list.length;
        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
        dotsEl.forEach(function (d, i) {
          d.classList.toggle('cao_banner__dot--active', i === idx);
        });
      }
      setInterval(function () { go(idx + 1); }, 3500);
      dotsEl.forEach(function (d, i) {
        d.addEventListener('click', function () { go(i); });
      });
    }).catch(function (e) {
      console.warn('banner load fail', e);
    });
  }

  /* ---------- 效果4：出发/到达城市交换 ---------- */
  var swapBtn = document.querySelector('.cao_search__arrow');
  var fromCity = document.getElementById('cao_from_city');
  var toCity   = document.getElementById('cao_to_city');
  if (swapBtn && fromCity && toCity) {
    swapBtn.addEventListener('click', function () {
      swapBtn.classList.toggle('cao_search__arrow--swap');
      var tmp = fromCity.textContent;
      fromCity.textContent = toCity.textContent;
      toCity.textContent = tmp;
    });
  }

  /* ---------- 效果5：查询表单校验 + 跳转列表页 ---------- */
  var searchBtn = document.getElementById('cao_search_btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      var from = fromCity ? fromCity.textContent.trim() : '';
      var to   = toCity ? toCity.textContent.trim() : '';
      if (!from || !to) { caoToast('请选择出发和到达城市'); return; }
      if (from === to)  { caoToast('出发地与目的地不能相同'); return; }
      window.location.href = 'flight_list.html?from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to);
    });
  }

  /* ---------- 效果6：快捷功能点击提示 ---------- */
  document.querySelectorAll('.cao_grid__item').forEach(function (item) {
    item.addEventListener('click', function () {
      var name = item.getAttribute('data-name') || '功能';
      caoToast('「' + name + '」模块演示版');
    });
  });
});
