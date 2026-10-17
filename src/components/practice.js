/* ===== COMPONENT LUYỆN TẬP CHỦ ĐỘNG 7 CHƯƠNG & BẢN ĐỒ TƯ DUY (TN5, TN8) ===== */

function U(id) { return ST.ui[id] || (ST.ui[id] = { msgs: [], run: true }); }

function markDone(id) {
  var d = new Date(), f = d.toDateString();
  if (!prog.done.includes(id)) prog.done.push(id);
  if (prog.last !== f) {
    var y = new Date(d - 86400000).toDateString();
    prog.streak = (prog.last === y) ? prog.streak + 1 : 1;
    prog.last = f;
  }
  ls.set('prog', prog);
}

var scoreOf = function(t) { var m = String(t).match(/(\d+(?:[.,]\d+)?)\s*\/\s*10/); return m ? parseFloat(m[1].replace(',', '.')) : null; };

function recAtt(q, ok) {
  var a = ATT[q.ch] || { n: 0, ok: 0 }; a.n++; if (ok) a.ok++;
  ATT[q.ch] = a; ls.set('att', ATT);
}

function logMiss(q, mode) {
  if (miss.some(function(m) { return m.id === q.id && m.mode === mode; })) return;
  miss.push({ id: q.id, ch: q.ch, mode: mode, q: q.q, ans: q.type === 'mcq' ? q.opts[q.ans] : 'Xem lời giải', date: Date.now() });
  ls.set('miss', miss);
}

function qaHTML(q, mode) {
  var u = U(q.id), rev = (mode === 'r'), pk = rev ? ST.ex.ans[q.id] : u.pick, shown = rev || (u.pick != null);
  var h = '<div class="font-bold text-lg my-2">' + q.q + '</div>';
  if (q.type === 'mcq') {
    q.opts.forEach(function(o, i) {
      var c = 'opt';
      if (shown) { if (i === q.ans) c += ' ok'; else if (i === pk) c += ' bad'; }
      h += '<button class="' + c + '" ' + (shown ? 'disabled' : '') + ' onclick="pick(\'' + q.id + '\',' + i + ')"><b>' + LB[i] + '.</b> ' + o + '</button>';
    });
    if (shown) {
      h += '<div class="font-black my-2">' + (pk === q.ans ? '🎉 Chuẩn luôn! Đúng rồi!' : (pk == null ? '⏰ Bạn chưa chọn đáp án – Đáp án đúng là ' + LB[q.ans] : '💔 Chưa đúng rồi – Đáp án đúng là ' + LB[q.ans])) + '</div>';
    }
  } else {
    h += '<textarea class="w-full" rows="4" placeholder="Viết bài giải của bạn (có thể dùng $công thức$)..." oninput="U(\'' + q.id + '\').essay=this.value">' + esc(u.essay || '') + '</textarea>' +
      '<button class="bt mt-2" onclick="grade(\'' + q.id + '\')">✍️ Nhờ Cú Đêm chấm bài</button>' +
      (u.grade ? '<div class="pc p-3 mt-3 bg-[#EFFFF8]">' + u.grade + '</div>' : '');
  }
  if (!rev) {
    h += '<div class="flex gap-2 flex-wrap mt-2">' +
      '<button class="bt text-sm" onclick="U(\'' + q.id + '\').hint=1;updQ(\'' + q.id + '\',\'' + mode + '\')">💡 Gợi ý nhẹ</button>' +
      '<button class="bt text-sm" onclick="U(\'' + q.id + '\').sol=!U(\'' + q.id + '\').sol;updQ(\'' + q.id + '\',\'' + mode + '\')">📖 Chiến lược giải</button></div>';
  }
  if (u.hint && !rev) h += '<div class="mt-2 p-3 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A]">💡 ' + q.hint + '</div>';
  if (rev || u.sol) h += '<div class="mt-2 p-3 rounded-2xl bg-[#E9DDFF] border-2 border-[#2D2A4A]"><b>📖 Chiến lược & Lời giải:</b> ' + q.sol + '</div>';
  return h;
}

