<!--
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
-->

# 开发指令记录

一律追加写入，禁止覆盖已有内容。

## 记录 1

- 时间：2026-11-20 13:47:41
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
在当前项目根目录创建 AGENTS.md，写入以下规则。
## 项目结构与技术栈
- 前端：frontend/ 目录
- 原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接
- 目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录；
fonts/ 存放 iconfont 图标文件（如果有）
- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，
所有接口以 /api/ 为前缀，端口固定为 8309
- 使用 express.static 托管 frontend/ 静态资源目录。
- 后端通过 cors 中间件开放全部跨域访问，本配置仅用于课程作业。
- 后端依赖安装：预先将 npm 源切换为国内镜像：
npm config set registry  https://registry.npmmirror.com
- 后端依赖安装： npm i 包名
- 数据库：MySQL（用户名 root、密码：***，凭据明文已写入 backend/.env，按规则不在本文件记录）
- 数据库凭据写入 backend/.env（变量名：DB_USER、DB_PASSWORD、DB_HOST、DB_NAME），
不得出现在代码或 AGENTS.md 中；.env 同时加入 .gitignore
- 根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据
## 命名与注释
- CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）
一律以 cby_ 开头
- 每个文件头部包含注释块：
姓名：曹炳宇 | 学号：24002120309 |
时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}
## 记录文件（一律追加写入，禁止覆盖已有内容）
- caobingyu_prompt.md（项目根目录）：每次向 AI 发出开发指令后，
追加记录：时间 | 提示词全文 | 大模型名称
- backend/cby_interface.md：每次创建或修改接口后，追加：
接口路径 | HTTP 方法 | 请求参数（含示例）|
响应格式（含 JSON 示例）| 修改时间
- backend/cby_database.md：每次建表、改表或插入数据后，
按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），
要求仅凭此文件即可在新机器上完整重建数据库
- 统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }，
code=0 表示成功，非 0 表示失败
## 前端约定
- 服务器返回的数据和错误信息输出到浏览器控制台（console.log / console.error）；
- 新建 HTML 页面后，在 frontend/index.html 中追加超链接入口；
文件名包含 detail 的页面除外
```

> 说明：依据「数据库凭据不得出现在代码或 AGENTS.md 中」的约定，本记录中的数据库密码已脱敏为 `***`，完整凭据仅存放于 backend/.env。

## 记录 2

- 时间：2026-11-20 13:51:54
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
请初始化本项目：
1、git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页 index.html，包括姓名曹炳宇、学号24002120309、项目名称、项目类别（自选、模仿），所有完成的 html 页面的超链接。有 canvas 背景动画。主体是页面链接导航。页面美观。
4、创建 readme.md，在根目录下，包括学号、姓名。
```

## 记录 3

- 时间：2026-11-20 14:00:57
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
创建运行后台的bat文件，在根目录下。
```

## 记录 4

- 时间：2026-11-20 14:13:43
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
请继续执行任务
```

## 记录 5

- 时间：2026-11-20 14:16:42
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
创建运行后台的bat文件，在根目录下。
```

## 记录 6

- 时间：2026-11-20 14:20:43
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
创建运行后台的 bat 文件，放在项目根目录：
1、自动切换到 backend 目录再启动（用 %~dp0，双击时不受当前路径影响）；
2、使用 chcp 65001 避免中文日志乱码；
3、启动命令与 package.json 中的脚本保持一致；
4、结尾加 pause，出错时窗口不关闭。
```

## 记录 7

