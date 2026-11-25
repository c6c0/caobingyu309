<!--
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
-->

# 数据库结构记录

一律追加写入、禁止覆盖已有内容；按执行顺序记录全部 SQL，仅凭本文件即可在新机器的空 MySQL 实例上完整重建数据库。数据库凭据只存于 `backend/.env`（DB_USER / DB_PASSWORD / DB_HOST / DB_NAME），本文件不含任何账号密码。可在 `backend/` 目录执行 `node cby_init_db.js` 自动运行本文件中的全部 SQL。

## 记录 1 · 2026-11-20 · 建库、建表 cby_news、插入 8 条科技新闻测试数据

说明：

- 库名 `ccerwe` 需与 `backend/.env` 的 `DB_NAME` 保持一致。
- 本次开发指令明确指定列名 `id / title / summary / content / source / publish_time / cover_img`，故列名按指令原样保留；`cby_` 前缀约定用于表名、索引名及全部代码命名。
- 下列新闻按真实科技资讯体裁撰写，来源为真实媒体名称，属于课程作业演示用测试数据，用于验证列表展示与发布时间倒序逻辑。
- 在新机器的空库上按顺序执行一次即可；重复执行会重复插入测试数据。

```sql
-- 1. 建库（库名与 backend/.env 的 DB_NAME 一致）
CREATE DATABASE IF NOT EXISTS ccerwe DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ccerwe;

-- 2. 建表 cby_news（索引按 cby_ 前缀命名）
CREATE TABLE IF NOT EXISTS cby_news (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻主键',
  `title` VARCHAR(120) NOT NULL COMMENT '新闻标题',
  `summary` VARCHAR(255) NOT NULL COMMENT '新闻摘要',
  `content` TEXT NOT NULL COMMENT '新闻正文',
  `source` VARCHAR(60) NOT NULL COMMENT '新闻来源',
  `publish_time` DATETIME NOT NULL COMMENT '发布时间',
  `cover_img` VARCHAR(160) DEFAULT NULL COMMENT '封面图相对路径',
  PRIMARY KEY (`id`),
  KEY `idx_cby_news_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科技新闻表';