function qcard(q, mode, num) {
  QM[q.id] = q; var id = q.id;
  return '<div class="pc p-4 my-4" id="c_' + id + '">' +
    '<div class="flex gap-2 flex-wrap items-center">' +
    '<span class="tag bg-[#D9C9FF]">' + (num ? 'Câu ' + num + ' · ' : '') + 'Chương ' + q.ch + '</span>' +
    '<span class="tag bg-[#FFD2D0]">' + esc(q.lv) + '</span>' +
    '<span class="tag bg-[#BFF1DC]">' + (q.type === 'mcq' ? 'Trắc nghiệm' : 'Tự luận') + '</span></div>' +
    '<div class="grid md:grid-cols-5 gap-3 mt-2">' +
    '<div class="md:col-span-3"><div id="qa_' + id + '">' + qaHTML(q, mode) + '</div></div>' +
    '<div class="md:col-span-2"><div class="stage"><canvas class="sc" data-q="' + id + '" width="560" height="360"></canvas>' +
    '<button id="rb_' + id + '" class="bt" onclick="runT(\'' + id + '\')">⏸ Dừng</button></div></div></div>' +
    '<div class="mt-3 p-3 rounded-2xl bg-[#F3EEFF] border-2 border-dashed border-[#2D2A4A]">' +
    '<b>🛟 Gỡ rối tức thì cho câu hỏi này</b>' +
    '<div class="flex gap-2 flex-wrap mt-2">' +
    '<button class="bt text-sm" onclick="togMind(\'' + id + '\')">🧠 Bản đồ tư duy bài toán (TN8)</button>' +
    '<button class="bt text-sm" onclick="togChat(\'' + id + '\')">💬 Vấn đáp trực tiếp: Vì sao chọn đáp án này?</button></div>' +
    '<div id="mm_' + id + '"></div><div id="ch_' + id + '"></div></div>' +
    vBlock('q' + id, id, false) + '</div>';
}

function updQ(id, mode) { var q = QM[id]; $('#qa_' + id).innerHTML = qaHTML(q, mode); tx(); }

function pick(id, i) {
  var q = QM[id]; U(id).pick = i;
  recAtt(q, i === q.ans);
  if (i === q.ans) markDone(id); else logMiss(q, 'mcq');
  updQ(id, 'p');
}

async function grade(id) {
  var q = QM[id], u = U(id);
  if (!u.essay) return toast('Bạn viết bài giải trước nhé ✍️');
  if (!KEY) {
    u.grade = '🦉 Chưa nhập API Key nên hệ thống hiện chiến lược giải mẫu để bạn đối chiếu:<br><b>Chiến lược:</b> ' + q.sol;
    u.sol = 1; return updQ(id, 'p');
  }
  u.grade = '🦉 Cú Đêm đang chấm bài theo barem...'; updQ(id, 'p');
  try {
    u.grade = (await ai('Đề: ' + q.q + '\nChiến lược chuẩn: ' + q.sol + '\nBài làm sinh viên: ' + u.essay + '\nHãy chấm điểm trên thang 10 (ghi rõ X/10), nhận xét sư phạm và chỉ ra chỗ sai nếu có. Dùng LaTeX $...$.', 'Bạn là Cú Đêm, trợ giảng XSTK Gen Z.')).replace(/\n/g, '<br>');
    markDone(id);
    var sc = scoreOf(u.grade);
    if (sc !== null) { recAtt(q, sc >= 5); if (sc < 5) logMiss(q, 'essay'); }
  } catch (e) { u.grade = 'Lỗi: ' + esc(e.message); }
  updQ(id, 'p');
}

