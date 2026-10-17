/* ===== COMPONENT AI TUTOR & BẢNG IPAD & TẠO 5 BÀI TỰ LUẬN TƯƠNG TỰ (TN2, TN4) ===== */

function rTutor(a) {
  var all = allQ(), cur = all.find(function(q) { return q.id === ST.tq; }) || all[0];
  ST.tq = cur.id;

  a.innerHTML = '<div class="grid md:grid-cols-5 gap-4">' +
    /* Cột trái: Đề bài, Barem điểm tùy chỉnh & Tạo 5 bài tự luận tương tự */
    '<div class="pc p-4 md:col-span-2 space-y-4">' +
    '<div><h2 class="text-xl font-black">🎙️ AI Tutor &amp; Bảng iPad</h2>' +
    '<p class="text-xs font-bold text-gray-600">AI chấm điểm theo Barem 4 tiêu chí; chỉ cung cấp chiến lược giải.</p></div>' +

    '<div><label class="block text-sm font-bold">Chọn bài toán đang làm:</label>' +
    '<select class="w-full mt-1" onchange="ST.tq=this.value;render()">' +
    all.map(function(q) { return '<option value="' + q.id + '" ' + (q.id === cur.id ? 'selected' : '') + '>Ch' + q.ch + ' · ' + esc(q.q.replace(/\$/g, '').slice(0, 45)) + '...</option>'; }).join('') +
    '</select>' +
    '<div class="p-3 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A] font-bold mt-2 text-sm leading-relaxed">' + cur.q + '</div></div>' +

    /* TN4: Tạo đúng 5 bài tập tương tự tự luận */
    '<div class="p-3 rounded-2xl bg-[#D9C9FF] border-2 border-[#2D2A4A]">' +
    '<b>✨ Tạo 5 bài toán tương tự tự luận (TN4)</b>' +
    '<p class="text-[11px] font-bold text-gray-700 mt-1">AI phân tích cấu trúc bài toán trên và sinh ngẫu nhiên đúng 5 bài toán tương tự cùng dạng kèm chiến lược tư duy:</p>' +
    '<button class="bt text-xs bg-white w-full mt-2" onclick="generate5SimilarEssayProblems(\'' + cur.id + '\')">🎲 Sinh ngẫu nhiên 5 bài tự luận tương tự</button>' +
    '<div id="similar5Box" class="mt-2 text-xs"></div></div>' +

    /* Barem điểm 4 tiêu chí cho phép tự chỉnh */
    '<div><b>⚖️ Barem chấm điểm (Chỉnh sửa được):</b>' +
    RUBRIC.map(function(r, i) {
      return '<div class="flex gap-2 items-center my-1"><input class="flex-1 text-xs" value="' + attr(r.k) + '" onchange="RUBRIC[' + i + '].k=this.value"><input type="number" step="0.5" class="w-16 text-xs" value="' + r.p + '" onchange="RUBRIC[' + i + '].p=+this.value;rTutorSum()"></div>';
    }).join('') +
    '<div id="rsum" class="font-black mt-1 text-indigo-900 text-xs"></div></div></div>' +

    /* Cột phải: Bảng viết iPad, thanh công cụ, upload ảnh/PDF và nộp bài */
    '<div class="pc p-4 md:col-span-3">' +
    '<div class="p-3 rounded-2xl bg-[#F3EEFF] border-2 border-[#2D2A4A] mb-3">' +
    '<b>✨ Soạn / Tải đề bài cho Bảng iPad</b>' +
    '<div class="flex flex-wrap gap-2 mt-2">' +
    '<select onchange="ST.tch=+this.value">' + CH.map(function(c, i) { return '<option value="' + (i + 1) + '" ' + (ST.tch === i + 1 ? 'selected' : '') + '>Chương ' + (i + 1) + '</option>'; }).join('') + '</select>' +
    '<select onchange="ST.tlv=this.value">' + ['Cơ bản', 'Vận dụng', 'Vận dụng cao'].map(function(l) { return '<option ' + (ST.tlv === l ? 'selected' : '') + '>' + l + '</option>'; }).join('') + '</select>' +
    '<input id="treq" class="flex-1 min-w-[130px] text-xs" placeholder="Chủ đề (vd: y tế, tài chính)">' +
    '<button class="bt text-xs bg-[#BFF1DC]" onclick="aiTutorNew()">✨ Tạo đề mới</button></div>' +
    '<textarea id="tcustom" class="w-full mt-2 text-xs" rows="2" placeholder="Hoặc tự gõ / dán đề bài trên lớp vào đây..."></textarea>' +
    '<div class="flex gap-2 flex-wrap mt-2">' +
    '<button class="bt text-xs" onclick="customTutor()">📝 Dùng đề tự gõ</button>' +
    '<label class="bt text-xs cursor-pointer">📷 Chụp ảnh đề bài<input type="file" accept="image/*" class="hidden" onchange="problemPhoto(this)"></label></div></div>' +

    /* Thanh công cụ vẽ bảng iPad */
    '<div class="flex flex-wrap gap-2 items-center">' +
    ['#2D2A4A', '#2563EB', '#DC2626', '#16A34A'].map(function(c) { return '<button class="bt" style="background:' + c + ';width:1.8rem;height:1.8rem;padding:0" onclick="PEN.c=\'' + c + '\';PEN.e=0"></button>'; }).join('') +
    '<select onchange="PEN.w=+this.value" class="text-xs"><option value="2">Nét 2</option><option value="4" selected>Nét 4</option><option value="8">Nét 8</option></select>' +
    '<button class="bt text-xs" onclick="PEN.e=1">🧽 Tẩy</button>' +
    '<button class="bt text-xs" onclick="undoPad()">↩️ Hoàn tác</button>' +
    '<button class="bt text-xs" onclick="clearPad()">🗑️ Xoá bảng</button>' +
    ['∑', '∫', 'μ', 'σ²', 'x̄', 'P(A|B)'].map(function(s) { return '<button class="bt text-xs" onclick="symPad(\'' + s + '\')">' + s + '</button>'; }).join('') + '</div>' +

    /* Màn hình Canvas Bảng iPad */
    '<canvas id="ipad" width="700" height="420" class="w-full mt-2 rounded-2xl border-4 border-[#2D2A4A] bg-white" style="touch-action:none;background-image:linear-gradient(#e5e7eb 1px,transparent 1px),linear-gradient(90deg,#e5e7eb 1px,transparent 1px);background-size:28px 28px"></canvas>' +

    /* Tải tệp đính kèm */
    '<div class="flex flex-wrap gap-2 items-center mt-3">' +
    '<label class="bt text-xs cursor-pointer bg-white">📎 Tải Ảnh hoặc PDF bài làm<input type="file" id="up" class="hidden" accept="image/png,image/jpeg,application/pdf" onchange="loadUp(this)"></label>' +
    '<span id="upname" class="text-xs font-bold"></span></div>' +
    '<div id="prev" class="mt-2"></div>' +

    /* Nút chấm bài */
    '<button class="bt mt-3 bg-[#BFF1DC] w-full text-base py-2.5 font-black" onclick="gradeTutor()">🦉 Nhờ AI Tutor Chấm Điểm (Theo Barem &amp; Chiến Lược Giải)</button>' +
    '<div id="tres" class="mt-3"></div>' +
    vBlock('tu', cur.id, false) + '</div></div>';

  initPad();
  rTutorSum();
  tx();
}

