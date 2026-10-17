/* ===== COMPONENT HỒ SƠ NĂNG LỰC & THỐNG KÊ LỖI SAI (TN7, TN10) ===== */

function mastery(ch) { var a = ATT[ch]; return (a && a.n) ? Math.round(a.ok / a.n * 100) : 0; }
function xp() { return prog.done.length * 10 + prog.streak * 5; }

function saveProf() {
  PROF.name = $('#pn').value.trim();
  PROF.sid = $('#psid').value.trim();
  PROF.cls = $('#pcls').value.trim();
  PROF.title = $('#ptitle').value;
  if (currentUser) {
    currentUser.displayName = PROF.name || currentUser.displayName;
    ls.set('session_user', currentUser);
  }
  ls.set('prof', PROF);
  renderAuth();
  toast('Đã cập nhật Hồ sơ cá nhân! 🎓');
}

function reviewMiss(id) {
  var q = allQ().find(function(x) { return x.id === id; });
  if (!q) return toast('Đang chuyển về khu luyện tập chương tương ứng 🦉');
  ST.ch = q.ch; ST.type = 'all'; ST.lv = 'all';
  ST.pi = Math.max(0, filtered().findIndex(function(x) { return x.id === id; }));
  go('practice');
}

function clearMiss() { miss = []; ls.set('miss', miss); render(); }

