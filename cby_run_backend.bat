@echo off
chcp 65001 >nul
REM "姓名：曹炳宇 | 学号：24002120309 |"
REM "时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）"
REM "作用：一键启动课程作业后端服务，端口 8309"
REM "用法：双击运行，Ctrl+C 停止服务，传入 check 参数仅自检不启动"
REM "编码：UTF-8 无 BOM 加 CRLF，chcp 65001 保证中文日志不乱码"
REM "启动命令：npm start，对应 package.json 的 start 脚本 node app.js"
setlocal

cd /d "%~dp0backend"
if errorlevel 1 (
  echo [错误] 未找到 backend 目录，请确认本脚本放在项目根目录。
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 npm，请先安装 Node.js 并配置 PATH。
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\express" (
  echo [提示] 依赖尚未安装，正在按 package.json 安装...
  if not exist ".npmrc" call npm config set registry https://registry.npmmirror.com --location=project
  call npm install
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请检查网络或 npm 镜像设置。
    echo.
    pause
    exit /b 1
  )
)

echo [提示] 后端服务地址： http://localhost:8309/
echo [提示] 首页地址：     http://localhost:8309/index.html
echo [提示] 健康检查：     http://localhost:8309/api/health
echo [提示] 启动命令：     npm start

if /i "%~1"=="check" (
  echo [自检] 环境检查通过，未启动服务；去掉 check 参数即可启动。
  echo.
  pause
  exit /b 0
)

echo [提示] 正在启动，按 Ctrl+C 可停止服务。
call npm start
if errorlevel 1 (
  echo [错误] 服务启动或运行失败，请查看上方日志排查。
  echo.
  pause
  exit /b 1
)

echo.
echo [提示] 服务已停止。
pause
