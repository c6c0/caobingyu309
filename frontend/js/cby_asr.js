/*
姓名：曹炳宇 | 学号：24002120309 |
时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
*/
/* 语音识别：上传或录音 → 调用 POST /api/asr 获取转写文字 */
(() => {
  'use strict';

  const cby_allowedExts = ['.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac', '.aac', '.opus'];
  let cby_file = null;
  let cby_busy = false;
  let cby_objectUrl = '';
  let cby_transcript = '';

  let cby_recorder = null;
  let cby_recordChunks = [];
  let cby_recordStream = null;
  let cby_recording = false;

  const cby_el = (cby_id) => document.getElementById(cby_id);
  const cby_drop = cby_el('cby_audioDrop');
  const cby_input = cby_el('cby_audioInput');
  const cby_player = cby_el('cby_audioPlayer');
  const cby_audioName = cby_el('cby_audioName');
  const cby_recordBtn = cby_el('cby_recordBtn');
  const cby_recordHint = cby_el('cby_recordHint');
  const cby_transcribeBtn = cby_el('cby_transcribeBtn');
  const cby_audioHint = cby_el('cby_audioHint');
  const cby_result = cby_el('cby_asrResult');
  const cby_meta = cby_el('cby_asrMeta');
  const cby_copyBtn = cby_el('cby_copyBtn');
  const cby_status = cby_el('cby_asrStatus');
  const cby_apiUrl = cby_el('cby_asrApiUrl');

  const cby_setAudioHint = (cby_text, cby_kind) => {
    cby_audioHint.textContent = cby_text;
    cby_audioHint.className = `cby_status_line${cby_kind ? ` ${cby_kind}` : ''}`;
  };

  const cby_setStatus = (cby_text, cby_kind) => {
    cby_status.textContent = cby_text;
    cby_status.className = `cby_ai_api_hint${cby_kind ? ` ${cby_kind}` : ''}`;
  };

  const cby_applyFile = (cby_selected) => {
    const cby_ext = cby_selected.name.slice(cby_selected.name.lastIndexOf('.')).toLowerCase();
    if (!cby_allowedExts.includes(cby_ext)) {
      cby_setAudioHint(`不支持的音频格式 ${cby_ext}`, 'cby_is_error');
      return;
    }
    if (cby_selected.size > 20 * 1024 * 1024) {
      cby_setAudioHint('音频超过 20MB，请压缩或截取后再上传', 'cby_is_error');
      return;
    }

    cby_file = cby_selected;
    if (cby_objectUrl) URL.revokeObjectURL(cby_objectUrl);
    cby_objectUrl = URL.createObjectURL(cby_selected);
    cby_player.src = cby_objectUrl;
    cby_player.hidden = false;

    cby_audioName.textContent = `当前音频：${cby_selected.name}（${(cby_selected.size / 1024).toFixed(0)} KB）`;
    cby_transcribeBtn.disabled = false;
    cby_setAudioHint('音频已就绪，点击「开始识别」', '');
    cby_setStatus('等待识别', '');
  };

  /* 录音：MediaRecorder，停止后自动作为待识别文件 */
  const cby_startRecord = async () => {
    if (!navigator.mediaDevices || typeof window.MediaRecorder === 'undefined') {
      cby_recordHint.textContent = '当前浏览器不支持录音，请直接上传音频文件';
      cby_recordHint.className = 'cby_status_line cby_is_error';
      return;
    }

    try {
      cby_recordStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      cby_recordChunks = [];
      cby_recorder = new MediaRecorder(cby_recordStream);

      cby_recorder.addEventListener('dataavailable', (cby_event) => {
        if (cby_event.data && cby_event.data.size > 0) cby_recordChunks.push(cby_event.data);
      });

      cby_recorder.addEventListener('stop', () => {
        const cby_blob = new Blob(cby_recordChunks, { type: cby_recorder.mimeType || 'audio/webm' });
        const cby_recorded = new File([cby_blob], `cby_record_${Date.now()}.webm`, { type: cby_blob.type });
        cby_applyFile(cby_recorded);
        cby_recordHint.textContent = '录音完成，可以点击「开始识别」';
        cby_recordHint.className = 'cby_status_line cby_is_ok';
      });

      cby_recorder.start();
      cby_recording = true;
      cby_recordBtn.textContent = '停止录音';
      cby_recordHint.textContent = '正在录音…再次点击停止';
      cby_recordHint.className = 'cby_status_line';
    } catch (cby_error) {
      console.error('浏览器错误信息：无法获取麦克风', cby_error);
      cby_recordHint.textContent = '无法使用麦克风，请检查浏览器权限或改用上传文件';
      cby_recordHint.className = 'cby_status_line cby_is_error';
    }
  };

  const cby_stopRecord = () => {
    if (cby_recorder && cby_recorder.state !== 'inactive') cby_recorder.stop();
    if (cby_recordStream) {
      cby_recordStream.getTracks().forEach((cby_track) => cby_track.stop());
      cby_recordStream = null;
    }
    cby_recording = false;
    cby_recordBtn.textContent = '开始录音';
  };

  const cby_transcribe = async () => {
    if (!cby_file || cby_busy) return;

    cby_busy = true;
    cby_transcribeBtn.disabled = true;
    cby_setAudioHint('正在调用七牛语音识别模型，请稍候…', '');
    cby_setStatus('识别中…', '');
    cby_result.textContent = '识别中，请稍候…';
    cby_meta.textContent = '';

    const cby_form = new FormData();
    cby_form.append('cby_audio', cby_file);

    try {
      const cby_res = await fetch('/api/asr', { method: 'POST', body: cby_form });
      const cby_json = await cby_res.json();
      console.log('语音识别返回的数据：', cby_json);

      if (cby_json.code !== 0) {
        cby_setStatus(cby_json.code === 2 ? '未配置密钥' : '识别失败', 'cby_is_error');
        cby_setAudioHint(cby_json.msg || '识别失败', 'cby_is_error');
        cby_result.textContent = cby_json.msg || '识别失败，请稍后重试';
        return;
      }

      const cby_data = cby_json.data || {};
      cby_transcript = cby_data.cby_text || '';
      cby_result.textContent = cby_transcript || '（没有识别出文字）';
      cby_copyBtn.disabled = !cby_transcript;
      cby_meta.textContent = `文件：${cby_data.cby_file_name || cby_file.name} · 模型：${cby_data.cby_model || 'Qwen-Audio-3.0-ASR-Flash'} · 字数：${cby_transcript.length}`;
      cby_setStatus('识别成功', 'cby_is_ok');
      cby_setAudioHint('识别完成，可以更换音频继续识别', 'cby_is_ok');
    } catch (cby_error) {
      console.error('服务器错误信息：语音识别失败', cby_error);
      cby_setStatus('请求失败', 'cby_is_error');
      cby_setAudioHint(`识别失败：${cby_error.message}`, 'cby_is_error');
      cby_result.textContent = `识别失败：${cby_error.message}`;
    } finally {
      cby_busy = false;
      cby_transcribeBtn.disabled = false;
    }
  };

  const cby_copy = async () => {
    if (!cby_transcript) return;
    try {
      await navigator.clipboard.writeText(cby_transcript);
      cby_copyBtn.textContent = '已复制';
      window.setTimeout(() => { cby_copyBtn.textContent = '复制文字'; }, 1600);
    } catch (cby_error) {
      console.error('浏览器错误信息：复制失败', cby_error);
      cby_setAudioHint('复制失败，请手动选中文字复制', 'cby_is_error');
    }
  };

  const cby_init = () => {
    if (!cby_input) return;
    if (window.location.origin && window.location.origin !== 'null') {
      cby_apiUrl.textContent = `${window.location.origin}/api/asr`;
    }

    cby_drop.addEventListener('click', (cby_event) => {
      if (cby_event.target.tagName !== 'INPUT') cby_input.click();
    });

    cby_input.addEventListener('change', () => {
      if (cby_input.files && cby_input.files[0]) cby_applyFile(cby_input.files[0]);
    });

    ['dragenter', 'dragover'].forEach((cby_type) => {
      cby_drop.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_drop.classList.add('cby_is_drag');
      });
    });

    ['dragleave', 'drop'].forEach((cby_type) => {
      cby_drop.addEventListener(cby_type, (cby_event) => {
        cby_event.preventDefault();
        cby_drop.classList.remove('cby_is_drag');
      });
    });

    cby_drop.addEventListener('drop', (cby_event) => {
      const cby_files = cby_event.dataTransfer && cby_event.dataTransfer.files;
      if (cby_files && cby_files[0]) cby_applyFile(cby_files[0]);
    });

    cby_recordBtn.addEventListener('click', () => {
      if (cby_recording) cby_stopRecord();
      else cby_startRecord();
    });

    cby_transcribeBtn.addEventListener('click', cby_transcribe);
    cby_copyBtn.addEventListener('click', cby_copy);
  };

  cby_init();
})();
