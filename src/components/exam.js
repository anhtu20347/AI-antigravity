/* ===== COMPONENT ĐẤU TRƯỜNG THI THỬ BẤM GIỜ & TỰ ĐỘNG CHẤM ĐIỂM ===== */

function cfgExam(a) {
  var c = ST.cfg;
  var btn = function(k, v, l) { return '<button class="bt ' + (c[k] === v ? 'on' : '') + '" onclick="ST.cfg.' + k + '=' + JSON.stringify(v) + ';render()">' + l + '</button>'; };
  a.innerHTML = '<div class="pc p-5"><h2 class="text-2xl font-black">⏰ Đấu Trường Thi Thử Bấm Giờ</h2>' +
    '<p class="font-bold mt-3">1. Chọn phạm vi kiến thức:</p><div class="flex flex-wrap gap-2 mt-1">' +
    btn('scope', 'all', 'Tổng hợp 7 chương') +
    CH.map(function(_, i) { return btn('scope', i + 1, 'Chương ' + (i + 1)); }).join('') + '</div>' +
    '<p class="font-bold mt-3">2. Số lượng câu hỏi:</p><div class="flex gap-2 mt-1">' +
    [5, 10, 15, 20].map(function(n) { return btn('n', n, n + ' câu'); }).join('') + '</div>' +
    '<p class="font-bold mt-3">3. Thời gian làm bài:</p><div class="flex gap-2 mt-1">' +
    [10, 15, 30, 45].map(function(m) { return btn('min', m, m + ' phút'); }).join('') + '</div>' +
    '<div class="flex flex-wrap gap-3 mt-5">' +
    '<button class="bt bg-[#BFF1DC]" onclick="startEx(false)">📚 Bắt đầu Thi Thử ngay (' + c.n + ' câu)</button>' +
    '<button class="bt" id="xbtn" onclick="startEx(true)">✨ Nhờ AI ra Đề Thi Mới (' + c.n + ' câu)</button></div></div>';
}

async function startEx(useAI) {
  var c = ST.cfg, qs = [];
  if (useAI && KEY) {
    var b = $('#xbtn'); if (b) { b.disabled = true; b.textContent = '🦉 Đang ra đề thi...'; }
    try { qs = await genAI({ ch: c.scope === 'all' ? 0 : c.scope, type: 'mcq', lv: 'Vận dụng' }, c.n); } catch (e) { toast('Đang dùng ngân hàng đề thi chuẩn: ' + e.message); }
  }
  if (qs.length < c.n) {
    var pool = SAMPLE_EXAM.filter(function(q) { return c.scope === 'all' || q.ch === c.scope; });
    var extra = buildPracticePack(c.scope === 'all' ? 1 : c.scope, c.n);
    qs = qs.concat(pool).concat(extra).slice(0, c.n);
  }
  ST.ex = { qs: qs, ans: {}, done: false, end: Date.now() + c.min * 60000 };
  render();
}

function exQ(q, i) {
  var a = ST.ex.ans[q.id];
  return '<span class="tag bg-[#D9C9FF]">Câu ' + (i + 1) + ' · Chương ' + q.ch + '</span>' +
    '<div class="font-bold text-lg my-2">' + q.q + '</div>' +
    q.opts.map(function(o, k) { return '<button class="opt ' + (a === k ? 'sel' : '') + '" onclick="exPick(' + i + ',' + k + ')"><b>' + LB[k] + '.</b> ' + o + '</button>'; }).join('') +
    vBlock('ex' + q.id, q.id, true);
}

function exPick(i, k) {
  var q = ST.ex.qs[i]; ST.ex.ans[q.id] = k;
  $('#eq_' + i).innerHTML = exQ(q, i);
  var nv = $('#nv_' + i); if (nv) nv.classList.add('on');
  tx();
}

function submitEx() {
  var e = ST.ex; if (!e || e.done) return;
  clearInterval(ST.timer); e.done = true;
  e.ok = e.qs.filter(function(q) {
    var r = (e.ans[q.id] === q.ans);
    recAtt(q, r); if (r) markDone(q.id); else logMiss(q, 'exam');
    return r;
  }).length;
  render();
}

function resExam(a) {
  var e = ST.ex, n = e.qs.length, sc = (e.ok / n * 10).toFixed(1);
  var cm = sc >= 8 ? 'Xuất sắc! Bạn nắm kiến thức rất chắc 🎉' : (sc >= 5 ? 'Khá tốt! Hãy xem Bản đồ tư duy các câu sai bên dưới nhé 💪' : 'Cùng Cú Đêm xem Bản đồ tư duy và Vấn đáp từng câu bên dưới để gỡ rối nhé 🦉');
  a.innerHTML = '<div class="pc p-5 flex flex-wrap items-center gap-4">' +
    '<div class="float">' + owl(110) + '</div>' +
    '<div><h2 class="text-3xl font-black">Điểm số: ' + sc + ' / 10</h2><p class="font-bold">Trả lời đúng ' + e.ok + ' / ' + n + ' câu</p><p class="mt-1">' + cm + '</p></div>' +
    '<button class="bt ml-auto" onclick="ST.ex=null;render()">🔁 Thi đề khác</button></div>' +
    '<h3 class="text-xl font-black mt-6">📝 Chữa bài chi tiết (Có Bản đồ tư duy &amp; Vấn đáp tại từng câu)</h3>' +
    e.qs.map(function(q, i) { return qcard(q, 'r', i + 1); }).join('');
}

function rExam(a) {
  var e = ST.ex; if (!e) return cfgExam(a); if (e.done) return resExam(a);
  a.innerHTML = '<div class="pc p-3 sticky top-16 z-20 flex flex-wrap items-center gap-2">' +
    '<b class="text-2xl text-red-600">⏰ <span id="clk">--:--</span></b>' +
    '<div class="flex gap-1 flex-wrap flex-1">' +
    e.qs.map(function(_, i) { return '<button id="nv_' + i + '" class="bt text-sm" onclick="document.getElementById(\'eq_' + i + '\').scrollIntoView({behavior:\'smooth\'})">' + (i + 1) + '</button>'; }).join('') +
    '</div><button class="bt bg-[#BFF1DC]" onclick="submitEx()">📨 Nộp bài chấm điểm</button></div>' +
    e.qs.map(function(q, i) { QM[q.id] = q; return '<div class="pc p-4 my-4" id="eq_' + i + '">' + exQ(q, i) + '</div>'; }).join('');
  clearInterval(ST.timer);
  var tick = function() {
    var s = Math.max(0, (e.end - Date.now()) / 1000) | 0;
    var c = $('#clk'); if (c) c.textContent = String((s / 60) | 0).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    if (s <= 0) submitEx();
  };
  tick(); ST.timer = setInterval(tick, 500); tx();
}