- 时间：2026-11-20 14:33:08
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
在 frontend/ 下创建 database.html：
1、页面有用户名、密码两个输入框，默认用户名 root，密码默认***，一个"测试连接"按钮；
2、点击后调用后端接口 /api/db-test，把用户名密码发给后端；
3、后端用 mysql2 尝试连接 MySQL，成功返回 { code:0, msg:"数据库连接成功", data:{ 数据库版本 } }，失败返回 code 非 0 和错误信息；
4、前端把结果显示在页面上：成功用绿色，失败用红色，同时在控制台输出；
5、数据库凭据从 backend/.env 读取，不要写死在代码里；
6、完成后在 frontend/index.html 加上本页面的超链接入口。
```

> 说明：沿用记录 1 的脱敏约定，提示词中的数据库密码以 `***` 代替，完整凭据仅存放于 backend/.env；页面输入框的默认填充值按指令保留在 frontend/database.html。

## 记录 8

- 时间：2026-11-20 14:39:07
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
完成科技新闻列表页面：
1、在 MySQL 中建表 cby_news，字段包含：id、title、summary、content、source、publish_time、cover_img；
2、插入至少 8 条真实的科技新闻测试数据；
3、后端提供 GET /api/news 接口，返回全部新闻（按发布时间倒序），统一 JSON 格式 { code, msg, data }；
4、新建 frontend/news.html，页面顶部显示当前调用的接口地址，下方以列表展示新闻标题、摘要、来源、时间；
5、数据用 fetch 获取，控制台输出返回数据；
6、把建表与插入数据的 SQL 追加写入 backend/cby_database.md，接口信息追加写入 backend/cby_interface.md，本次提示词追加写入 caobingyu_prompt.md；
7、在 frontend/index.html 增加入口链接。
```

## 记录 9

- 时间：2026-11-20 14:51:06
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
完成图文列表页面：
1、在 MySQL 中新建表 cby_gallery，字段：id、title、description、img_url、category、create_time，插入至少 8 条测试数据；
2、后端提供 GET /api/gallery 接口，返回全部图文数据；
3、新建 frontend/gallery.html，页面顶部显示接口地址，下方用网格布局展示"上图下文"卡片：图片、标题、描述；
4、图片加载失败时显示占位色块，不要出现破图图标；
5、页面适配手机宽度；
6、记录写入 backend/cby_database.md、backend/cby_interface.md 和 caobingyu_prompt.md，并在首页加入口。
```

## 记录 10

- 时间：2026-11-20 21:46:11
- 大模型名称：Claude Opus 6（claude-opus-6）
- 提示词全文：

```text
替我生成合适且符合场景图片并添加到 http://localhost:8309/gallery.html中
```

> 说明：执行前已就「AI 生成实景图会额外消耗积分（每张约 5–10 积分）」向用户确认，用户选择「8 张 AI 实景图（推荐）」方案。中途网络中断后，用户以「请继续执行任务」要求续跑，故本次记录合并为一条。

## 记录 11

- 时间：2026-11-25 13:56:00
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
使用硅基流动 完成在线客服页面：
```

> 说明：按「后端代理调用 + 前端聊天界面」实现，密钥仅写入 backend/.env（SILICONFLOW_API_KEY），前端不接触密钥。

## 记录 12

- 时间：2026-11-25 13:58:01
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
SILICONFLOW_API_KEY=sk-****（已脱敏，真实密钥仅写入 backend/.env）
SILICONFLOW_MODEL=Qwen/Qwen2.5-7B-Instruct
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

> 说明：按规则密钥不落盘到任何记录文件，仅写入 backend/.env；随后重启后端并联调 POST /api/chat。

## 记录 13

- 时间：2026-11-25 14:05:00
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
1.完成知识库文件上传功能，构建2个知识库文件，完成基于知识库的问答，支持doc和docx，ppt，完成知识库管理（RAG）：基于本地文件（如 PDF/TXT）上传、解析，构建专属自动客服或问答系统，包括知识库文件上传模块。在控制台输出发送给大模型的数据和接受自大模型的数据。
2.完成图像识别功能，上传图片，返回该图片的描述，使用已有的api-key和模型。
3.实现一个语音识别的功能，使用七牛的Qwen-Audio-3.0-ASR-Flash模型，输入语音，输出文字。
```

> 说明：知识库采用「解析 → 分块 → 硅基流动 bge-m3 向量化 → MySQL 存储 → 余弦相似度召回 → 大模型作答」的 RAG 链路；语音识别使用七牛云 OpenAI 兼容接口，密钥占位在 backend/.env 的 QINIU_API_KEY。

## 记录 14

- 时间：2026-11-25 14:22:00
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
七牛的 QINIU_API_KEY：sk-****（已脱敏，真实密钥仅写入 backend/.env）
```

