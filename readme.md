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
├── frontend/
│   ├── index.html            首页：canvas 背景动画 + 页面链接导航
│   ├── css/cby_style.css     首页样式
│   ├── js/cby_main.js        canvas 动画、类别切换、后端状态请求
│   ├── fonts/                iconfont 图标字体（暂为空）
│   └── images/                图片资源（暂为空）
└── backend/
    ├── app.js                 服务入口：cors、static、/api/、8309
    ├── package.json          依赖与启动脚本
    ├── .env                   数据库凭据（已忽略，不提交）
    ├── .env.example           凭据模板
    ├── .npmrc                 国内镜像配置
    ├── controllers/          控制器（MVC - C）
    ├── models/                模型 / 数据库连接池（MVC - M）
    ├── routes/                路由（/api/ 前缀）
    ├── middlewares/           统一响应中间件
    ├── cby_interface.md       接口记录（追加写入）
    └── cby_database.md        建表 / 改表 / 测试数据 SQL（发生数据库操作时创建）
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

浏览器访问 <http://localhost:8309/> 打开首页；健康检查接口为 <http://localhost:8309/api/health>。
直接双击 `index.html`（file:// 协议）时后端请求不可用，请务必通过上述本地服务访问。

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

后续新增页面时，在 `frontend/index.html` 的 `cby_nav_grid` 导航区内追加 `<a class="cby_nav_card" href="...">` 卡片，页面数量会自动统计。
