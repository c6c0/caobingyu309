<!--
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
-->

# 接口记录

一律追加写入，禁止覆盖已有内容；每次创建或修改接口后追加一条。

## 记录 1 · GET /api/health

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/health` |
| HTTP 方法 | GET |
| 请求参数 | 无。请求示例：`GET http://localhost:8309/api/health` |
| 响应格式 | 统一 JSON：`{ "code": 0, "msg": "提示信息", "data": {...} }`，code=0 成功，非 0 失败；data 内含 cby_service、cby_status、cby_port、cby_time |
| 修改时间 | 2026-11-20 13:51:54 |

响应 JSON 示例：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "cby_service": "cby_ccerwe_backend",
    "cby_status": "running",
    "cby_port": 8309,
    "cby_time": "2026-11-20T05:51:54.000Z"
  }
}
```

失败响应 JSON 示例（接口不存在）：

```json
{ "code": 404, "msg": "接口不存在", "data": {} }
```

## 记录 2 · POST /api/db-test

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/db-test` |
| HTTP 方法 | POST |
| 请求参数 | `Content-Type: application/json`；body 字段 `cby_username`（用户名，留空回退 .env 的 DB_USER）、`cby_password`（密码，留空回退 .env 的 DB_PASSWORD）。主机、端口、库名由 backend/.env 的 DB_HOST / DB_PORT / DB_NAME 提供。请求示例：`POST http://localhost:8309/api/db-test`，body `{ "cby_username": "root", "cby_password": "***" }`；curl 示例：`curl -X POST http://localhost:8309/api/db-test -H "Content-Type: application/json" -d "{\"cby_username\":\"root\",\"cby_password\":\"***\"}"` |
| 响应格式 | 统一 JSON：`{ "code": 0, "msg": "提示信息", "data": {...} }`，code=0 成功、非 0 失败。成功 data 含 cby_version（数据库版本）、cby_host、cby_port、cby_database、cby_user、cby_time；失败 data 含 cby_error、cby_code、cby_errno |
| 修改时间 | 2026-11-20 14:33:08 |

成功响应 JSON 示例（本机 MySQL 8.0.30 实测）：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "cby_version": "8.0.30",
    "cby_host": "localhost",
    "cby_port": 3306,
    "cby_database": "ccerwe",
    "cby_user": "root",
    "cby_time": "2026-11-20T06:32:33.621Z"
  }
}
```

失败响应 JSON 示例（错误凭据实测）：

```json
{
  "code": 1,
  "msg": "数据库连接失败：Access denied for user 'cby_wrong_user'@'localhost' (using password: YES)",
  "data": {
    "cby_error": "Access denied for user 'cby_wrong_user'@'localhost' (using password: YES)",
    "cby_code": "ER_ACCESS_DENIED_ERROR",
    "cby_errno": 1045
  }
}
```

补充说明：请求体为空 `{}` 时，账号密码回退到 backend/.env，实测同样返回 code=0。连接由 `models/cby_db.js` 的 `cby_connectTest` 建立（mysql2/promise 的 `createConnection` 返回 Promise，须 await），执行 `SELECT VERSION() AS cby_version` 后立即关闭连接，不读写任何业务表，因此记录 2 当时不涉及建表，`cby_database.md` 自记录 3 起创建。

## 记录 3 · GET /api/news

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/news` |
| HTTP 方法 | GET |
| 请求参数 | 无。请求示例：`GET http://localhost:8309/api/news` |
| 响应格式 | 统一 JSON：`{ "code": 0, "msg": "提示信息", "data": {...} }`。data 含 `cby_news`（新闻数组，按 `publish_time` 倒序）、`cby_total`（总条数）；每条新闻含 `id`、`title`、`summary`、`content`、`source`、`publish_time`、`cover_img`，其中 `publish_time` 已用 `DATE_FORMAT` 格式化为 `YYYY-MM-DD HH:mm` 字符串 |
| 修改时间 | 2026-11-20 14:39:07 |

成功响应 JSON 示例（数组内仅列出第 1 条，实际共 8 条）：