> 说明：密钥写入 backend/.env 后重启后端，用 Windows 语音合成生成测试音频联调 POST /api/asr。

## 记录 15

- 时间：2026-11-25 14:26:29
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
（延续记录 14 的联调）语音识别返回 no available channels for model Qwen-Audio-3.0-ASR-Flash，请修正并复测。
```

> 说明：七牛接口的模型标识大小写敏感，`QINIU_ASR_MODEL` 改为全小写 `qwen-audio-3.0-asr-flash`（`.env`、`.env.example`、控制器默认值、cby_interface.md 同步修正），重启后端后 `POST /api/asr` 复测通过：`{"code":0,"msg":"语音识别成功","data":{"cby_text":"你好，这是一段语音识别测试。今天天气不错，欢迎使用在线客服系统。","cby_model":"qwen-audio-3.0-asr-flash",...}}`。

## 记录 16

- 时间：2026-11-25 14:33:04
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
完成这三个任务（附任务清单截图）：
任务一 把 Key 藏好（安全规范）：检查 .env 是否在 .gitignore 中；前端代码里是否残留 Key；把 Key 截图打码后再放进作业文档。列出你找到的 3 处“可能泄露 Key 的地方”。
任务二 客服人设改造（提示词工程）：把 AI 聊天改造成“中华美食街在线客服”：只回答营业时间、招牌菜、配送范围三类问题；问到其他内容时礼貌引导留言。要求写出 system 提示词、测试 5 个问题（3 个该答、2 个该拒），并解释为什么这样写能“管住”模型。
任务三 多平台热切换 + 答辩（工程思维）：让页面支持在“硅基流动 / 七牛”之间切换（后端读取配置即可，前端加一个下拉框），并现场演示切换后照常对话。答辩三问：① 为什么 Key 不能放前端？② 多轮对话为什么要把历史消息一起发？③ 换个平台你改哪几个值？为什么只改这几个？
```

> 说明：新增 `作业文档.md`（含打码截图 `cby_key_masked.png`）；`cby_chatModel.js` 改为多平台表结构并重写中华美食街 system 提示词；`POST /api/chat` 支持 `cby_platform`；`service.html` 增加平台下拉框；实测 5 问（3 答 2 拒）与七牛切换均通过；`deepseek-v3` 等旧模型在七牛已下线，选用 `qwen/qwen3.8-flash-next`。

## 记录 17

- 时间：2026-11-25 14:42:40
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
这是七牛的 QINIU_API_KEY：sk-****（已脱敏，明文仅存 backend/.env），请写入规则中。
```

> 说明：密钥第 20 行已在 `backend/.env` 配置并实测可用；按 AGENTS.md 与任务一的 Key 安全规范，明文不写入任何规则/文档，改在根 `AGENTS.md` 与 `ccerwe/AGENTS.md` 增加「AI 服务配置」段，记录变量名与"只存 backend/.env"的约束。

## 记录 18

- 时间：2026-11-25 14:57:10
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
替我将这几个网页合并，并且制作成一个新网页，并且将这五个模块进行一个案例展示（附在线客服、知识库、图像识别、语音识别页面截图）。
澄清：五个模块 = 在线客服、知识库上传管理、知识库问答、图像识别、语音识别；合并方式 = Tab 内嵌 + 案例展示。
```

> 说明：新增 `frontend/showcase.html` + `css/cby_showcase.css` + `js/cby_showcase.js`，用 Tab + iframe 合并五个模块，下方用截图卡片做案例展示；截图复制到 `frontend/images/`；首页增加入口。

## 记录 19

- 时间：2026-11-25 15:31:20
- 大模型名称：DeepSeek-V4.1-Flash
- 提示词全文：

```text
替我上传到 https://github.com/c6c0/caobingyu309.git，并且将其合并到 index 中。
澄清：ccerwe 独立仓库推到新分支 ccerwe，main 保持不变；在根目录 index.html 加入口。
```

> 说明：ccerwe 仓库新增 `.gitignore`（忽略 `backend/cby_uploads/`），提交后以 `main:ccerwe` 推送到 GitHub；根目录 `index.html` 增加「AI 五模块案例展示（ccerwe）」入口并单独提交到 main。
