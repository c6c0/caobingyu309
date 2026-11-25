<!--
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
-->

# ccerwe · Web 前端课程设计作品集

- **学号**：24002120309
- **姓名**：曹炳宇
- **项目名称**：Web 前端课程设计作品集
- **项目类别**：自选（首页右上角可切换为「模仿」）
- **建立时间**：2026-11-20

## 技术栈

| 层次 | 技术 | 说明 |
| --- | --- | --- |
| 前端 | 原生 HTML / CSS / JavaScript | 不使用任何第三方库、框架、CDN 链接 |
| 后端 | Node.js + Express | RESTful + MVC，接口统一以 `/api/` 为前缀，端口固定 `8309` |
| 静态资源 | `express.static` | 后端直接托管 `frontend/`，访问 `/` 即打开首页 |
| 跨域 | `cors` 中间件 | 开放全部跨域访问，仅用于课程作业 |
| 数据库 | MySQL | 通过 `mysql2` 连接池访问，凭据只存于 `backend/.env` |

## 目录结构

```text
ccerwe/
├── AGENTS.md                 项目开发规则（权威约定）
├── readme.md                 本文件
├── caobingyu_prompt.md       开发指令记录（追加写入）
├── .gitignore                忽略 node_modules/、.env 等
├── cby_run_backend.bat        Windows 一键启动后端服务
├── frontend/
│   ├── index.html            首页：canvas 背景动画 + 页面链接导航
│   ├── database.html          数据库连接测试：账号密码表单 + 版本结果
│   ├── news.html              科技新闻列表：顶部接口地址 + 新闻卡片
│   ├── gallery.html           图文列表：响应式网格 + 图片占位降级
│   ├── css/cby_style.css     全局基础样式（渐变背景、玻璃拟态）
│   ├── css/cby_database.css  数据库测试页表单与结果样式
│   ├── css/cby_news.css       新闻列表样式
│   ├── css/cby_gallery.css    图文网格与占位色块样式
│   ├── js/cby_main.js        canvas 动画、类别切换、后端状态请求
│   ├── js/cby_database.js     提交 /api/db-test 并渲染成功 / 失败结果
│   ├── js/cby_news.js         fetch /api/news 并渲染新闻列表
│   ├── js/cby_gallery.js      fetch /api/gallery 并渲染图文网格
│   ├── fonts/                iconfont 图标字体（暂为空）
│   └── images/                8 张新闻封面 SVG + 8 张图文实景 PNG（另存 7 张早期 SVG）
└── backend/
    ├── app.js                 服务入口：cors、static、/api/、8309
    ├── package.json          依赖与启动脚本
    ├── .env                   数据库凭据（已忽略，不提交）
    ├── .env.example           凭据模板
    ├── .npmrc                 国内镜像配置
    ├── cby_init_db.js         按 cby_database.md 重建（latest 参数仅执行最新记录）
    ├── controllers/          控制器（MVC - C）
    ├── models/                模型 / 数据库连接池（MVC - M）
    ├── routes/                路由（/api/ 前缀）
    ├── middlewares/           统一响应中间件
    ├── cby_interface.md       接口记录（追加写入）
    └── cby_database.md       建库 / 两张表建表 / 各 8 条 INSERT / img_url 更新（追加写入，可独立重建）
```

## 启动方式

```bash
# 1. 切换国内镜像（项目级 .npmrc 已配置，可跳过）
npm config set registry https://registry.npmmirror.com

# 2. 安装依赖
cd backend
npm i express cors dotenv mysql2

# 3. 配置数据库凭据：复制 .env.example 为 .env 并填写真实值
#    DB_USER / DB_PASSWORD / DB_HOST / DB_NAME

# 4. 启动服务
npm start
```

浏览器访问 <http://localhost:8309/> 打开首页；数据库连接测试页为 <http://localhost:8309/database.html>，科技新闻列表页为 <http://localhost:8309/news.html>，图文列表页为 <http://localhost:8309/gallery.html>。已提供接口：`GET /api/health`（健康检查）、`POST /api/db-test`（MySQL 连接测试，返回数据库版本）、`GET /api/news`（全部新闻，按发布时间倒序）、`GET /api/gallery`（全部图文数据，按创建时间倒序）。

