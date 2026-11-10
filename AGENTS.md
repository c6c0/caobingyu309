# AGENTS.md

Coursework workspace for 高级网页设计: plain HTML/CSS/JS, no build system and no framework. The workspace root is **not** a git repo. `web-c/` is a separate clone of Gitee `neusoft_wangyao_jsj/web-c` (`web-c.git`); coursework submissions go to `neusoft_wangyao_jsj/cby.git` via `skills/提交项目/SKILL.md`.

## Must-follow project rules
Authoritative source: `.trae/rules/wy_naming_and_prompt_log.md` (overrides stale subproject READMEs).
- Prefix every custom CSS class/id and JS variable/function/constant with `wy_` (`wy_container`, `wy_fetchData`). Third-party generated classes are exempt.
- Before writing or generating code, **append** the user prompt to `cby_prompt.md` (never overwrite) using its existing time / model / prompt block format.
- When adding an HTML page: link back to the root `index.html` from the new page, and add an entry to the root `index.html` (currently `iconfont-1..4`).
- When creating a new HTML file, put a header comment right after `<!DOCTYPE html>` containing the author, creation time, model used, and the page's function name:

  ```html
  <!--
    作者：曹炳宇
    建立时间：YYYY-MM-DD HH:mm
    使用大模型：（本次使用的模型名）
    功能名称：（页面功能简述）
  -->
  ```

- Every JS function must have a comment line above it describing its main functionality:

  ```js
  // 功能：简要说明该函数主要实现什么
  function wy_doSomething() { ... }
  ```

- `hanglv_app/README.md` says prefix `cao_`; that conflicts with the workspace rule — use `wy_`.
- Coursework code is vanilla HTML/CSS/JS. Download CDN assets into `cdn/` instead of hotlinking (see `cby_prompt.md`).

## Layout
- Root `index.html` = hub. Top-level `iconfont-1.html`, `inconfont-2.html`, `iconfont-3.html`, `iconfont-4.html` are exercises; `cdn/`, `font/` hold local assets.
- `hanglv_app/` = 8-page 航旅纵横 clone (final assignment), fetches mock JSON from `data/`.
- `web-c/高级网页设计/` = older exercise pages inside the web-c clone.

## Toolchain (nothing usable is on PATH)
`python`, `node`, and `git` resolve to missing commands or a non-working Store stub. Use absolute paths:
- Git 2.55: `D:\WEB前端设计\web-c\高级网页设计\Git\cmd\git.exe`
- Node 24.21: `D:\WEB前端设计\web-c\node.exe`; npm 11.19: `& 'D:\WEB前端设计\web-c\node.exe' 'D:\WEB前端设计\node_modules\npm\bin\npm-cli.js' <cmd>` (root `npm.cmd` falls back to PATH and fails)
- Python 3.8: `D:\新建文件夹 (2)\anaconda3\python.exe` (or `D:\SPSS\Python3\python.exe`)

Preview pages that use `fetch` (e.g. `hanglv_app`) with a local server; never double-click HTML:
`& 'D:\新建文件夹 (2)\anaconda3\python.exe' -m http.server 8080`

PowerShell 5.1: `&&` is unsupported — use `;` or `if ($?)`. Use `-LiteralPath` for Chinese/space paths. Console mojibake is only a display/codepage issue; files are UTF-8, so do not rewrite them to "fix" encoding.

## Git / submission gotchas
- The root has **no `.gitignore`**. Before committing, create one that excludes `Trae CN/` (~1.6 GB), `node_modules/`, the whole `web-c/` (nested clone), installers (`*.exe`), and `web-c/高级网页设计/Git/`. Never `git add -A` blindly.
- `web-c/` has its own `.git` and remote; it must not be nested in the `cby` repo.
- The Gitee token is stored in plaintext in `skills/提交项目/SKILL.md` and `cby_prompt.md`. Never print, copy, or add it to new files. Rotate it if the repo becomes public.
- Commit messages are Chinese; check `git --no-pager log --oneline -5` and follow the existing style.