function rTutorSum() {
  var el = $('#rsum');
  if (el) el.textContent = 'Tổng điểm Barem: ' + RUBRIC.reduce(function(s, r) { return s + (Number(r.p) || 0); }, 0) + ' / 10 điểm';
}

async function aiTutorNew() {
  var req = ($('#treq') ? $('#treq').value : '').trim();
  if (!KEY) {
    var loc = buildPracticePack(ST.tch, 1)[0]; loc.type = 'essay';
    ST.gen.push(loc); ST.tq = loc.id; render();
    return toast('Đã tạo đề mới Chương ' + ST.tch + ' cho Bảng iPad! 🦉');
  }
  toast('🦉 AI đang soạn đề mới...');
  try {
    var r = await genAI({ ch: ST.tch, type: 'essay', lv: ST.tlv, note: req }, 1);
    ST.gen.push(r[0]); ST.tq = r[0].id; render();
  } catch (e) {
    var fb = buildPracticePack(ST.tch, 1)[0]; fb.type = 'essay';
    ST.gen.push(fb); ST.tq = fb.id; render();
  }
}

function customTutor() {
  var t = ($('#tcustom') ? $('#tcustom').value : '').trim();
  if (!t) return toast('Bạn hãy gõ hoặc dán đề bài vào ô trước nhé ✍️');
  var q = M('u' + Date.now(), ST.tch, 'essay', 'Đề tự nhập', t, [], 0, 'Xác định công thức chính.', 'Áp dụng công thức chương ' + ST.tch, 'bellcurve_3d', {}, '');
  ST.gen.push(q); ST.tq = q.id; render();
}

