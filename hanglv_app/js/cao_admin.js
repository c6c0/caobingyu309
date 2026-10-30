/* =========================================================
 * 后台管理 JS - caobingyu
 * 效果：侧边栏切换、fetch 渲染订单表格、统计数字
 * ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 效果12：侧边栏菜单切换 ---------- */
  document.querySelectorAll('.cao_admin_side__item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.cao_admin_side__item').forEach(function (i) {
        i.classList.remove('cao_admin_side__item--active');
      });
      item.classList.add('cao_admin_side__item--active');
      var panel = item.getAttribute('data-panel');
      document.querySelectorAll('.cao_admin_panel').forEach(function (p) {
        p.style.display = (p.id === 'panel-' + panel) ? 'block' : 'none';
      });
    });
  });

  /* ---------- 效果13：fetch 航班数据渲染后台表格 ---------- */
  var tbody = document.getElementById('cao_admin_tbody');
  if (tbody) {
    caoFetch('data/flights.json').then(function (json) {
      tbody.innerHTML = json.data.map(function (f) {
        var tag = f.status === '准点'
          ? '<span class="cao_tag cao_tag--green">准点</span>'
          : '<span class="cao_tag cao_tag--orange">' + f.status + '</span>';
        return '<tr>' +
          '<td>' + f.id + '</td>' +
          '<td>' + f.airline + '</td>' +
          '<td>' + f.fromCity + ' ' + f.fromAirport + '</td>' +
          '<td>' + f.toCity + ' ' + f.toAirport + '</td>' +
          '<td>' + f.fromTime + ' - ' + f.toTime + '</td>' +
          '<td>¥' + f.price + '</td>' +
          '<td>' + tag + '</td>' +
        '</tr>';
      }).join('');
    });
  }

  /* ---------- 数字动画：统计卡片 ---------- */
  document.querySelectorAll('.cao_stat__num[data-target]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var cur = 0;
    var step = Math.ceil(target / 40);
    var timer = setInterval(function () {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(timer); }
      el.textContent = cur.toLocaleString();
    }, 30);
  });
});
