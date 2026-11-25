# AGENTS.md

本项目（`frontend/` + `backend/`）的开发约定，AI 与人工改动都必须遵守。

## 项目结构与技术栈
- 前端：`frontend/` 目录
  - 原生 HTML、CSS、JavaScript，**禁止**使用任何第三方库、框架、CDN 链接
  - 目录结构：`frontend/` 下建 `css/`、`js/`、`fonts/`、`images/` 子目录；`fonts/` 存放 iconfont 图标文件（如果有）
- 后端：`backend/` 目录，Node.js + Express，RESTful + MVC 风格
  - 所有接口以 `/api/` 为前缀，端口固定为 `8309`
  - 使用 `express.static` 托管 `frontend/` 静态资源目录
  - 通过 `cors` 中间件开放全部跨域访问（本配置仅用于课程作业）
- 依赖安装
  - 先把 npm 源切换为国内镜像：`npm config set registry https://registry.npmmirror.com`
  - 安装依赖：`npm i 包名`
- 数据库：MySQL
  - 凭据只写入 `backend/.env`，变量名：`DB_USER`、`DB_PASSWORD`、`DB_HOST`、`DB_NAME`
  - 凭据**不得**出现在代码或本文件中；`.env` 同时加入 `.gitignore`
  - 按后端需要自行建立和修改数据库表；每张表建立后插入至少 8 条有真实业务意义的测试数据

## AI 服务配置（密钥只存 backend/.env）
- 硅基流动：`SILICONFLOW_API_KEY`、`SILICONFLOW_BASE_URL`、`SILICONFLOW_MODEL`、`SILICONFLOW_EMBEDDING_MODEL`、`SILICONFLOW_VISION_MODEL`
- 七牛云：`QINIU_API_KEY`、`QINIU_ASR_BASE_URL`、`QINIU_ASR_MODEL`、`QINIU_CHAT_BASE_URL`、`QINIU_CHAT_MODEL`
- 以上密钥**只允许**写入 `backend/.env`（已加入 `.gitignore`）；**禁止**写入本文件、`.trae/rules/`、代码、日志、作业文档与截图

## 命名与注释
- CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）一律以 `cby_` 开头
- 每个文件头部包含注释块：

  ```
  姓名：曹炳宇 | 学号：24002120309 | 时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}
  ```

  HTML 用 `<!-- -->`，CSS 用 `/* */`，JS/Node 用 `/* */`。

## 记录文件（一律追加写入，禁止覆盖已有内容）
- `caobingyu_prompt.md`（项目根目录）：每次向 AI 发出开发指令后，追加记录：时间 | 提示词全文 | 大模型名称
- `backend/cby_interface.md`：每次创建或修改接口后，追加：接口路径 | HTTP 方法 | 请求参数（含示例） | 响应格式（含 JSON 示例） | 修改时间
- `backend/cby_database.md`：每次建表、改表或插入数据后，按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），要求仅凭此文件即可在新机器上完整重建数据库
- 工作区规则 `.trae/rules/cby_naming_and_prompt_log.md` 仍要求同时追加 `cby_prompt.md`，两者都要写
- 统一 JSON 响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code = 0` 表示成功，非 0 表示失败

## 前端约定
- 服务器返回的数据和错误信息输出到浏览器控制台（`console.log` / `console.error`）
- 新建 HTML 页面后，在 `frontend/index.html` 中追加超链接入口；文件名包含 `detail` 的页面除外

## 环境与工具链（沿用本机现状）
`python`、`node`、`git` 均不在 PATH 上可用，使用绝对路径：
- Git 2.55：`D:\WEB前端设计\web-c\高级网页设计\Git\cmd\git.exe`
- Node 24.21：`D:\WEB前端设计\web-c\node.exe`；npm 11.19：`& 'D:\WEB前端设计\web-c\node.exe' 'D:\WEB前端设计\node_modules\npm\bin\npm-cli.js' <cmd>`（根目录 `npm.cmd` 会回退 PATH 而失败）
- Python 3.8：`D:\新建文件夹 (2)\anaconda3\python.exe`（或 `D:\SPSS\Python3\python.exe`）

- 涉及 `fetch` 的页面用本地服务器预览，不要双击 HTML：`& 'D:\新建文件夹 (2)\anaconda3\python.exe' -m http.server 8080`
- PowerShell 5.1：不支持 `&&`，用 `;` 或 `if ($?)`；中文/空格路径用 `-LiteralPath`；控制台乱码只是代码页显示问题，文件本身是 UTF-8，不要为此重写文件

## Git / 提交注意事项
- 提交前检查根目录 `.gitignore`，必须排除 `Trae CN/`（约 1.6 GB）、`node_modules/`、整个 `web-c/`（嵌套克隆）、安装包 `*.exe`、`web-c/高级网页设计/Git/`，以及 `backend/.env`；不要盲目 `git add -A`
- `web-c/` 自带 `.git` 和远端，不能嵌套进 `cby` 仓库
- Gitee token 以明文存放在 `skills/提交项目/SKILL.md` 和 `cby_prompt.md` 中，禁止打印、复制或写入新文件；仓库一旦公开需立即轮换
- 提交信息使用中文，先 `git --no-pager log --oneline -5` 查看现有风格再写