function rStats(a) {
  var lvl = Math.floor(xp() / 100) + 1;
  var vals = Object.values(ATT), tot = vals.reduce(function(s, x) { return s + x.n; }, 0), okT = vals.reduce(function(s, x) { return s + x.ok; }, 0);
  var avg = tot ? Math.round(okT / tot * 100) : 0;
  var mx = Math.max(1, Math.max.apply(null, CH.map(function(_, i) { return miss.filter(function(m) { return m.ch === i + 1; }).length; })));

  a.innerHTML = '<div class="grid md:grid-cols-3 gap-4">' +
    /* Cột trái: Thông tin học viên, danh hiệu & cấp độ */
    '<div class="pc p-5"><h2 class="text-xl font-black">🪪 Hồ Sơ Năng Lực AI (TN10)</h2>' +
    '<div class="text-center my-3">' + (currentUser && currentUser.photoURL ? '<img src="' + attr(currentUser.photoURL) + '" class="w-20 h-20 rounded-full mx-auto border-4 border-[#2D2A4A]">' : '<div class="inline-block">' + owl(90, false) + '</div>') + '</div>' +
    '<label class="block text-sm font-bold mt-2">Họ và tên<input id="pn" class="w-full mt-1" value="' + attr(myName()) + '"></label>' +
    '<label class="block text-sm font-bold mt-2">Gmail tài khoản<input class="w-full mt-1 bg-gray-100" readonly value="' + attr(currentUser ? currentUser.email : PROF.email) + '"></label>' +
    '<label class="block text-sm font-bold mt-2">Mã số sinh viên<input id="psid" class="w-full mt-1" value="' + attr(PROF.sid) + '"></label>' +
    '<label class="block text-sm font-bold mt-2">Trường / Lớp<input id="pcls" class="w-full mt-1" value="' + attr(PROF.cls) + '"></label>' +
    '<label class="block text-sm font-bold mt-2">Danh hiệu<select id="ptitle" class="w-full mt-1">' + TITLES.map(function(t) { return '<option ' + (PROF.title === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>' +
    '<button class="bt mt-3 w-full bg-[#BFF1DC]" onclick="saveProf()">💾 Lưu thông tin Hồ sơ</button>' +
    '<div class="flex flex-wrap gap-2 mt-4 justify-center"><span class="tag bg-[#FFF1B8]">Level ' + lvl + '</span><span class="tag bg-[#BFF1DC]">' + xp() + ' XP</span><span class="tag bg-[#FFD2D0]">🔥 ' + prog.streak + ' ngày</span><span class="tag bg-[#D9C9FF]">Tỷ lệ đúng ' + avg + '%</span></div></div>' +

    /* Cột phải: Bản đồ năng lực 7 chương & Thống kê lỗi sai gom 3 nguồn */
    '<div class="pc p-5 md:col-span-2"><h2 class="text-xl font-black">🧭 Bản Đồ Năng Lực &amp; Thống Kê Lỗi Sai 3 Nguồn (TN7)</h2>' +
    '<p class="text-xs font-bold text-gray-600 mb-2">Tổng hợp lỗi sai từ Vấn đáp, Trắc nghiệm và Tự luận để AI chẩn đoán hướng khắc phục.</p>' +
    CH.map(function(c, i) {
      var m = mastery(i + 1), n = ATT[i + 1] ? ATT[i + 1].n : 0;
      return '<div class="my-2 text-sm"><div class="flex justify-between font-bold"><span>Chương ' + (i + 1) + ': ' + c + '</span><span>' + (n ? m + '% (' + ATT[i + 1].ok + '/' + n + ' câu)' : 'Chưa làm') + '</span></div>' +
        '<div class="bg-white border-2 border-[#2D2A4A] rounded-full h-4 overflow-hidden"><div class="h-full bg-[#BFF1DC]" style="width:' + m + '%"></div></div></div>';
    }).join('') +

    '<h3 class="font-black mt-4 mb-1">📊 Biểu đồ số câu sai theo chương (Vấn đáp + Trắc nghiệm + Tự luận)</h3>' +
    '<div class="flex gap-2 items-end h-24 pt-2">' +
    CH.map(function(_, i) {
      var n = miss.filter(function(m) { return m.ch === i + 1; }).length;
      return '<div class="flex-1 flex flex-col items-center"><span class="text-xs font-bold">' + n + '</span><div class="w-full bg-[#FFD2D0] border-2 border-[#2D2A4A] rounded-t-lg" style="height:' + Math.max(8, Math.round(n / mx * 70)) + 'px"></div><span class="text-xs font-bold mt-1">Ch' + (i + 1) + '</span></div>';
    }).join('') + '</div>' +

    '<div class="flex gap-2 flex-wrap mt-4">' +
    '<button class="bt bg-[#D9C9FF]" onclick="analyzeMiss()">🦉 AI Chẩn Đoán Lỗi Sai &amp; Đề Xuất Hướng Khắc Phục</button>' +
    '<button class="bt bg-[#BFF1DC]" onclick="remed()">🎯 Tạo Bộ Bài Tập Bổ Trợ Lỗ Hổng</button>' +
    '<button class="bt bg-white text-xs" onclick="clearMiss()">🗑️ Xoá lịch sử lỗi</button></div>' +
    '<div id="ana" class="mt-3"></div>' +

    '<h3 class="font-black mt-4">📝 Chi tiết các câu/nội dung làm sai gần đây (Bấm vào để ôn lại)</h3>' +
    '<div class="max-h-52 overflow-y-auto mt-1">' +
    (miss.length ? miss.slice().reverse().map(function(m) {
      var modeBadge = m.mode === 'oral' ? '🎙️ Vấn đáp' : (m.mode === 'mcq' ? '🎯 Trắc nghiệm' : '✍️ Tự luận');
      return '<div class="opt text-sm" onclick="reviewMiss(\'' + m.id + '\')"><b>[Chương ' + m.ch + ' · ' + modeBadge + ']</b> ' + m.q + '<br><span class="text-xs text-indigo-900 font-bold">Hướng khắc phục/Đáp án: ' + m.ans + '</span></div>';
    }).join('') : '<p class="text-sm mt-1">Bạn chưa có câu trả lời sai nào. Hãy thử làm bài ở Khu Luyện Tập, Thi Thử hoặc Vấn đáp nhé! 🎉</p>') +
    '</div></div></div>';
  tx();
}

async function analyzeMiss() {
  var el = $('#ana'); if (!el) return;
  if (!miss.length) return toast('Bạn chưa có câu sai nào trong hồ sơ! 🎉');
  if (!KEY) {
    el.innerHTML = '<div class="pc p-4 bg-[#F3EEFF] text-sm"><b>🦉 Chẩn đoán nhanh từ Hồ sơ:</b> Bạn đang có <b>' + miss.length + ' nội dung sai</b>. Hãy chú ý ôn kỹ điều kiện áp dụng công thức Bayes và cách tính phương sai mẫu $s^2$ trước khi tính khoảng ước lượng nhé!</div>';
    tx(); return;
  }
  el.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 AI đang phân tích toàn diện hồ sơ lỗi sai 3 nguồn của bạn...</div>';
  try {
    var list = miss.slice(-20).map(function(m) { return 'Ch' + m.ch + ' [' + MODES[m.mode] + ']: ' + m.q + ' -> ' + m.ans; }).join('\n');
    var res = await ai('Hồ sơ lỗi sai của sinh viên ' + myName() + ':\n' + list + '\nHãy đưa ra:\n1. Nhận định tổng hợp về các lỗ hổng kiến thức cốt lõi;\n2. Phương án bổ trợ và lộ trình khắc phục cụ thể cho từng chương bị sai. Ngắn gọn, chuẩn sư phạm, dùng LaTeX $...$.');
    el.innerHTML = '<div class="pc p-4 bg-[#F3EEFF] text-sm leading-relaxed">' + res.replace(/\n/g, '<br>') + '</div>';
  } catch (e) { el.innerHTML = 'Lỗi: ' + esc(e.message); }
  tx();
}

async function remed() {
  var tried = [1, 2, 3, 4, 5, 6, 7].filter(function(i) { return ATT[i] && ATT[i].n; });
  var weak = tried.length ? tried.sort(function(a, b) { return mastery(a) - mastery(b); })[0] : (miss.length ? miss[miss.length - 1].ch : 1);
  var pack = buildPracticePack(weak, 10);
  ST.gen = ST.gen.concat(pack); ST.ch = weak; ST.pi = 0;
  toast('Đã tạo bộ 10 bài tập bổ trợ cho Chương ' + weak + '! 🎯');
  go('practice');
}
