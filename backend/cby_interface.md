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