-- 3. 插入 8 条科技新闻测试数据（发布时间覆盖 2026-11-10 至 2026-11-19，便于验证倒序）
INSERT INTO cby_news (`title`, `summary`, `content`, `source`, `publish_time`, `cover_img`) VALUES
('国产业级算力集群投入使用，万卡规模支撑大模型训练', '首个全国产化万卡算力集群在贵州数据中心正式投运，面向大模型训练与推理提供弹性算力。', '该集群采用国产加速卡与自研互联协议，配套液冷散热与统一调度平台。运营方表示，集群将优先服务高校和科研机构的开源大模型训练任务，并按算力用量向中小企业开放，降低算法团队自建机房的门槛。', '科技日报', '2026-11-19 09:20:00', 'images/cby_news_01.svg'),
('6G 城市级外场试验完成，空天地一体化网络进入验证阶段', 'IMT-2030 推进组公布 6G 外场试验结果，在城区连续覆盖场景下完成峰值速率与低时延联合验证。', '试验网络覆盖城市核心区与近郊，结合低轨卫星回传与地面基站协同组网。测试组重点评估了高频段在复杂遮挡环境下的链路稳定性，并同步验证了通感一体、算力调度等候选关键技术的可行性。', '人民邮电报', '2026-11-18 14:35:00', 'images/cby_news_02.svg'),
('超导量子处理器实现 512 比特逻辑纠错验证', '科研团队公布新一代超导量子芯片，通过表面码方案把逻辑比特错误率压低到可工程化区间。', '研究团队在稀释制冷环境中完成了多轮随机基准测试，结果显示逻辑错误率随码距增加呈稳定下降。同期开放的云端调用接口允许高校提交小规模量子线路任务，为后续算法验证提供公共平台。', '中国科学报', '2026-11-17 10:05:00', 'images/cby_news_03.svg'),
('开源操作系统发布长期支持版本，多终端适配能力增强', '新 LTS 版本统一内核抽象层，面向平板、车机与工业终端提供一致的开发接口，维护周期延长至五年。', '本次更新重构了设备驱动框架，将硬件差异收敛到统一抽象层，应用一次编译即可跨终端部署。社区同时公布兼容性测试清单与迁移工具，帮助现有项目平滑升级，并承诺持续提供安全补丁。', 'IT之家', '2026-11-16 08:50:00', 'images/cby_news_04.svg'),
('全固态电池中试线投产，能量密度指标刷新行业纪录', '长三角中试基地完成硫化物电解质产线调试，样品能量密度与循环寿命达到车规级验证门槛。', '产线采用干法电极工艺，减少溶剂使用并缩短烘烤环节。第三方检测报告显示，样品在常温循环与高温存储测试中的容量保持率优于上一代液态方案，后续将进入装车验证阶段。', '第一财经', '2026-11-15 11:30:00', 'images/cby_news_05.svg'),
('低轨卫星互联网完成普通手机直连通话演示', '用户无需外接终端即可通过低轨卫星完成语音与短消息业务，为偏远地区网络覆盖提供新方案。', '演示在山地与近海两类场景下进行，手机仅通过系统更新即可接入卫星网络。工程团队重点解决了多普勒频移补偿与低功耗驻留问题，后续将扩大星座规模以提升并发容量。', '新华社', '2026-11-13 16:40:00', 'images/cby_news_06.svg'),
('国产先进制程工艺完成流片验证，良率数据首次公开', '国内晶圆厂公布新一代逻辑工艺流片结果，配套 EDA 工具与关键设备国产化率同步提升。', '流片覆盖低功耗与高性能两类工艺角，测试芯片已通过基础功能与可靠性抽检。厂方表示，下一步将围绕良率爬坡与工艺库完善展开工作，并与设计企业共建 IP 生态。', '半导体行业观察', '2026-11-12 09:15:00', 'images/cby_news_07.svg'),
('植入式脑机接口进入多中心临床试验阶段', '多家三甲医院联合启动临床研究，重点评估运动功能重建场景下的长期安全性与信号稳定性。', '试验方案已通过伦理审查，首批受试者将接受长期随访。研究团队采用柔性电极与无线供电设计，目标是在降低植入创伤的同时，保持数月以上的高质量神经信号采集能力。', '澎湃新闻', '2026-11-10 13:25:00', 'images/cby_news_08.svg');
```

## 记录 2 · 2026-11-20 · 建表 cby_gallery、插入 8 条图文测试数据

说明：

- 本次开发指令明确指定列名 `id / title / description / img_url / category / create_time`，故列名按指令原样保留，与记录 1 的取舍一致；`cby_` 前缀用于表名、索引名及全部代码命名。
- `img_url` 一律为 `frontend/images/` 下的本地相对路径，不使用任何外链或 CDN。
- 第 8 条的 `images/cby_gallery_08.svg` 故意不生成对应文件，用于验证「图片加载失败显示占位色块、不出现破图图标」；其余 7 条图片由本地 SVG 提供。
- 本记录在记录 1 之后执行；`USE ccerwe` 重复出现不影响结果，便于单独复制本段 SQL 执行。

```sql
-- 1. 切换到目标库（库名需与 backend/.env 的 DB_NAME 一致）
USE ccerwe;

