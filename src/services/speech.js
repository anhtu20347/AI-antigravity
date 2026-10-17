/* ===== DỊCH VỤ VOICE AI (WEB SPEECH RECOGNITION & SYNTHESIS) ===== */

var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
var VT = 'fl', VQ = null, vRec = null, vOn = false, speakOn = true, VNOANS = false;

function vBlock(b, qid, noans) {
  return '<div class="mt-3 p-3 rounded-2xl bg-white border-2 border-[#2D2A4A]">' +
    '<div class="flex items-center gap-3 flex-wrap">' +
    '<button class="bt text-sm" onclick="vToggle(\'' + b + '\',\'' + (qid || '') + '\',' + (!!noans) + ')">🎙️ Vấn đáp bằng giọng nói</button>' +
    '<span class="wv" data-b="' + b + '"><i></i><i></i><i></i><i></i><i></i></span>' +
    '<span class="text-sm font-bold" id="s_' + b + '"></span></div>' +
    '<div class="mt-2 text-sm" id="o_' + b + '"></div></div>';
}

function vInit() {
  var r = new SR();
  r.lang = 'vi-VN';
  r.interimResults = true;
  r.continuous = false;
  r.onresult = function(e) {
    if (r !== vRec) return;
    var t = '';
    for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
    var sub = $('#s_' + VT);
    if (sub) sub.textContent = '🗣️ ' + t;
    if (e.results[e.results.length - 1].isFinal) vAsk(t.trim());
  };
  r.onend = function() { if (r === vRec) { vOn = false; vUI(); } };
  r.onerror = function() { if (r === vRec) { vOn = false; vUI(); } };
  return r;
}

function vToggle(b, qid, noans) {
  if (!SR) return toast('Trình duyệt chưa hỗ trợ thu âm giọng nói, hãy dùng Chrome hoặc Edge nhé 🎙️');
  if (vOn && VT === b) { vRec.stop(); return; }
  if (vRec && vOn) vRec.stop();
  VT = b; VNOANS = !!noans; if (qid) VQ = qid;
  vRec = vInit(); vOn = true; vUI();
  try { vRec.start(); } catch (e) { vOn = false; vUI(); }
}

function vUI() {
  document.querySelectorAll('.wv').forEach(function(w) {
    w.classList.toggle('on', vOn && w.dataset.b === VT);
  });
}

function speak(t) {
  if (!speakOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  var clean = String(t).replace(/\$\$?/g, '').replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}^_\\]/g, ' ');
  var u = new SpeechSynthesisUtterance(clean);
  u.lang = 'vi-VN';
  speechSynthesis.speak(u);
}

async function vAsk(t) {
  var out = $('#o_' + VT); if (!t || !out) return;
  out.innerHTML = '🦉 Cú Đêm đang suy nghĩ...';
  var q = VQ && allQ().find(function(x) { return x.id === VQ; });
  if (!KEY) {
    var msg = q ? ('Gợi ý cho bạn: ' + q.hint + ' (Hãy nhập Gemini API Key ở trên để đàm thoại tự do cùng Cú Đêm nhé!)') : 'Hãy nhập Gemini API Key ở thanh trên cùng để trò chuyện trực tiếp cùng Cú Đêm nhé!';
    out.innerHTML = '🦉 ' + msg; speak(msg); return;
  }
  try {
    var r = await ai([{ role: 'user', parts: [{ text: t }] }],
      'Bạn là Giáo sư Cú Đêm, trả lời vấn đáp Xác suất Thống kê bằng tiếng Việt, ngắn gọn 3-4 câu, thân thiện. Công thức dùng $...$.' +
      (q ? ('\nĐề đang làm: ' + q.q + '\n' + (VNOANS ? 'Đang trong phòng thi: chỉ gợi mở phương pháp, không nói đáp án.' : 'Chiến lược giải: ' + q.sol)) : '')
    );
    out.innerHTML = '🦉 ' + r.replace(/\n/g, '<br>'); speak(r); tx();
  } catch (e) {
    out.textContent = 'Lỗi: ' + e.message;
  }
}