```json
{
  "code": 0,
  "msg": "新闻列表获取成功",
  "data": {
    "cby_total": 8,
    "cby_news": [
      {
        "id": 1,
        "title": "国产业级算力集群投入使用，万卡规模支撑大模型训练",
        "summary": "首个全国产化万卡算力集群在贵州数据中心正式投运，面向大模型训练与推理提供弹性算力。",
        "content": "该集群采用国产加速卡与自研互联协议，配套液冷散热与统一调度平台。运营方表示……",
        "source": "科技日报",
        "publish_time": "2026-11-19 09:20",
        "cover_img": "images/cby_news_01.svg"
      }
    ]
  }
}
```

失败响应 JSON 示例（表不存在或数据库不可达时，由控制器捕获异常）：

```json
{
  "code": 1,
  "msg": "新闻列表获取失败：Table 'ccerwe.cby_news' doesn't exist",
  "data": { "cby_error": "Table 'ccerwe.cby_news' doesn't exist", "cby_code": "ER_NO_SUCH_TABLE" }
}
```

补充说明：数据来自 `models/cby_newsModel.js` 的 `cby_findAll()`，SQL 为 `SELECT ... FROM cby_news ORDER BY cby_news.publish_time DESC, cby_news.id DESC`。建库、建表与 8 条测试数据 INSERT 的完整 SQL 已按执行顺序写入 `backend/cby_database.md` 记录 1，可用 `node cby_init_db.js` 一键重建。

## 记录 4 · GET /api/gallery

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/gallery` |
| HTTP 方法 | GET |
| 请求参数 | 无。请求示例：`GET http://localhost:8309/api/gallery`；curl 示例：`curl http://localhost:8309/api/gallery` |
| 响应格式 | 统一 JSON：`{ "code": 0, "msg": "提示信息", "data": {...} }`。data 含 `cby_gallery`（图文数组，按 `create_time` 倒序）、`cby_total`（总条数）；每条含 `id`、`title`、`description`、`img_url`、`category`、`create_time`，其中 `create_time` 已用 `DATE_FORMAT` 格式化为 `YYYY-MM-DD HH:mm` 字符串，`img_url` 为 `frontend/images/` 下的本地相对路径 |
| 修改时间 | 2026-11-20 14:51:06 |

成功响应 JSON 示例（数组内仅列出第 1 条，实际共 8 条）：

```json
{
  "code": 0,
  "msg": "图文列表获取成功",
  "data": {
    "cby_total": 8,
    "cby_gallery": [
      {
        "id": 1,
        "title": "晨光里的图书馆",
        "description": "清晨第一缕阳光穿过玻璃幕墙，落在自习区的木质长桌上，书页与光影构成安静的阅读角落。",
        "img_url": "images/cby_gallery_01.svg",
        "category": "校园建筑",
        "create_time": "2026-11-19 09:10"
      }
    ]
  }
}
```

失败响应 JSON 示例（表不存在或数据库不可达时，由控制器捕获异常）：

```json
{
  "code": 1,
  "msg": "图文列表获取失败：Table 'ccerwe.cby_gallery' doesn't exist",
  "data": { "cby_error": "Table 'ccerwe.cby_gallery' doesn't exist", "cby_code": "ER_NO_SUCH_TABLE" }
}
```

补充说明：数据来自 `models/cby_galleryModel.js` 的 `cby_findAll()`，SQL 为 `SELECT ... FROM cby_gallery ORDER BY cby_gallery.create_time DESC, cby_gallery.id DESC`。建表与 8 条测试数据 INSERT 的完整 SQL 已按执行顺序追加到 `backend/cby_database.md` 记录 2；新机器执行 `node cby_init_db.js` 全量重建，本机增量执行 `node cby_init_db.js latest`。第 8 条 `img_url` 当时指向故意不生成的 `images/cby_gallery_08.svg`，用于验证前端图片加载失败时显示占位色块、不出现破图图标；该图片已于记录 5 补齐。

## 记录 5 · GET /api/gallery 图片资源更新（接口结构未变）

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/gallery`（路由、控制器、模型与响应结构均未改动，仅数据内容更新） |
| HTTP 方法 | GET |
| 请求参数 | 无。请求示例：`GET http://localhost:8309/api/gallery` |
| 响应格式 | 与记录 4 相同：`{ "code": 0, "msg": "图文列表获取成功", "data": { "cby_total": 8, "cby_gallery": [...] } }`；每条的 `img_url` 由 `images/cby_gallery_0N.svg` 更新为 `images/cby_gallery_0N.png`，8 条全部为本地生成、贴合各自场景的写实配图（1536×1024，无外链 / CDN） |
| 修改时间 | 2026-11-20 21:46:11 |

