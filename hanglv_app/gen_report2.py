# -*- coding: utf-8 -*-
"""生成曹炳宇-航旅纵横-图像解决方案项目报告.docx"""
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

doc = Document()

# 默认字体
style = doc.styles['Normal']
style.font.name = '宋体'
style.font.size = Pt(12)
style._element.rPr.rFonts.set(qn('w:eastAsia'), '宋体')

# ===== 标题 =====
t = doc.add_paragraph()
t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run('《高级网页设计 I》')
r.bold = True; r.font.size = Pt(18)
r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

t2 = doc.add_paragraph()
t2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t2.add_run('图像解决方案 项目报告')
r.bold = True; r.font.size = Pt(16)
r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph()

# ===== 信息表格 =====
table = doc.add_table(rows=4, cols=2)
table.style = 'Table Grid'
data = [('学号', '24002120309'),
        ('姓名', '曹炳宇'),
        ('班级', '商务24003'),
        ('项目选题名称', '航旅纵横')]
for i, (k, v) in enumerate(data):
    table.rows[i].cells[0].text = k
    table.rows[i].cells[1].text = v
    for p in table.rows[i].cells[0].paragraphs:
        for run in p.runs:
            run.bold = True

doc.add_paragraph()

# ===== 实施过程 =====
h = doc.add_heading('实施过程', level=1)
for r in h.runs:
    r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

# 一、项目需求与实现
h = doc.add_heading('一、项目需求与实现', level=2)
for r in h.runs:
    r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph(
    '本三级项目为仿制的航旅纵横移动端 Web 应用，含首页（探索/出行双子Tab）、行程、经验（广场/点评榜双子Tab）、'
    '动态（航班/火车动态双子Tab）、我的、登录、航班列表、航班详情、后台管理等 9 个页面。'
    '本报告选取三级项目的下导航（底部 Tab 栏）作为图像解决方案主题：下导航共 5 个图标，'
    '全部采用内联 SVG 矢量图标，以 <svg><path></svg> 的方式在每个页面中直接引用，'
    '图标颜色通过 fill="currentColor" 自动继承 CSS 文字颜色，实现选中态变色。'
)

doc.add_paragraph('下导航原图（航旅纵横官方 App）：（见真实APP截图）')
doc.add_paragraph('下导航实现图：（见 index.html 底部导航栏）')
doc.add_paragraph('从项目中获得的所有 SVG 图标：首页、行程、经验、动态、我，共 5 个。')

# 二、项目代码
h = doc.add_heading('二、项目代码', level=2)
for r in h.runs:
    r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph(
    '要求：使用字体图标或 SVG 的方式使用图标；代码中包含学号或姓名，或类名包含姓名缩写；'
    '原则上不使用 id 选择器；设计全局 CSS。本项目：图标以内联 SVG 方式使用；'
    '所有页面注释含学号 24002120309、姓名曹炳宇，类名统一使用 cao_ 前缀（曹炳宇拼音首字母）；'
    '页面尽量避免 id 选择器；全局公共样式抽离为 css/cao_style.css。'
)

doc.add_paragraph('核心代码：')

doc.add_paragraph('（1）下导航 HTML（index.html）—— 使用内联 SVG 图标：')
code1 = '''<nav class="cao_tabbar">
  <a class="cao_tabbar__item cao_tabbar__item--active" href="index.html">
    <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
    <span>首页</span>
  </a>
  <a class="cao_tabbar__item" href="trip.html">
    <svg viewBox="0 0 24 24"><path d="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/></svg>
    <span>行程</span>
  </a>
  <a class="cao_tabbar__item" href="experience.html">
    <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/></svg>
    <span>经验</span>
  </a>
  <a class="cao_tabbar__item" href="flight_status.html">
    <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
    <span>动态</span>
  </a>
  <a class="cao_tabbar__item" href="mine.html">
    <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>
    <span>我</span>
  </a>
</nav>'''
p = doc.add_paragraph(code1)
for r in p.runs:
    r.font.name = 'Consolas'; r.font.size = Pt(9)

