// ============================================
// 作者：曹炳宇
// 建立时间：2026-11-06 13:26
// 使用大模型：DeepSeek-V4.1-Flash
// 功能名称：新车选项卡复用脚本（最新上市 / 即将上市）
// ============================================

// 功能：清除容器内所有标签按钮与面板的选中状态
function cby_clearActive(cby_root) {
  var cby_btns = cby_root.querySelectorAll('.cby_tab_btn');
  var cby_panels = cby_root.querySelectorAll('.cby_panel');

  for (var cby_i = 0; cby_i < cby_btns.length; cby_i++) {
    cby_btns[cby_i].classList.remove('cby_active');
  }
  for (var cby_j = 0; cby_j < cby_panels.length; cby_j++) {
    cby_panels[cby_j].classList.remove('cby_active');
  }
}

// 功能：设置当前点击的标签按钮及其对应面板为选中状态
function cby_setActive(cby_root, cby_btn) {
  var cby_panelId = cby_btn.getAttribute('data-cby-tab');
  var cby_panel = cby_root.querySelector('#' + cby_panelId);

  cby_btn.classList.add('cby_active');
  if (cby_panel) {
    cby_panel.classList.add('cby_active');
  }
}

// 功能：为选项卡容器绑定点击监听，先清除全部选中态，再设置当前元素选中态
function cby_bindTabs(cby_root) {
  var cby_btns = cby_root.querySelectorAll('.cby_tab_btn');

  for (var cby_k = 0; cby_k < cby_btns.length; cby_k++) {
    cby_btns[cby_k].addEventListener('click', function () {
      var cby_container = this.parentNode.parentNode;

      // 第一步：先清除所有选项卡的选中状态
      cby_clearActive(cby_container);

      // 第二步：再设置当前元素的选中状态
      cby_setActive(cby_container, this);
    });
  }
}

// 功能：页面加载后自动初始化所有选项卡组件（可同时存在多个实例）
function cby_initAllTabs() {
  var cby_cards = document.querySelectorAll('.cby_card');

  for (var cby_m = 0; cby_m < cby_cards.length; cby_m++) {
    cby_bindTabs(cby_cards[cby_m]);
  }
}

// 功能：等待 DOM 解析完成后执行初始化
document.addEventListener('DOMContentLoaded', cby_initAllTabs);
