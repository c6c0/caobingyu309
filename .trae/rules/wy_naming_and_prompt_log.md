## 命名前缀规则 <MUST_ALWAYS_FOLLOW>

本工作区内所有前端代码必须遵守以下命名约定：

- **CSS 类名**：以 `wy_` 开头，例如 `wy_container`、`wy_btn_primary`
- **CSS id**：以 `wy_` 开头，例如 `wy_header`、`wy_main_content`
- **JavaScript 变量、函数、常量**：以 `wy_` 开头，例如 `wy_userName`、`wy_fetchData()`、`wy_MAX_COUNT`
- HTML 标签内引用的 class/id 同样遵守此规则

例外情况：第三方库自动生成的类名（如 Bootstrap、Tailwind）不受此约束，但自定义覆盖样式仍需 `wy_` 前缀。

## 提示词日志规则 <MUST_ALWAYS_FOLLOW>

在执行任何需要生成或编写代码的提示词之前，必须先将该提示词以**追加**方式写入 `cby_prompt.md`（位于工作区根目录 `d:\WEB前端设计\cby_prompt.md`），禁止覆盖已有内容。

每次追加的条目格式如下：

```
====================
时间：YYYY-MM-DD HH:mm:ss
模型：（当前使用的模型名称）
----------------------
提示词内容：
（完整的用户提示词或生成性指令，保留原文）
====================
```

### 执行顺序

1. 收到用户请求 → 整理出本次的提示词内容
2. 追加写入 `cby_prompt.md`
3. 再执行具体的编码/生成任务

### 模型名称

在本会话中使用固定值 `Trae-CN-Proprietary` 填写。

## 首页超链接规则 <MUST_ALWAYS_FOLLOW>

每次新建 HTML 文件时，必须同时完成以下两件事：

1. **在新文件内**：加入返回首页 `index.html` 的超链接（通常放在页面顶部导航或底部）
2. **在首页 `index.html` 内**：添加指向这个新文件的超链接入口，使首页能导航到所有子页面

### 链接规范

- 使用 `<a href="...">` 标签
- 链接文字使用清晰的中文页面名
- class/id 同样遵守 `wy_` 前缀规则，例如 `wy_nav_link`、`wy_back_home`
- 如果首页尚不存在，先创建最小化的 `index.html` 骨架（含导航列表）再继续