更新后响应 JSON 示例（仅列第 1 条）：

```json
{
  "code": 0,
  "msg": "图文列表获取成功",
  "data": {
    "cby_total": 8,
    "cby_gallery": [
      {
        "id": 1,
        "title": "晨光里的图书馆",
        "description": "清晨第一缕阳光穿过玻璃幕墙，落在自习区的木质长桌上，书页与光影构成安静的阅读角落。",
        "img_url": "images/cby_gallery_01.png",
        "category": "校园建筑",
        "create_time": "2026-11-19 09:10"
      }
    ]
  }
}
```

补充说明：8 条 `UPDATE` 语句按执行顺序追加在 `backend/cby_database.md` 记录 3，用 `title` 定位以免 AUTO_INCREMENT 起点差异造成错位；本机以 `node cby_init_db.js latest` 执行。记录 4 中「第 8 条图片故意缺失」的说明属于当时的历史状态，现已补齐；前端 `cby_gallery.js` 的离屏预加载与占位色块降级逻辑保持不变，作为图片缺失时的容错机制。

## 记录 6 · POST /api/chat（在线客服，新增）

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/chat` |
| HTTP 方法 | POST（`Content-Type: application/json`） |
| 请求参数 | `cby_message`：必填，字符串，1–1000 字符，用户本轮提问；`cby_history`：选填，数组，最多 12 条，只接受 `role` 为 `user` / `assistant` 且 `content` 非空的记录，用于多轮上下文 |
| 响应格式 | 统一格式 `{ "code": 0, "msg": "...", "data": {...} }`。成功时 `data` 含 `cby_reply`（回复文本）、`cby_model`（实际模型名）、`cby_usage`（token 用量，可能为 null）；`code = 2` 表示后端未配置 `SILICONFLOW_API_KEY`；其余非 0 表示调用失败 |
| 修改时间 | 2026-11-25 13:56:00 |

请求示例：

```json
{
  "cby_message": "这个网站用了哪些技术？",
  "cby_history": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好，我是小曹，有什么可以帮你？" }
  ]
}
```

成功响应示例：

```json
{
  "code": 0,
  "msg": "回复生成成功",
  "data": {
    "cby_reply": "本站前端使用原生 HTML、CSS、JavaScript……",
    "cby_model": "Qwen/Qwen2.5-7B-Instruct",
    "cby_usage": { "prompt_tokens": 320, "completion_tokens": 96, "total_tokens": 416 }
  }
}
```

未配置密钥时的响应示例：

```json
{
  "code": 2,
  "msg": "在线客服回复失败：后端未配置硅基流动密钥，请在 backend/.env 中填写 SILICONFLOW_API_KEY 后重启服务",
  "data": {
    "cby_error": "后端未配置硅基流动密钥，请在 backend/.env 中填写 SILICONFLOW_API_KEY 后重启服务"
  }
}
```

补充说明：实现位于 `controllers/cby_chatController.js`（参数校验、历史消息清洗）与 `models/cby_chatModel.js`（通过 Node 内置 `fetch` 调用 `https://api.siliconflow.cn/v1/chat/completions`，超时 60 秒）。密钥与模型名只从 `backend/.env` 的 `SILICONFLOW_API_KEY`、`SILICONFLOW_MODEL`、`SILICONFLOW_BASE_URL` 读取，前端不接触密钥。前端页面为 `frontend/service.html`，样式与脚本为 `css/cby_service.css`、`js/cby_service.js`。

## 记录 7 · 知识库（RAG）、图像识别、语音识别接口（新增）

统一说明：以下接口均返回 `{ "code": 0, "msg": "...", "data": {...} }`；`code = 2` 表示后端缺少对应平台密钥，`code = 3` 表示知识库为空，其余非 0 为业务失败。文件上传均使用 `multipart/form-data`。

