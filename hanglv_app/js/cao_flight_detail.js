/* =========================================================
 * 航班详情页 JS - caobingyu
 * 效果：fetch 详情、起飞倒计时、时间轴渲染
 * ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var box = document.getElementById('cao_detail_box');
  if (!box) return;

  caoFetch('data/flight_detail.json').then(function (json) {
    var d = json.data;
    box.innerHTML =
      '<div class="cao_card">' +
        '<div class="cao_flex cao_between">' +
          '<div><div style="font-size:22px;font-weight:700">' + d.fromTime.slice(11) + ' <span style="color:#aaa;font-size:14px">→</span> ' + d.toTime.slice(11) + '</div>' +
          '<div class="cao_sub cao_mt8">' + d.fromCity + ' ' + d.fromAirport + d.fromTerminal + '  →  ' + d.toCity + ' ' + d.toAirport + d.toTerminal + '</div></div>' +
          '<span class="cao_tag cao_tag--green">' + d.status + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="cao_card">' +
        '<div class="cao_card__title">距起飞倒计时</div>' +
        '<div class="cao_countdown" id="cao_countdown">' +
          '<span class="cao_countdown__num" id="cao_h">00</span> : ' +
          '<span class="cao_countdown__num" id="cao_m">00</span> : ' +
          '<span class="cao_countdown__num" id="cao_s">00</span>' +
        '</div>' +
      '</div>' +
      '<div class="cao_card">' +
        '<div class="cao_card__title">航班信息</div>' +
        '<p class="cao_sub">航班号：' + d.id + '</p>' +
        '<p class="cao_sub cao_mt8">航空公司：' + d.airline + '</p>' +
        '<p class="cao_sub cao_mt8">机型：' + d.aircraft + '</p>' +
        '<p class="cao_sub cao_mt8">登机口：' + d.gate + '</p>' +
        '<p class="cao_sub cao_mt8">行李：' + d.baggage + '</p>' +
        '<p class="cao_sub cao_mt8">餐食：' + d.meal + ' / ' + d.wifi + '</p>' +
        '<p class="cao_sub cao_mt8">剩余座位：' + d.seatsLeft + ' 座</p>' +
      '</div>' +
      '<div class="cao_card">' +
        '<div class="cao_card__title">行程节点</div>' +
        d.timeline.map(function (t) {
          return '<div class="cao_flex" style="padding:8px 0;gap:10px">' +
            '<span style="width:50px;color:#6b7280">' + t.time + '</span>' +
            '<span style="width:8px;height:8px;border-radius:50%;background:' + (t.done ? '#16a34a' : '#d1d5db') + '"></span>' +
            '<span>' + t.event + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div style="padding:16px">' +
        '<button class="cao_btn cao_btn--accent cao_btn--block cao_btn--lg" id="cao_book_btn">立即预订 ¥' + d.price + '</button>' +
      '</div>';

    /* ---------- 效果9：起飞倒计时 ---------- */
    // 目标时间 = 当日 fromTime（这里用 JSON 中的日期）
    var target = new Date(d.fromTime.replace(/-/g, '/')).getTime();
    var hEl = document.getElementById('cao_h');
    var mEl = document.getElementById('cao_m');
    var sEl = document.getElementById('cao_s');
    function tick() {
      var diff = Math.max(0, target - Date.now());
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      hEl.textContent = (h < 10 ? '0' : '') + h;
      mEl.textContent = (m < 10 ? '0' : '') + m;
      sEl.textContent = (s < 10 ? '0' : '') + s;
    }
    tick();
    setInterval(tick, 1000);

    /* ---------- 预订按钮 ---------- */
    document.getElementById('cao_book_btn').addEventListener('click', function () {
      caoToast('已提交预订申请（演示）');
    });
  });
});