doc.add_paragraph('（2）全局公共 CSS（css/cao_style.css）：')
code2 = '''/* 24002120309 曹炳宇 全局公共样式 */
* { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
body { font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
       background:#f5f7fa; max-width:480px; margin:0 auto; }

.cao_tabbar {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 480px; height: 62px;
  background: #fff; border-top: 1px solid #e5e7eb;
  display: flex; z-index: 100;
}
.cao_tabbar__item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 2px; color: #9ca3af; font-size: 11px;
  text-decoration: none;
}
.cao_tabbar__item svg { width: 24px; height: 24px; fill: currentColor; }
.cao_tabbar__item--active { color: #22c55e; }  /* 航旅纵横品牌绿 */'''
p = doc.add_paragraph(code2)
for r in p.runs:
    r.font.name = 'Consolas'; r.font.size = Pt(9)

# 三、测试与发布
h = doc.add_heading('三、测试与发布', level=2)
for r in h.runs:
    r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph(
    '不同浏览器测试：在 Chrome、Edge 浏览器下打开 index.html，内联 SVG 图标全部正常显示，'
    '5 个图标（首页/行程/经验/动态/我）在选中态变为航旅纵横品牌绿色 #22c55e，未选中态为灰色 #9ca3af；'
    '在手机模式（375×667）和桌面模式（1200×800）下均居中显示，最大宽度 480px。'
)
doc.add_paragraph(
    '发布：本项目为纯静态页面，通过 python -m http.server 8080 启动本地服务器运行，'
    '可部署至 Gitee Pages / GitHub Pages，或放入本地 WAMP 服务器 www 目录运行。'
)

# 四、项目总结
h = doc.add_heading('四、项目总结', level=2)
for r in h.runs:
    r.font.name = '黑体'; r._element.rPr.rFonts.set(qn('w:eastAsia'), '黑体')

doc.add_paragraph(
    '本次图像解决方案选取项目底部下导航为对象，将原本的 emoji 占位图标全部替换为内联 SVG 矢量图标，'
    '并以 fill="currentColor" 方式实现选中态自动变色。'
)

doc.add_paragraph('项目收获：')
doc.add_paragraph(
    '1. 理解了 SVG 矢量图标的工作原理，图标通过 viewBox="0 0 24 24" 定义坐标系，'
    '可任意缩放而不失真，解决了移动端高清屏显示模糊的问题；', style='List Number')
doc.add_paragraph(
    '2. 学会使用 fill="currentColor" 让图标颜色自动继承 CSS 文字颜色，'
    '选中态变色只需要改父元素的 color 属性，不需要为图标单独写颜色；', style='List Number')
doc.add_paragraph(
    '3. 通过抽取 css/cao_style.css 公共样式，实现 9 个页面底部导航代码零重复，'
    '类名统一使用 cao_ 前缀（曹炳宇拼音首字母），符合全局 CSS 设计要求。', style='List Number')

doc.add_paragraph('遇到的问题与教训：')
doc.add_paragraph(
    '1. 最初使用 emoji 图标作为占位，在不同设备上显示风格不一致且无法变色；'
    '改为内联 SVG 后统一了图标风格，实现了选中态绿色高亮；', style='List Number')
doc.add_paragraph(
    '2. 最初所有页面都写了相同的底部导航 HTML，代码重复严重；'
    '后来将样式抽到 cao_style.css 中，只保留 HTML 结构，减少了重复代码；', style='List Number')
doc.add_paragraph(
    '3. SVG 图标默认 fill 为黑色，需要显式设置 fill="currentColor" 才能跟随 CSS 颜色变化，'
    '否则选中态图标不会变色。', style='List Number')

doc.add_paragraph(
    'AI 使用说明：本次项目使用 AI 辅助完成 SVG 图标 path 路径设计、'
    '底部导航 HTML 结构编写与移动端适配调试；本人负责图标选取、代码阅读、页面样式调整与全部功能测试。'
)

doc.add_paragraph(
    '心得体会：图像资源是网页设计的核心元素，采用矢量 SVG 图标方案可以显著减少图片请求、'
    '保证高清显示并方便换色，是移动端页面"图像解决方案"的高效实践。'
    '通过本次作业，我对 SVG 矢量图标、currentColor 机制和全局 CSS 抽离有了更深入的理解。'
)

# 保存
out = r'D:\WEB前端设计\24002120309-曹炳宇-图像解决方案项目报告.docx'
doc.save(out)
print('Saved:', out)