function mmHTML(q) {
  var parts = (q.m || 'Dạng toán|Dữ kiện|Công thức|Bước giải').split('|');
  return '<div class="mm text-center mt-3"><div class="root">🧠 Chương ' + q.ch + ': ' + CH[q.ch - 1] + '</div>' +
    '<div class="grid md:grid-cols-4 gap-3 mt-3 text-left">' +
    LBL.map(function(lb, i) {
      var p = parts[i] || lb[0];
      return '<div class="br" style="background:' + lb[1] + '"><b>' + lb[0] + '</b><ul>' +
        p.split(';').map(function(s) { return '<li>' + s.trim() + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div></div>';
}

async function togMind(id) {
  var q = QM[id], u = U(id), el = $('#mm_' + id);
  if (u.mind) { u.mind = 0; el.innerHTML = ''; return; }
  if (!q.m && KEY) {
    el.innerHTML = '<p class="mt-2 font-bold">🦉 Đang vẽ bản đồ tư duy...</p>';
    try {
      q.m = (await ai('Đề: ' + q.q + '\nLời giải: ' + q.sol + '\nTrả về 4 nhánh cách nhau bởi dấu |: Dạng toán|Dữ kiện|Công thức|Các bước giải;Bẫy hay sai.')).replace(/\n/g, ' ').trim();
    } catch (e) {}
  }
  u.mind = 1; el.innerHTML = mmHTML(q); tx();
}

function chatHTML(id) {
  var u = U(id);
  return '<div class="mt-3 bg-white rounded-2xl border-2 border-[#2D2A4A] p-3">' +
    '<div class="max-h-72 overflow-y-auto" id="msgs_' + id + '">' +
    u.msgs.map(function(m) {
      return '<div class="my-1 ' + (m.r === 'u' ? 'text-right' : '') + '"><span class="inline-block px-3 py-1 rounded-2xl border-2 border-[#2D2A4A] ' + (m.r === 'u' ? 'bg-[#BFF1DC]' : 'bg-[#F3EEFF]') + '">' + (m.r === 'u' ? '' : '🦉 ') + m.t + '</span></div>';
    }).join('') + '</div>' +
    '<div class="flex gap-2 mt-2"><input id="in_' + id + '" class="flex-1 text-sm" placeholder="Hỏi Cú Đêm: vì sao câu này dùng công thức đó?" onkeydown="if(event.key===\'Enter\')send(\'' + id + '\')"><button class="bt text-sm" onclick="send(\'' + id + '\')">Gửi</button></div></div>';
}

function togChat(id) {
  var u = U(id), el = $('#ch_' + id);
  if (u.chat) { u.chat = 0; el.innerHTML = ''; return; }
  u.chat = 1;
  if (!u.msgs.length) u.msgs.push({ r: 'm', t: 'Chào bạn! Mình đã nắm rõ đề bài này rồi. Bạn đang thắc mắc tại sao chọn công thức hay đáp án này? 🦉' });
  el.innerHTML = chatHTML(id); tx();
}

async function send(id) {
  var q = QM[id], u = U(id), inp = $('#in_' + id), v = inp.value.trim(); if (!v) return;
  u.msgs.push({ r: 'u', t: esc(v) }); u.msgs.push({ r: 'm', t: '🦉 Đang suy nghĩ...' });
  $('#ch_' + id).innerHTML = chatHTML(id);
  var rep;
  try {
    var hist = u.msgs.slice(0, -1).map(function(m) { return { role: m.r === 'u' ? 'user' : 'model', parts: [{ text: m.t }] }; }).filter(function(m, i) { return !(i === 0 && m.role === 'model'); });
    rep = (await ai(hist, 'Bạn là Cú Đêm, trợ giảng XSTK Gen Z. Đặt câu hỏi gợi mở Socratic, giải thích vì sao chọn đáp án đó dễ hiểu. Đề: ' + q.q + '\nLời giải: ' + q.sol)).replace(/\n/g, '<br>');
  } catch (e) {
    rep = (e.message === 'nokey') ? ('Gợi ý nhanh: ' + q.hint + '<br>Chiến lược: ' + q.sol + '<br><i>(Nhập Gemini API Key ở trên để hỏi đáp tự do nhé!)</i>') : ('Lỗi: ' + esc(e.message));
  }
  u.msgs[u.msgs.length - 1] = { r: 'm', t: rep };
  $('#ch_' + id).innerHTML = chatHTML(id);
  var boxEl = $('#msgs_' + id); if (boxEl) boxEl.scrollTop = boxEl.scrollHeight;
  tx();
}

function filtered() {
  return BANK.concat(ST.gen).filter(function(q) {
    return q.ch === ST.ch && (ST.type === 'all' || q.type === ST.type) && (ST.lv === 'all' || q.lv === ST.lv);
  });
}

function pgo(d) { var n = filtered().length; if (!n) return; ST.pi = (ST.pi + d + n) % n; pList(); }

function pList() {
  var l = filtered(), el = $('#plist'); if (!el) return;
  if (!l.length) {
    el.innerHTML = '<div class="pc p-5 mt-4 text-center">🦉 Chưa có câu hỏi cho bộ lọc này. Hãy bấm nút <b>“✨ Tạo bộ 15-20 bài toán mới”</b> ở trên nhé!</div>';
    return;
  }
  if (ST.pi >= l.length) ST.pi = 0;
  el.innerHTML = '<div class="flex flex-wrap gap-1 items-center my-4">' +
    '<button class="bt text-sm" onclick="pgo(-1)">◀ Câu trước</button>' +
    l.map(function(_, i) { return '<button class="bt text-sm ' + (i === ST.pi ? 'on' : '') + '" onclick="ST.pi=' + i + ';pList()">' + (i + 1) + '</button>'; }).join('') +
    '<button class="bt text-sm" onclick="pgo(1)">Câu tiếp ▶</button>' +
    '<span class="text-sm font-black ml-2">Câu ' + (ST.pi + 1) + ' / ' + l.length + '</span></div>' +
    qcard(l[ST.pi], 'p', ST.pi + 1);
  tx();
}

function rPractice(a) {
  a.innerHTML = '<div class="pc p-4"><h2 class="text-2xl font-black mb-2">🎯 Khu Luyện Tập Chủ Động (7 Chương &amp; 9 Mô Hình 3D)</h2>' +
    '<div class="flex flex-wrap gap-2">' +
    CH.map(function(c, i) { return '<button class="bt text-sm ' + (ST.ch === i + 1 ? 'on' : '') + '" onclick="ST.ch=' + (i + 1) + ';ST.pi=0;render()">Chương ' + (i + 1) + '</button>'; }).join('') +
    '</div><p class="font-bold mt-2 text-indigo-900">📘 Chương ' + ST.ch + ': ' + CH[ST.ch - 1] + '</p>' +
    '<div class="flex flex-wrap gap-2 mt-3 items-center">' +
    '<select onchange="ST.type=this.value;ST.pi=0;pList()"><option value="all">Mọi hình thức</option><option value="mcq" ' + (ST.type === 'mcq' ? 'selected' : '') + '>Trắc nghiệm</option><option value="essay" ' + (ST.type === 'essay' ? 'selected' : '') + '>Tự luận</option></select>' +
    '<select onchange="ST.lv=this.value;ST.pi=0;pList()"><option value="all">Mọi độ khó</option>' +
    ['Cơ bản', 'Vận dụng', 'Vận dụng cao'].map(function(l) { return '<option ' + (ST.lv === l ? 'selected' : '') + '>' + l + '</option>'; }).join('') + '</select>' +
    '<select onchange="ST.cnt=+this.value">' +
    [10, 15, 20].map(function(n) { return '<option value="' + n + '" ' + (ST.cnt === n ? 'selected' : '') + '>Tạo ' + n + ' câu/lần</option>'; }).join('') + '</select>' +
    '<button class="bt bg-[#BFF1DC]" id="gbtn" onclick="genP()">✨ Tạo ' + ST.cnt + ' bài toán mới (AI + Thực tế)</button></div></div>' +
    '<div id="plist"></div>';
  pList();
}

async function genP() {
  var b = $('#gbtn'); if (b) { b.disabled = true; b.textContent = '🦉 Đang khởi tạo ' + ST.cnt + ' câu hỏi...'; }
  try {
    if (KEY) {
      var r = await genAI({ ch: ST.ch, type: ST.type === 'all' ? 'mcq' : ST.type, lv: ST.lv === 'all' ? 'Vận dụng cao' : ST.lv }, ST.cnt);
      if (r.length < ST.cnt) r = r.concat(buildPracticePack(ST.ch, ST.cnt - r.length));
      ST.gen = ST.gen.concat(r);
      toast('Đã tạo mới ' + r.length + ' câu hỏi bằng AI! 🎉');
    } else {
      var localPack = buildPracticePack(ST.ch, ST.cnt);
      ST.gen = ST.gen.concat(localPack);
      toast('Đã tạo ' + localPack.length + ' bài toán thực tế Chương ' + ST.ch + '! 🎉');
    }
    ST.pi = 0;
  } catch (e) {
    var fbPack = buildPracticePack(ST.ch, ST.cnt);
    ST.gen = ST.gen.concat(fbPack);
    toast('Đã nạp ' + fbPack.length + ' bài toán thực tế Chương ' + ST.ch + '! 🦉');
  }
  if (b) { b.disabled = false; b.textContent = '✨ Tạo ' + ST.cnt + ' bài toán mới (AI + Thực tế)'; }
  pList();
}
