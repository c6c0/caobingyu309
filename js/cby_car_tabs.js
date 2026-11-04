// ============================================
// 文件：cby_car_tabs.js
// 作者：曹炳宇
// 建立时间：2026-11-04 14:05
// 使用大模型：GLM-5.3-Flash
// 功能：新车上市选项卡（可复用 Tab 组件，外部引用）
// ============================================

// 功能：初始化一个选项卡组件（可复用），传入 .cby_widget 容器元素即可完成绑定
// 逻辑：点击时先清除所有选项卡的选中状态，再设置当前元素的选中状态
function cby_initTabs(cby_container) {
  // 获取容器内所有选项卡按钮与内容面板
  const cby_btns = cby_container.querySelectorAll('.cby_tab_btn');
  const cby_panels = cby_container.querySelectorAll('.cby_panel');

  // 功能：为每个选项卡按钮绑定点击监听事件，实现选中切换
  cby_btns.forEach(function (cby_btn) {
    cby_btn.addEventListener('click', function () {
      // 第一步：先清除所有选项卡按钮与面板的选中状态
      cby_btns.forEach(function (cby_item) {
        cby_item.classList.remove('cby_active');
      });
      cby_panels.forEach(function (cby_panel) {
        cby_panel.classList.remove('cby_active');
      });

      // 第二步：再设置当前元素的选中状态
      this.classList.add('cby_active');
      const cby_panelId = this.getAttribute('data-cby-tab');
      document.getElementById(cby_panelId).classList.add('cby_active');
    });
  });
}

// 功能：页面加载完成后，自动初始化页面上所有 .cby_widget 选项卡组件
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.cby_widget').forEach(function (cby_widget) {
    cby_initTabs(cby_widget);
  });
});