/* TN4: Sinh ngẫu nhiên đúng 5 bài toán tự luận tương tự kèm chiến lược giải */
async function generate5SimilarEssayProblems(qid) {
  var cur = allQ().find(function(x) { return x.id === qid; }) || BANK[0];
  var box = $('#similar5Box'); if (!box) return;
  box.innerHTML = '<div class="p-2 bg-white rounded-xl border border-[#2D2A4A] font-bold">🦉 Đang phân tích và sinh ngẫu nhiên 5 bài toán tự luận tương tự...</div>';

  if (!KEY) {
    var localPacks = buildPracticePack(cur.ch, 5);
    box.innerHTML = '<div class="space-y-2 mt-2">' +
      localPacks.map(function(p, i) {
        return '<div class="p-2 bg-white rounded-xl border border-[#2D2A4A]">' +
          '<b>Bài #' + (i + 1) + ':</b> ' + p.q + '<br>' +
          '<span class="text-[10px] text-indigo-900 font-bold">💡 Chiến lược giải: Nhận diện không gian mẫu và áp dụng công thức tương ứng của Chương ' + cur.ch + '.</span></div>';
      }).join('') + '</div>';
    tx();
    return;
  }

  var prompt = 'Nhiệm vụ TN4: Dựa trên bài toán gốc: "' + cur.q + '" (Chương ' + cur.ch + ').\n' +
    'Hãy sinh ngẫu nhiên ĐÚNG 5 BÀI TOÁN TỰ LUẬN TƯƠNG TỰ CÙNG DẠNG (đổi bối cảnh thực tế: y tế, kinh doanh, logistics, sản xuất, tài chính).\n' +
    'Mỗi bài phải gồm: 1. Đề bài chi tiết; 2. Khung chiến lược giải (các bước tư duy, công thức cốt lõi), TUYỆT ĐỐI KHÔNG CUNG CẤP ĐÁP SỐ HAY BÀI GIẢI HOÀN CHỈNH. Dùng LaTeX $...$. Trả về dạng markdown có đánh số 1 đến 5.';
  try {
    var res = await ai(prompt, 'Bạn là Chuyên gia thiết kế bài tập Xác suất Thống kê sư phạm.');
    box.innerHTML = '<div class="p-3 bg-white rounded-xl border-2 border-[#2D2A4A] space-y-2 max-h-72 overflow-y-auto leading-relaxed">' +
      '<b class="text-indigo-900">Gói 5 bài toán tương tự tự luyện:</b><br>' + res.replace(/\n/g, '<br>') + '</div>';
    tx();
  } catch (e) {
    box.innerHTML = '<div class="p-2 bg-[#FFD2D0] rounded-xl">Lỗi: ' + esc(e.message) + '</div>';
  }
}
