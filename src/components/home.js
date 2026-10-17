/* ===== COMPONENT TRANG CHỦ & ĐIỀU HƯỚNG TỔNG QUAN ===== */

function go(v) {
  clearInterval(ST.timer);
  ST.view = v;
  if (v === 'exam' && !(ST.ex && !ST.ex.done)) ST.ex = null;
  render();
}

function render() {
  var a = $('#app'); if (!a) return;
  $('#homeBtn').classList.toggle('hidden', ST.view === 'home');
  $('#nav').innerHTML = NAV.map(function(item) {
    return '<button class="bt text-xs md:text-sm ' + (ST.view === item[0] ? 'on' : '') + '" onclick="go(\'' + item[0] + '\')">' + item[1] + '</button>';
  }).join('');

  var views = {
    home: rHome,
    pedagogy: rPedagogy,
    practice: rPractice,
    exam: rExam,
    tutor: rTutor,
    oral: rOral,
    stats: rStats,
    forum: rForum
  };
  (views[ST.view] || rHome)(a);
  tx();
}

function rHome(a) {
  a.innerHTML = '<section class="pc p-5 flex flex-wrap items-center gap-4 bg-white">' +
    '<div class="float">' + owl(140) + '</div>' +
    '<div class="flex-1 min-w-[220px]">' +
    '<div class="inline-block pc px-3 py-1 text-sm mb-2">👋 Chào ' + esc(myName()) + '! Cùng Cú Đêm chinh phục Xác suất &amp; Thống kê nhé!</div>' +
    '<h1 class="text-3xl md:text-4xl font-black">Học Xác suất &amp; Thống kê cực chill cùng Giáo sư Cú Đêm 🦉</h1>' +
    '<p class="mt-1 font-bold text-gray-700">Hệ thống trợ lý AI sư phạm tương tác đa phương thức: Quy trình 4 bước, Bảng vẽ iPad, Voice AI và Diễn đàn cộng đồng.</p>' +
    '<div class="flex gap-3 mt-3 flex-wrap">' +
    '<span class="tag bg-[#BFF1DC] py-1 text-sm">🏆 ' + prog.done.length + ' bài đã chinh phục</span>' +
    '<span class="tag bg-[#FFD2D0] py-1 text-sm">🔥 ' + prog.streak + ' ngày chăm học</span>' +
    '<span class="tag bg-[#D9C9FF] py-1 text-sm">✨ Đầy đủ 11 tính năng chuẩn hóa</span></div></div></section>' +

    '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">' +
    '<button onclick="go(\'pedagogy\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#D9C9FF,#BFF1DC)">' +
    '<div class="text-3xl">📘✨</div><h2 class="text-xl font-black mt-2">Sư Phạm 4 Bước &amp; Meta-Engine (TN1, TN11)</h2>' +
    '<p class="font-bold text-xs mt-1">Tiến trình 4 bước giải toán Polya, học khái niệm &amp; định lí kiến tạo. Nhân bản bài toán bất kỳ.</p></button>' +

    '<button onclick="go(\'tutor\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#BFF1DC,#D9C9FF)">' +
    '<div class="text-3xl">✍️🎨</div><h2 class="text-xl font-black mt-2">AI Tutor &amp; Bảng Viết iPad (TN2, TN4)</h2>' +
    '<p class="font-bold text-xs mt-1">Viết bảng iPad, AI chấm điểm theo Barem 4 tiêu chí; sinh gói 5 bài tự luận tương tự kèm chiến lược giải.</p></button>' +

    '<button onclick="go(\'oral\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#FFF1B8,#FFD2D0)">' +
    '<div class="text-3xl">🎙️🧠</div><h2 class="text-xl font-black mt-2">Phòng Khảo Hạch Vấn Đáp (TN6)</h2>' +
    '<p class="font-bold text-xs mt-1">AI phỏng vấn vấn đáp lý thuyết bằng giọng nói, chấm điểm và chỉ mặt điểm tên lỗ hổng kiến thức.</p></button>' +

    '<button onclick="go(\'practice\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#FFD2D0,#FFF1B8)">' +
    '<div class="text-3xl">🎯🎲</div><h2 class="text-xl font-black mt-2">Khu Luyện Tập Chủ Động (TN5, TN8)</h2>' +
    '<p class="font-bold text-xs mt-1">Đầy đủ 7 chương với 9 mô hình 3D thực tế, Bản đồ tư duy 4 nhánh và Vấn đáp tại từng câu hỏi.</p></button>' +

    '<button onclick="go(\'exam\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#D9C9FF,#FFF1B8)">' +
    '<div class="text-3xl">⏰📝</div><h2 class="text-xl font-black mt-2">Đấu Trường Thi Thử Bấm Giờ</h2>' +
    '<p class="font-bold text-xs mt-1">Làm bài thi có đồng hồ đếm ngược, tự động chấm điểm thang 10 và chữa bài chi tiết có bản đồ tư duy.</p></button>' +

    '<button onclick="go(\'stats\')" class="pc p-4 text-left bt" style="background:linear-gradient(135deg,#BFF1DC,#FFF1B8)">' +
    '<div class="text-3xl">🎓📊</div><h2 class="text-xl font-black mt-2">Hồ Sơ Năng Lực &amp; Lỗi Sai (TN7, TN10)</h2>' +
    '<p class="font-bold text-xs mt-1">Thống kê lỗi sai gom từ 3 nguồn (Vấn đáp, Trắc nghiệm, Tự luận), AI chẩn đoán và sinh đề bù đắp.</p></button>' +

    '<button onclick="go(\'forum\')" class="pc p-4 text-left bt md:col-span-2 lg:col-span-3" style="background:linear-gradient(135deg,#FFF1B8,#BFF1DC)">' +
    '<div class="text-3xl">🌐🤝</div><h2 class="text-xl font-black mt-2">Diễn Đàn Người Thật &amp; Nhắn Tin Bạn Bè 1-1 (TN9)</h2>' +
    '<p class="font-bold text-xs mt-1">100% người thật tương tác: Đăng bài kèm LaTeX &amp; nét vẽ iPad, kết bạn 2 chiều và trò chuyện riêng tư thời gian thực.</p></button></div>';
}
