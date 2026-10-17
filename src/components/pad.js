/* ===== COMPONENT BẢNG VIẾT IPAD CẢM ỨNG & CHẤM ĐIỂM BAREM (TN2) ===== */

function snap() {
  var c = $('#ipad'); if (!c) return;
  var g = c.getContext('2d');
  PSTK.push(g.getImageData(0, 0, c.width, c.height));
  if (PSTK.length > 20) PSTK.shift();
}

function initPad() {
  var c = $('#ipad'); if (!c) return;
  var g = c.getContext('2d');
  PSTK = []; down = false;
  var pos = function(e) {
    var r = c.getBoundingClientRect();
    return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height];
  };
  c.onpointerdown = function(e) {
    snap(); down = true; c.setPointerCapture(e.pointerId);
    last = pos(e);
    g.globalCompositeOperation = PEN.e ? 'destination-out' : 'source-over';
    g.strokeStyle = PEN.c;
    g.lineWidth = PEN.e ? 28 : PEN.w;
    g.lineCap = 'round'; g.lineJoin = 'round';
  };
  c.onpointermove = function(e) {
    if (!down) return;
    var p = pos(e);
    g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke();
    last = p;
  };
  c.onpointerup = c.onpointercancel = function() {
    down = false;
    PADIMG = c.toDataURL('image/png');
  };
}

function undoPad() {
  var c = $('#ipad');
  if (c && PSTK.length) c.getContext('2d').putImageData(PSTK.pop(), 0, 0);
}

function clearPad() {
  var c = $('#ipad'); if (!c) return;
  snap();
  c.getContext('2d').clearRect(0, 0, c.width, c.height);
  PADIMG = '';
}

function symPad(s) {
  var c = $('#ipad'); if (!c) return;
  var g = c.getContext('2d');
  snap();
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = PEN.c;
  g.font = '700 40px Nunito';
  g.fillText(s, 60 + Math.random() * 360, 100 + Math.random() * 220);
  PADIMG = c.toDataURL('image/png');
}

function loadUp(inp) {
  var f = inp.files[0]; if (!f) return;
  var r = new FileReader();
  r.onload = function() {
    upFile = { mime: f.type || 'image/png', data: r.result.split(',')[1] };
    $('#upname').textContent = 'Đã đính kèm: ' + f.name;
    $('#prev').innerHTML = f.type === 'application/pdf' ? '<div class="p-2 pc bg-[#FFF1B8] text-sm font-bold">📄 Tệp PDF: ' + esc(f.name) + '</div>' : '<img src="' + r.result + '" class="max-h-44 rounded-xl border-2 border-[#2D2A4A]">';
  };
  r.readAsDataURL(f);
}

async function problemPhoto(inp) {
  var f = inp.files[0]; if (!f) return;
  if (!KEY) return toast('Hãy nhập Gemini API Key ở thanh trên cùng để AI đọc chữ trong ảnh nhé 🦉');
  var r = new FileReader();
  r.onload = async function() {
    toast('🦉 Đang đọc đề bài từ ảnh...');
    try {
      var t = await ai([{ role: 'user', parts: [{ text: 'Chép lại chính xác đề bài toán trong ảnh bằng tiếng Việt, công thức viết dạng LaTeX $...$.' }, { inlineData: { mimeType: f.type || 'image/jpeg', data: r.result.split(',')[1] } }] }]);
      var q = M('u' + Date.now(), ST.tch, 'essay', 'Đề chụp ảnh', t.trim(), [], 0, '', '', 'bellcurve_3d', {}, '');
      ST.gen.push(q); ST.tq = q.id; render();
    } catch (e) { toast('Lỗi đọc ảnh: ' + e.message); }
  };
  r.readAsDataURL(f);
}

async function gradeTutor() {
  var all = allQ(), q = all.find(function(x) { return x.id === ST.tq; }) || all[0], el = $('#tres');
  if (!KEY) return toast('Hãy nhập Gemini API Key ở trên để AI Tutor chấm bài nhé 🦉');
  var src = null;
  if (upFile) {
    src = { mimeType: upFile.mime, data: upFile.data };
  } else {
    if (!PSTK.length && !PADIMG) return toast('Bạn hãy viết lời giải lên bảng iPad hoặc tải ảnh/PDF bài làm lên trước nhé ✍️');
    var c = $('#ipad'), t = document.createElement('canvas');
    t.width = c.width; t.height = c.height;
    var tg = t.getContext('2d');
    tg.fillStyle = '#fff';
    tg.fillRect(0, 0, t.width, t.height);
    tg.drawImage(c, 0, 0);
    src = { mimeType: 'image/png', data: t.toDataURL('image/png').split(',')[1] };
  }
  el.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 AI Tutor đang đọc nét chữ trên bảng iPad và đối soát theo Barem 4 tiêu chí...</div>';
  var prompt = 'Đề bài: ' + q.q + '\nBarem điểm chuẩn 4 tiêu chí:\n' + RUBRIC.map(function(r) { return '- ' + r.k + ': ' + r.p + 'đ'; }).join('\n') +
    '\nNGUYÊN TẮC BẮT BUỘC: Bạn là AI Tutor sư phạm. Đọc bài làm viết tay trong ảnh đính kèm. Chấm điểm từng tiêu chí theo Barem (ghi rõ điểm X/10). CHỈ CUNG CẤP CHIẾN LƯỢC GIẢI VÀ ĐẶT CÂU HỎI GỢI MỞ BƯỚC TIẾP THEO, TUYỆT ĐỐI KHÔNG CUNG CẤP LỜI GIẢI HOÀN CHỈNH HAY ĐÁP SỐ. Dùng LaTeX $...$.';
  try {
    var res = await ai([{ role: 'user', parts: [{ text: prompt }, { inlineData: src }] }], 'Bạn là Giáo sư Cú Đêm chấm bài Socratic công tâm.');
    el.innerHTML = '<div class="pc p-4 bg-[#EFFFF8]">' + res.replace(/\n/g, '<br>') + '</div>';
    var sc = scoreOf(res);
    if (sc !== null) {
      recAtt(q, sc >= 5);
      if (sc < 5) logMiss(q, 'essay');
    }
  } catch (e) {
    el.innerHTML = '<div class="pc p-3 bg-[#FFD2D0]">Lỗi: ' + esc(e.message) + '</div>';
  }
  tx();
}
