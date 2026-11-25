/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-20 | 大模型：Claude Opus 6（claude-opus-6）
*/
'use strict';

const cby_canvas = document.getElementById('cby_bgCanvas');
const cby_ctx = cby_canvas ? cby_canvas.getContext('2d') : null;
const cby_reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cby_particles = [];
const cby_linkDistance = 132;
const cby_mouse = { cby_x: -9999, cby_y: -9999 };

/* 画布尺寸适配高分屏 */
const cby_resizeCanvas = () => {
  if (!cby_canvas || !cby_ctx) return;
  const cby_dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cby_w = window.innerWidth;
  const cby_h = window.innerHeight;
  cby_canvas.width = Math.round(cby_w * cby_dpr);
  cby_canvas.height = Math.round(cby_h * cby_dpr);
  cby_canvas.style.width = `${cby_w}px`;
  cby_canvas.style.height = `${cby_h}px`;
  cby_ctx.setTransform(cby_dpr, 0, 0, cby_dpr, 0, 0);
};

/* 生成粒子 */
const cby_createParticles = () => {
  cby_particles.length = 0;
  const cby_count = Math.min(84, Math.max(34, Math.floor(window.innerWidth / 17)));
  for (let cby_i = 0; cby_i < cby_count; cby_i += 1) {
    cby_particles.push({
      cby_x: Math.random() * window.innerWidth,
      cby_y: Math.random() * window.innerHeight,
      cby_vx: (Math.random() - 0.5) * 0.34,
      cby_vy: (Math.random() - 0.5) * 0.34,
      cby_r: Math.random() * 1.8 + 1.1
    });
  }
};

/* 绘制一帧：粒子、连线与鼠标牵引 */
const cby_drawFrame = () => {
  if (!cby_canvas || !cby_ctx) return;
  const cby_w = window.innerWidth;
  const cby_h = window.innerHeight;
  cby_ctx.clearRect(0, 0, cby_w, cby_h);

  for (let cby_i = 0; cby_i < cby_particles.length; cby_i += 1) {
    const cby_p = cby_particles[cby_i];
    cby_p.cby_x += cby_p.cby_vx;
    cby_p.cby_y += cby_p.cby_vy;
    if (cby_p.cby_x < 0 || cby_p.cby_x > cby_w) cby_p.cby_vx *= -1;
    if (cby_p.cby_y < 0 || cby_p.cby_y > cby_h) cby_p.cby_vy *= -1;

    cby_ctx.beginPath();
    cby_ctx.arc(cby_p.cby_x, cby_p.cby_y, cby_p.cby_r, 0, Math.PI * 2);
    cby_ctx.fillStyle = 'rgba(79, 109, 245, 0.42)';
    cby_ctx.fill();

    const cby_mdx = cby_p.cby_x - cby_mouse.cby_x;
    const cby_mdy = cby_p.cby_y - cby_mouse.cby_y;
    const cby_mdist = Math.hypot(cby_mdx, cby_mdy);
    if (cby_mdist < 150) {
      cby_ctx.beginPath();
      cby_ctx.moveTo(cby_p.cby_x, cby_p.cby_y);
      cby_ctx.lineTo(cby_mouse.cby_x, cby_mouse.cby_y);
      cby_ctx.strokeStyle = `rgba(22, 184, 166, ${(0.2 * (1 - cby_mdist / 150)).toFixed(3)})`;
      cby_ctx.lineWidth = 1;
      cby_ctx.stroke();
    }

    for (let cby_j = cby_i + 1; cby_j < cby_particles.length; cby_j += 1) {
      const cby_q = cby_particles[cby_j];
      const cby_dx = cby_p.cby_x - cby_q.cby_x;
      const cby_dy = cby_p.cby_y - cby_q.cby_y;
      const cby_dist = Math.hypot(cby_dx, cby_dy);
      if (cby_dist < cby_linkDistance) {
        cby_ctx.beginPath();
        cby_ctx.moveTo(cby_p.cby_x, cby_p.cby_y);
        cby_ctx.lineTo(cby_q.cby_x, cby_q.cby_y);
        cby_ctx.strokeStyle = `rgba(79, 109, 245, ${(0.16 * (1 - cby_dist / cby_linkDistance)).toFixed(3)})`;
        cby_ctx.lineWidth = 1;
        cby_ctx.stroke();
      }
    }
  }

  if (!cby_reduceMotion) window.requestAnimationFrame(cby_drawFrame);
};

/* 初始化 canvas 背景动画 */
const cby_initCanvas = () => {
  if (!cby_canvas || !cby_ctx) {
    console.error('页面错误信息：未找到 canvas 背景画布');
    return;
  }
  cby_resizeCanvas();
  cby_createParticles();
  cby_drawFrame();

  window.addEventListener('resize', () => {
    cby_resizeCanvas();
    cby_createParticles();
    if (cby_reduceMotion) cby_drawFrame();
  });

  window.addEventListener('pointermove', (cby_event) => {
    cby_mouse.cby_x = cby_event.clientX;
    cby_mouse.cby_y = cby_event.clientY;
  });

  window.addEventListener('pointerleave', () => {
    cby_mouse.cby_x = -9999;
    cby_mouse.cby_y = -9999;
  });
};

/* 统计已完成页面数量（新页面追加超链接后自动更新） */
const cby_initPageCount = () => {
  const cby_countEl = document.getElementById('cby_pageCount');
  const cby_links = document.querySelectorAll('.cby_nav_grid a[href]');
  if (cby_countEl) cby_countEl.textContent = String(cby_links.length);
};

/* 项目类别切换：自选 / 模仿 */
const cby_initCategory = () => {
  const cby_switch = document.getElementById('cby_categorySwitch');
  if (!cby_switch) return;
  cby_switch.addEventListener('click', (cby_event) => {
    const cby_btn = cby_event.target.closest('.cby_category_btn');
    if (!cby_btn) return;
    cby_switch.querySelectorAll('.cby_category_btn').forEach((cby_item) => {
      const cby_active = cby_item === cby_btn;
      cby_item.classList.toggle('cby_is_active', cby_active);
      cby_item.setAttribute('aria-pressed', String(cby_active));
    });
    console.log('项目类别：', cby_btn.dataset.cbyType);
  });
};

/* 请求后端健康检查接口：数据与错误均输出到控制台 */
const cby_loadServerStatus = async () => {
  const cby_statusEl = document.getElementById('cby_serverStatus');
  if (window.location.protocol === 'file:') {
    console.error('服务器错误信息：当前为本地文件预览，请通过 http://localhost:8309 访问以连接后端');
    if (cby_statusEl) cby_statusEl.textContent = '本地预览';
    return;
  }
  try {
    const cby_res = await fetch('/api/health');
    if (!cby_res.ok) throw new Error(`HTTP 状态码 ${cby_res.status}`);
    const cby_json = await cby_res.json();
    console.log('服务器返回的数据：', cby_json);
    if (cby_statusEl) cby_statusEl.textContent = cby_json.code === 0 ? '已连接' : '异常';
  } catch (cby_error) {
    console.error('服务器错误信息：', cby_error);
    if (cby_statusEl) cby_statusEl.textContent = '未连接';
  }
};

cby_initCanvas();
cby_initPageCount();
cby_initCategory();
cby_loadServerStatus();
