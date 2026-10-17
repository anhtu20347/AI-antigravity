/* ===== DỊCH VỤ TRÍ TUỆ NHÂN TẠO GOOGLE GEMINI (AI ENGINE) ===== */

function saveKey() {
  KEY = $('#key').value.trim();
  MODEL = $('#model').value.trim() || 'gemini-2.5-flash';
  ls.set('cfg', { k: KEY, m: MODEL });
  toast(KEY ? 'Đã lưu Key rồi nhé! 🦉' : 'Đã xoá Key – dùng dữ liệu mẫu nha 🦉');
}

async function callGeminiOnce(modelName, contents, sys) {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(modelName) + ':generateContent?key=' + encodeURIComponent(KEY);
  var r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sys || 'Bạn là trợ giảng Xác suất Thống kê Socratic.' }] },
      contents: contents
    })
  });
  var j = await r.json();
  if (!r.ok) {
    var msg = (j.error && j.error.message) ? j.error.message : ('HTTP ' + r.status);
    throw new Error(msg);
  }
  var parts = (j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || [];
  return parts.map(function(p) { return p.text || ''; }).join('');
}

async function ai(contents, sys) {
  if (!KEY) throw new Error('nokey');
  if (typeof contents === 'string') contents = [{ role: 'user', parts: [{ text: contents }] }];
  var candidates = [MODEL, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  var tried = {}, lastErr = null;
  for (var i = 0; i < candidates.length; i++) {
    var m = candidates[i];
    if (!m || tried[m]) continue;
    tried[m] = true;
    try {
      var res = await callGeminiOnce(m, contents, sys);
      if (m !== MODEL) {
        MODEL = m;
        if ($('#model')) $('#model').value = m;
        ls.set('cfg', { k: KEY, m: MODEL });
      }
      return res;
    } catch (e) {
      lastErr = e;
      var match = String(e.message).match(/models\/(gemini-[a-z0-9.-]+)/i);
      if (match && match[1] && !tried[match[1]]) candidates.splice(i + 1, 0, match[1]);
    }
  }
  throw lastErr || new Error('Không thể kết nối Gemini API');
}

function safeJSON(t) {
  t = String(t).replace(/```json|```/g, '').trim();
  var a = t.indexOf('['), b = t.lastIndexOf(']');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch (e) {}
  try { return JSON.parse(t.replace(/\\(?![/bfnrtu"\\])/g, '\\\\')); } catch (e2) {}
  var items = [], re = /\{[^{}]*\}/g, m;
  while ((m = re.exec(t)) !== null) {
    try { items.push(JSON.parse(m[0])); } catch (e3) {
      try { items.push(JSON.parse(m[0].replace(/\\(?![/bfnrtu"\\])/g, '\\\\'))); } catch (e4) {}
    }
  }
  if (items.length) return items;
  throw new Error('Dữ liệu AI trả về chưa đúng chuẩn JSON');
}

function normQ(o, i, def) {
  var ch = Number(o.ch) || Number(def.ch) || 1;
  var viz = o.visual3DType || o.viz || VIZ_LIST[(ch + i) % VIZ_LIST.length];
  return {
    id: 'g' + Date.now() + '_' + i,
    ch: ch,
    type: o.type === 'essay' ? 'essay' : 'mcq',
    lv: o.lv || def.lv || 'Vận dụng',
    q: o.q || 'Bài toán xác suất thống kê',
    opts: (o.opts && o.opts.length >= 4) ? o.opts : ['0,15', '0,25', '0,50', '0,75'],
    ans: Number(o.ans) || 0,
    hint: o.hint || 'Xác định công thức trọng tâm của chương và thay số.',
    sol: o.sol || 'Áp dụng công thức chuẩn của chương để tính ra kết quả.',
    viz: viz,
    vp: o.vp || { label: 'Mô phỏng Chương ' + ch },
    m: o.m || ('Dạng toán;Chương ' + ch + '|Dữ kiện;Theo đề bài|Công thức;Áp dụng công thức chương ' + ch + '|Bước giải;Thay số và kiểm tra điều kiện')
  };
}

async function genAI(def, n) {
  var prompt = 'Tạo ' + n + ' bài toán Xác suất & Thống kê thực tế bằng tiếng Việt cho Chương ' + (def.ch || '1-7') +
    ', hình thức ' + (def.type === 'essay' ? 'tự luận' : 'trắc nghiệm 4 đáp án') +
    ', độ khó ' + (def.lv || 'Vận dụng') + '.' + (def.note ? ' Bối cảnh: ' + def.note + '.' : '') +
    ' Trả về DUY NHẤT mảng JSON hợp lệ, không markdown. Công thức dùng $...$ và viết 2 dấu gạch chéo ngược (\\\\frac). ' +
    'Mỗi phần tử có dạng: {"ch":' + (def.ch || 1) + ',"type":"' + (def.type === 'essay' ? 'essay' : 'mcq') + '","lv":"' + (def.lv || 'Vận dụng') + '","q":"đề bài ngắn gọn thực tế","opts":["A","B","C","D"],"ans":0,"hint":"gợi ý","sol":"lời giải","visual3DType":"factory_3d|dice_3d|bellcurve_3d|medical_3d|finance_3d|queue_3d|sampling_3d|abtest_3d|dice_cards_3d","vp":{"label":"tên mô hình"},"m":"Dạng toán;..|Dữ kiện;..|Công thức;..|Bước giải;.."}';
  var raw = await ai(prompt, 'Bạn là Cú Đêm, chuyên gia ra đề Xác suất Thống kê. Luôn trả về JSON mảng hợp lệ.');
  var arr = safeJSON(raw);
  return arr.map(function(o, i) { return normQ(o, i, def); });
}