-- 2. 建表 cby_gallery（索引按 cby_ 前缀命名）
CREATE TABLE IF NOT EXISTS cby_gallery (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文主键',
  `title` VARCHAR(120) NOT NULL COMMENT '图文标题',
  `description` VARCHAR(255) NOT NULL COMMENT '图文描述',
  `img_url` VARCHAR(160) DEFAULT NULL COMMENT '图片相对路径',
  `category` VARCHAR(40) NOT NULL COMMENT '图文分类',
  `create_time` DATETIME NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_cby_gallery_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='图文列表表';

-- 3. 插入 8 条图文测试数据（图片均为本地相对路径）
INSERT INTO cby_gallery (`title`, `description`, `img_url`, `category`, `create_time`) VALUES
('晨光里的图书馆', '清晨第一缕阳光穿过玻璃幕墙，落在自习区的木质长桌上，书页与光影构成安静的阅读角落。', 'images/cby_gallery_01.svg', '校园建筑', '2026-11-19 09:10:00'),
('城市天际线夜景', '从滨江观景平台远眺，写字楼灯光与江面倒影连成一片，长曝光记录下班高峰后的城市呼吸。', 'images/cby_gallery_02.svg', '城市风光', '2026-11-18 20:15:00'),
('芯片实验室微距', '微距镜头下的晶圆切片呈现规则电路纹理，测试探针悬停在焊盘上方，等待下一轮电性抽检。', 'images/cby_gallery_03.svg', '科技数码', '2026-11-17 14:40:00'),
('秋日银杏道', '校园老路两旁的银杏进入最佳观赏期，落叶铺成金色步道，逆光下叶脉清晰可见。', 'images/cby_gallery_04.svg', '自然风光', '2026-11-16 10:25:00'),
('高铁站台晨雾', '首班车进站前，薄雾笼罩站台，指示灯与轨道线条在冷色调里延伸，画面干净而有秩序。', 'images/cby_gallery_05.svg', '交通出行', '2026-11-15 07:05:00'),
('陶瓷手作工作台', '拉坯机旁摆着未上釉的素坯与各式修坯刀，记录传统手工艺从泥团到成型的中间状态。', 'images/cby_gallery_06.svg', '人文艺术', '2026-11-13 15:30:00'),
('一碗热汤面', '冬日食堂的热汤面，蒸汽在镜头前凝成柔光，配菜与汤色保留原本的生活气息。', 'images/cby_gallery_07.svg', '生活美食', '2026-11-12 12:20:00'),
('山间星空长曝光', '远离城市光污染的观测点，长曝光记录星轨与山脊轮廓；本条图片资源缺失，用于演示页面占位色块降级。', 'images/cby_gallery_08.svg', '自然风光', '2026-11-10 22:45:00');
```

## 记录 3 · 2026-11-20 · 更新 cby_gallery 的 8 条 img_url 为本地生成实景图

说明：

- 为 8 条图文数据逐条生成贴合场景的写实配图，保存为 `frontend/images/cby_gallery_01.png` ~ `cby_gallery_08.png`（1536×1024，均为本地文件，不使用任何外链或 CDN）。
- 记录 2 中第 8 条曾故意指向不存在的 `.svg` 用于演示占位降级；本次已补齐该图片。前端的图片失败降级逻辑仍保留为容错机制（图片缺失或 URL 为空时自动显示占位色块），代码未改动。
- 使用 `title` 定位而非 `id`，避免不同机器上 AUTO_INCREMENT 起点差异导致更新错位。
- 本记录在记录 1、2 之后执行：新机器全量重建时先 INSERT（`.svg` 路径），再执行本段 UPDATE，最终 `img_url` 为 `.png`，结果一致。

```sql
USE ccerwe;

UPDATE cby_gallery SET img_url = 'images/cby_gallery_01.png' WHERE title = '晨光里的图书馆';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_02.png' WHERE title = '城市天际线夜景';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_03.png' WHERE title = '芯片实验室微距';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_04.png' WHERE title = '秋日银杏道';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_05.png' WHERE title = '高铁站台晨雾';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_06.png' WHERE title = '陶瓷手作工作台';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_07.png' WHERE title = '一碗热汤面';
UPDATE cby_gallery SET img_url = 'images/cby_gallery_08.png' WHERE title = '山间星空长曝光';
```

## 记录 4 · 2026-11-25 · 新建知识库表 cby_kb_doc、cby_kb_chunk（RAG）

说明：

- `cby_kb_doc` 保存知识库文件元数据（文件名、类型、大小、字符数、片段数、服务器保存路径）。
- `cby_kb_chunk` 保存文本片段与向量；`embedding` 为硅基流动 `BAAI/bge-m3` 返回的浮点数组，以 JSON 字符串存入 `LONGTEXT`，检索时在 Node 中计算余弦相似度。
- 两表数据由「知识库文件上传」接口自动写入：上传 `backend/cby_kb_samples/` 下的 2 个示例文件后，`cby_kb_doc` 有 2 条记录，`cby_kb_chunk` 自动生成 8 条以上片段（满足每表 ≥ 8 条测试数据的要求）。向量无法在 SQL 中静态重放，因此新机器重建时执行本段建表 SQL 后，在知识库页面重新上传这 2 个示例文件即可恢复全部数据。
- 本机增量执行：`node cby_init_db.js latest`。

```sql
USE ccerwe;

CREATE TABLE IF NOT EXISTS cby_kb_doc (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '知识库文档主键',
  name VARCHAR(150) NOT NULL COMMENT '知识库显示名称',
  file_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
  file_type VARCHAR(16) NOT NULL COMMENT '扩展名，如 docx/pptx/pdf',
  file_size INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件字节数',
  stored_path VARCHAR(255) NOT NULL COMMENT '服务器保存路径（相对 backend）',
  char_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '解析出的字符数',
  chunk_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '切分出的片段数',
  status VARCHAR(16) NOT NULL DEFAULT 'ready' COMMENT '索引状态',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文档表（RAG）';

CREATE TABLE IF NOT EXISTS cby_kb_chunk (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '片段主键',
  doc_id INT UNSIGNED NOT NULL COMMENT '所属文档 ID',
  chunk_index INT UNSIGNED NOT NULL COMMENT '片段在文档中的序号',
  content TEXT NOT NULL COMMENT '片段文本',
  embedding LONGTEXT NOT NULL COMMENT '向量（JSON 浮点数组）',
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (id),
  KEY cby_idx_kb_chunk_doc (doc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库片段与向量表（RAG）';
```