首次在新机器上重建数据库：配好 `backend/.env` 后执行 `cd backend && node cby_init_db.js`，脚本按 `cby_database.md` 记录顺序自动建库、建 `cby_news` 与 `cby_gallery` 两张表，各插入 8 条测试数据，并把图文配图路径更新为 `.png`（在空库上执行一次即可）。本机只需追加执行最新一条 SQL 记录时用 `node cby_init_db.js latest`，避免重复插入已有数据。图文列表页的 8 张配图是本地生成的写实场景图（`frontend/images/cby_gallery_01.png` ~ `cby_gallery_08.png`，1536×1024），不依赖任何外链或 CDN。
直接双击 `index.html`（file:// 协议）时后端请求不可用，请务必通过上述本地服务访问。

### Windows 一键启动

项目根目录提供 `cby_run_backend.bat`：

| 用法 | 说明 |
| --- | --- |
| 双击 `cby_run_backend.bat` | 启动后端，控制台可见日志，按 `Ctrl+C` 停止 |
| `cby_run_backend.bat check` | 只自检目录 / npm / 依赖，不启动服务 |

脚本要点：用 `cd /d "%~dp0backend"` 切换目录，双击时不受当前路径影响；`chcp 65001` 保证中文日志不乱码；启动命令 `npm start` 与 `package.json` 的 `start` 脚本（`node app.js`）一致；结尾有 `pause`，依赖缺失、npm 未安装、服务异常退出时窗口都保持不关闭，便于查看错误。依赖缺失时会按国内镜像自动安装。

> 维护提示：该 `.bat` 必须保存为 **UTF-8 无 BOM + CRLF**。GBK 编码或 LF 行尾会让 cmd 解析错位；中文注释请用带引号的 `REM "..."`，不要用含 `+`、`；`、`.bat` 等字符的 `::` 注释。

首次运行请用 `http://localhost:8309/` 打开首页。

## 开发约定摘要

完整规则见根目录 `AGENTS.md`，要点：

- CSS 类名、JS 变量名 / 函数名、数据库表名及字段一律以 `cby_` 开头。
- 每个文件头部带注释块：`姓名：曹炳宇 | 学号：24002120309 | 时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}`。
- 统一 JSON 响应：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code = 0` 成功，非 0 失败。
- 每张数据库表建立后须插入至少 8 条有真实业务意义的测试数据。
- 服务器返回的数据与错误信息须 `console.log` / `console.error` 输出到浏览器控制台。
- 新建 HTML 页面后在 `frontend/index.html` 追加超链接入口（文件名含 `detail` 的页面除外）。
- 记录文件一律追加写入、禁止覆盖：`caobingyu_prompt.md`、`backend/cby_interface.md`、`backend/cby_database.md`。

## 已完成页面

| 页面 | 入口 | 说明 |
| --- | --- | --- |
| 首页 · 项目总览 | `frontend/index.html` | 姓名、学号、项目名称、项目类别、canvas 背景动画、页面导航、后端状态 |
| 数据库连接测试 | `frontend/database.html` | 用户名 / 密码输入框、测试连接按钮、成功绿色 / 失败红色结果、数据库版本、控制台输出 |
| 科技新闻列表 | `frontend/news.html` | 顶部显示当前接口地址，fetch 读取 `/api/news`，卡片展示标题、摘要、来源、发布时间与本地封面图 |
| 图文列表 | `frontend/gallery.html` | 顶部显示当前接口地址，fetch 读取 `/api/gallery`，响应式网格展示「上图下文」卡片与 8 张本地生成的场景实景图；图片加载失败时替换为渐变占位色块，不出现破图图标；适配手机宽度 |

后续新增页面时，在 `frontend/index.html` 的 `cby_nav_grid` 导航区内追加 `<a class="cby_nav_card" href="...">` 卡片，页面数量会自动统计。
