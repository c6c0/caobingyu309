/* =========================================================
 * 航班列表页 JS - caobingyu
 * 效果：fetch 渲染航班、筛选 tab、按价格/时间排序
 * ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var listBox = document.getElementById('cao_flight_list');
  if (!listBox) return;

  var allFlights = [];

  // 从 URL 读取出发/到达城市
  var params = new URLSearchParams(location.search);
  var from = params.get('from') || '北京';
  var to   = params.get('to')   || '上海';
  var titleEl = document.getElementById('cao_route_title');
  if (titleEl) titleEl.textContent = from + ' → ' + to;

  /* ---------- 效果7：fetch 航班数据并渲染 ---------- */
  caoFetch('data/flights.json').then(function (json) {
    allFlights = json.data || [];
    render(allFlights);
  });

  function render(list) {
    if (!list.length) {
      listBox.innerHTML = '<div class="cao_card cao_center">暂无符合条件的航班</div>';
      return;
    }
    listBox.innerHTML = list.map(function (f) {
      var statusTag = f.status === '准点'
        ? '<span class="cao_tag cao_tag--green">准点</span>'
        : '<span class="cao_tag cao_tag--orange">' + f.status + '</span>';
      return '<a class="cao_flight cao_fadein" href="flight_detail.html?id=' + f.id + '">' +
        '<div class="cao_flight__times">' +
          '<div class="cao_flight__time">' + f.fromTime + '</div>' +
          '<div class="cao_flight__city">' + f.fromCity + ' ' + f.fromAirport + '</div>' +
        '</div>' +
        '<div class="cao_flight__route">' +
          '<div>' + f.airline + ' ' + f.id + '</div>' +
          '<div class="cao_flight__line"></div>' +
          '<div>时长 ' + f.duration + '</div>' +
        '</div>' +
        '<div class="cao_flight__times">' +
          '<div class="cao_flight__time">' + f.toTime + '</div>' +
          '<div class="cao_flight__city">' + f.toCity + ' ' + f.toAirport + '</div>' +
        '</div>' +
        '<div class="cao_flight__price">' +
          '<strong>¥' + f.price + '</strong>' +
          '<span>' + f.discount + '</span>' +
          statusTag +
        '</div>' +
      '</a>';
    }).join('');
  }

  /* ---------- 效果8：筛选 tab（仅看直飞/低价） ---------- */
  document.querySelectorAll('.cao_filter__item').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.cao_filter__item').forEach(function (t) {
        t.classList.remove('cao_filter__item--active');
      });
      tab.classList.add('cao_filter__item--active');
      var type = tab.getAttribute('data-type');
      if (type === 'cheap') {
        render(allFlights.slice().sort(function (a, b) { return a.price - b.price; }));
      } else if (type === 'morning') {
        render(allFlights.filter(function (f) { return f.fromTime < '12:00'; }));
      } else {
        render(allFlights);
      }
    });
  });
});