### 7.1 POST /api/kb/upload

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/upload` |
| HTTP 方法 | POST（multipart/form-data） |
| 请求参数 | `cby_file`：必填，文件字段，支持 `.txt/.md/.pdf/.doc/.docx/.ppt/.pptx`，≤ 20MB；`cby_name`：选填，知识库显示名，缺省取文件名 |
| 处理流程 | 解析纯文本 → 按约 420 字切分（重叠 60 字）→ 调用 `BAAI/bge-m3` 生成向量 → 写入 `cby_kb_doc`、`cby_kb_chunk`；原文件保存在 `backend/cby_uploads/` |
| 修改时间 | 2026-11-25 14:10:00 |

成功响应示例：

```json
{
  "code": 0,
  "msg": "知识库文件已上传并完成索引",
  "data": {
    "cby_doc_id": 1,
    "cby_name": "课程作品集网站客服知识库",
    "cby_file_name": "课程作品集网站客服知识库.docx",
    "cby_file_type": "docx",
    "cby_char_count": 1862,
    "cby_chunk_count": 6
  }
}
```

### 7.2 GET /api/kb/documents

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/documents` |
| HTTP 方法 | GET |
| 请求参数 | 无 |
| 响应 | `data.cby_total` 文件数；`data.cby_documents` 数组，每项含 `id/name/file_name/file_type/file_size/char_count/chunk_count/status/create_time` |
| 修改时间 | 2026-11-25 14:10:00 |

```json
{
  "code": 0,
  "msg": "知识库文档获取成功",
  "data": {
    "cby_total": 2,
    "cby_documents": [
      { "id": 2, "name": "课程项目介绍", "file_name": "课程项目介绍.pptx", "file_type": "pptx", "file_size": 81244, "char_count": 798, "chunk_count": 3, "status": "ready", "create_time": "2026-11-25 14:06" }
    ]
  }
}
```

### 7.3 DELETE /api/kb/documents/:id

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/documents/:id` |
| HTTP 方法 | DELETE |
| 请求参数 | 路径参数 `id`：知识库文档 ID |
| 响应 | 成功返回被删除的 `cby_doc_id` 与 `cby_name`，同时删除该文档全部片段、向量与磁盘原文件 |
| 修改时间 | 2026-11-25 14:10:00 |

```json
{ "code": 0, "msg": "知识库文档已删除", "data": { "cby_doc_id": 1, "cby_name": "课程作品集网站客服知识库" } }
```

### 7.4 POST /api/kb/ask

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/kb/ask` |
| HTTP 方法 | POST（application/json） |
| 请求参数 | `cby_question`：必填，1–500 字符 |
| 处理流程 | 问题向量化 → 与全部片段计算余弦相似度 → 取前 4 段拼上下文 → 调用文本模型作答并标注来源编号 |
| 成功响应 | `cby_answer` 回答文本；`cby_model`；`cby_usage`；`cby_sources` 命中片段数组（`cby_rank/cby_doc_id/cby_doc_name/cby_chunk_index/cby_score/cby_snippet`） |
| 修改时间 | 2026-11-25 14:10:00 |

```json
{
  "code": 0,
  "msg": "知识库问答成功",
  "data": {
    "cby_answer": "知识库支持的文件格式包括 txt、md、pdf、doc、docx、ppt、pptx，单个文件不超过 20 MB。[3]",
    "cby_model": "Qwen/Qwen2.5-7B-Instruct",
    "cby_usage": { "prompt_tokens": 978, "completion_tokens": 34, "total_tokens": 1012 },
    "cby_sources": [
      { "cby_rank": 1, "cby_doc_id": 1, "cby_doc_name": "课程作品集网站客服知识库", "cby_chunk_index": 3, "cby_score": 0.6048, "cby_snippet": "支持哪些知识库文件格式……" }
    ]
  }
}
```

