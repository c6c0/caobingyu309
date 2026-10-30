/* =========================================================
 * 个人中心 JS - caobingyu
 * 效果：fetch 用户数据、头像本地预览、设置项开关
 * ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  var box = document.getElementById('cao_user_box');
  if (!box) return;

  caoFetch('data/user.json').then(function (json) {
    var u = json.data;
    document.getElementById('cao_user_name').textContent = u.name;
    document.getElementById('cao_user_level').textContent = u.level + ' · 里程 ' + u.miles;
    document.getElementById('cao_miles_num').textContent = u.miles;
    document.getElementById('cao_order_num').textContent = u.orderCount;
    document.getElementById('cao_coupon_num').textContent = u.couponCount;

    // 常用航线
    var fr = document.getElementById('cao_favorite_routes');
    if (fr) {
      fr.innerHTML = u.favoriteRoutes.map(function (r) {
        return '<div class="cao_menu__item"><span>' + r.from + ' → ' + r.to + '</span>' +
               '<span class="cao_menu__arrow cao_sub">已飞 ' + r.count + ' 次</span></div>';
      }).join('');
    }
  });

  /* ---------- 效果10：头像本地预览（FileReader） ---------- */
  var fileInput = document.getElementById('cao_avatar_input');
  var avatarBox = document.getElementById('cao_avatar_box');
  if (fileInput && avatarBox) {
    avatarBox.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () {
      var f = this.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        avatarBox.innerHTML = '<img src="' + e.target.result + '" alt="avatar">';
      };
      reader.readAsDataURL(f);
    });
  }

  /* ---------- 效果11：设置项开关切换 ---------- */
  document.querySelectorAll('.cao_switch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      sw.classList.toggle('cao_switch--on');
      var label = sw.getAttribute('data-label') || '选项';
      caoToast(label + (sw.classList.contains('cao_switch--on') ? '已开启' : '已关闭'));
    });
  });
});
