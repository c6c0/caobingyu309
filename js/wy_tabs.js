// ============================================
// 文件：wy_tabs.js
// 作者：曹炳宇
// 建立时间：2026-11-04 13:42
// 使用大模型：GLM-5.3-Flash
// 功能：可复用的 Tab 选项卡组件（外部引用）
// ============================================

// 功能：初始化一个选项卡组件（可复用），传入任意 .wy_tabs 容器元素即可完成绑定
// 逻辑：点击时先清除所有选项卡的选中状态，再设置当前元素的选中状态
function wy_initTabs(wy_container) {
  // 获取容器内所有选项卡按钮与内容面板
  const wy_tabButtons = wy_container.querySelectorAll('.wy_tab_btn');
  const wy_tabPanels = wy_container.querySelectorAll('.wy_tab_panel');

  // 功能：为每个选项卡按钮绑定点击监听事件，实现选中切换
  wy_tabButtons.forEach(function (wy_btn) {
    wy_btn.addEventListener('click', function () {
      // 第一步：先清除所有选项卡按钮与面板的选中状态
      wy_tabButtons.forEach(function (wy_item) {
        wy_item.classList.remove('wy_active');
      });
      wy_tabPanels.forEach(function (wy_panel) {
        wy_panel.classList.remove('wy_active');
      });

      // 第二步：再设置当前元素的选中状态
      this.classList.add('wy_active');
      const wy_panelId = this.getAttribute('data-wy-tab');
      document.getElementById(wy_panelId).classList.add('wy_active');
    });
  });
}

// 功能：页面加载完成后，自动初始化页面上所有 .wy_tabs 选项卡组件
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.wy_tabs').forEach(function (wy_tabsEl) {
    wy_initTabs(wy_tabsEl);
  });
});