### 7.5 POST /api/vision

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/vision` |
| HTTP 方法 | POST（multipart/form-data） |
| 请求参数 | `cby_image`：必填，图片字段，支持 `.jpg/.jpeg/.png/.webp/.gif/.bmp`，≤ 20MB |
| 处理流程 | 图片转 base64 data URL → 调用视觉模型（默认 `Qwen/Qwen3-VL-8B-Instruct`）→ 返回中文描述 |
| 响应 | `cby_description` 描述文本；`cby_model`；`cby_usage`；`cby_file_name`；`cby_file_size` |
| 修改时间 | 2026-11-25 14:10:00 |

```json
{
  "code": 0,
  "msg": "图片描述生成成功",
  "data": {
    "cby_description": "这是一幅图书馆自习室的场景……整体氛围宁静、专注。",
    "cby_model": "Qwen/Qwen3-VL-8B-Instruct",
    "cby_usage": { "prompt_tokens": 1588, "completion_tokens": 132, "total_tokens": 1720 },
    "cby_file_name": "cby_gallery_01.png",
    "cby_file_size": 2252600
  }
}
```

### 7.6 POST /api/asr

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/asr` |
| HTTP 方法 | POST（multipart/form-data） |
| 请求参数 | `cby_audio`：必填，音频字段，支持 `.mp3/.wav/.m4a/.webm/.ogg/.flac/.aac/.opus`，≤ 20MB，建议 5 分钟以内 |
| 处理流程 | 转 multipart 转发到七牛云 `https://api.qnaigc.com/v1/audio/transcriptions`，模型标识 `qwen-audio-3.0-asr-flash`（必须全小写，大写会返回 no available channels），超时 120 秒 |
| 响应 | `cby_text` 转写文字；`cby_model`；`cby_file_name`；`cby_file_size`；缺少密钥时 `code = 2` |
| 修改时间 | 2026-11-25 14:10:00 |

```json
{
  "code": 0,
  "msg": "语音识别成功",
  "data": {
    "cby_text": "这是一段语音转写得到的文字。",
    "cby_model": "qwen-audio-3.0-asr-flash",
    "cby_file_name": "demo.mp3",
    "cby_file_size": 204800
  }
}
```

补充说明：`.env` 新增 `SILICONFLOW_EMBEDDING_MODEL`、`SILICONFLOW_VISION_MODEL`、`QINIU_API_KEY`、`QINIU_ASR_BASE_URL`、`QINIU_ASR_MODEL`。后端通过 `console.log('发送给大模型的数据…')` 与 `console.log('接受自大模型的数据…')` 输出与大模型的收发内容（图片 base64 已截断，密钥永不输出）。知识库文件保存在 `backend/cby_uploads/`，需加入 `.gitignore`。

## 记录 8（2026-11-25 14:33:04）：在线客服多平台热切换

### 8.1 POST /api/chat（更新）

| 项目 | 内容 |
| --- | --- |
| 接口路径 | `/api/chat` |
| HTTP 方法 | POST（application/json） |
| 请求参数 | `cby_message`：必填，用户消息，≤ 1000 字；`cby_history`：可选，最近 12 条 `{role, content}`，role 仅 `user`/`assistant`；`cby_platform`：可选，`siliconflow`（默认）或 `qiniu`，非法值自动回落默认平台 |
| 新增配置 | `.env` 新增 `QINIU_CHAT_BASE_URL`、`QINIU_CHAT_MODEL`（默认 `https://api.qnaigc.com/v1`、`qwen/qwen3.8-flash-next`），与 `QINIU_API_KEY` 共用 |
| 处理流程 | `models/cby_chatModel.js` 按平台选择 baseUrl / 模型 / 密钥，调用 `${baseUrl}/chat/completions`（OpenAI 兼容），60 秒超时；系统提示词为「中华美食街在线客服」，只答营业时间、招牌菜、配送范围 |
| 响应 | `cby_reply` 回复文本；`cby_model` 实际模型；`cby_platform` 平台标识；`cby_platform_label` 平台中文名；`cby_usage`；缺少对应密钥时 `code = 2` |

请求示例：

```json
{
  "cby_message": "你们几点关门？",
  "cby_history": [
    { "role": "user", "content": "你们几点营业？" },
    { "role": "assistant", "content": "每天 10:00—22:00 营业。" }
  ],
  "cby_platform": "qiniu"
}
```

响应示例：

```json
{
  "code": 0,
  "msg": "回复生成成功",
  "data": {
    "cby_reply": "您好，美食街每天 22:00 关门，21:30 停止点单；周末与法定节假日延长到 22:30。",
    "cby_model": "qwen/qwen3.8-flash-next",
    "cby_platform": "qiniu",
    "cby_platform_label": "七牛",
    "cby_usage": { "prompt_tokens": 412, "completion_tokens": 46, "total_tokens": 458 }
  }
}
```
