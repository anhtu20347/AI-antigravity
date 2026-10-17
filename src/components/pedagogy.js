/* ===== COMPONENT SƯ PHẠM 4 BƯỚC & META-ENGINE NHÂN BẢN TIẾN TRÌNH (TN1 & TN11) ===== */

var PEDAGOGY_DATA = {
  solve: {
    title: 'Quy trình 4 Bước Giải Toán Xác suất Thống kê (George Pólya)',
    badge: 'Toán học thực chiến',
    sampleTitle: 'Bài toán Bayes trong Xét nghiệm Y tế',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Tìm hiểu nội dung bài toán',
        desc: 'Phân biệt cái đã cho, cái phải tìm và cái phải chứng minh. Dùng kí hiệu toán học diễn tả đề bài.',
        tasks: [
          '• Phân biệt: Cái đã cho ($P(B)=0.01, P(+|B)=0.98, P(+|\\bar{B})=0.03$), Cái phải tìm ($P(B|+)$).',
          '• Dùng công thức, kí hiệu, sơ đồ cây biến cố để mô tả.',
          '• Chuyển hóa các câu chữ điều kiện thành biểu thức toán học xác suất.'
        ]
      },
      {
        num: 2,
        title: 'Bước 2: Xây dựng chương trình giải',
        desc: 'Phân tích bài toán thành các bài toán đơn giản quen thuộc; chọn kiến thức gần gũi để dự đoán kết quả.',
        tasks: [
          '• Chia nhỏ: Cần tính mẫu số $P(+)$ theo công thức Xác suất đầy đủ trước.',
          '• Áp dụng hệ đầy đủ $\{B, \\bar{B}\}$ với $P(B)+P(\\bar{B})=1$.',
          '• Liên hệ công thức Bayes: $P(B|+) = \\frac{P(B)P(+|B)}{P(+)}$.'
        ]
      },
      {
        num: 3,
        title: 'Bước 3: Trình bày lời giải',
        desc: 'Trình bày lại bài giải logic, chuẩn xác sau khi đã điều chỉnh những chỗ cần thiết từ chương trình giải.',
        tasks: [
          '• Gọi các biến cố: B là người mắc bệnh, + là kết quả dương tính.',
          '• Tính $P(+) = 0.01 \\times 0.98 + 0.99 \\times 0.03 = 0.0395$.',
          '• Tính $P(B|+) = \\frac{0.01 \\times 0.98}{0.0395} \\approx 24.81\\%$.'
        ]
      },
      {
        num: 4,
        title: 'Bước 4: Kiểm tra và nghiên cứu sâu',
        desc: 'Kiểm tra lại kết quả và các lập luận; rút ra tri thức phương pháp; tìm cách giải khác; khái quát hóa bài toán.',
        tasks: [
          '• Nhìn lại: Dù test có độ nhạy 98%, xác suất thực mắc bệnh chỉ ~25% do bệnh rất hiếm (1%). Đây là hiện tượng "Nghịch lý tỷ lệ nền" (Base rate fallacy).',
          '• Rút ra tri thức: Khi bệnh hiếm, cần xét nghiệm lặp lại lần 2 để khẳng định chẩn đoán.',
          '• Đề xuất bài toán tương tự: Bài toán kiểm định bộ lọc Spam email với tỷ lệ thư rác 5%.'
        ]
      }
    ]
  },
  concept: {
    title: 'Quy trình 4 Bước Học Khái niệm XSTK (Kiến tạo - Constructivism)',
    badge: 'Hiểu sâu bản chất',
    sampleTitle: 'Khái niệm "Kỳ vọng toán học E(X)"',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Trải nghiệm trực quan',
        desc: 'Tiếp cận dấu hiệu bản chất thông qua biểu tượng trực quan hoặc trải nghiệm thực tế.',
        tasks: [
          '• Tình huống thực tiễn: Một trò chơi tung đồng xu: ngửa nhận 100k, sấp mất 50k. Nếu chơi 1000 lần, trung bình mỗi ván bạn được bao nhiêu tiền?',
          '• Cảm nhận trực giác: Điểm cân bằng trọng tâm của các kết quả có tính đến xác suất.'
        ]
      },
      {
        num: 2,
        title: 'Bước 2: Hình thành định nghĩa khái niệm',
        desc: 'Nhận biết dấu hiệu đặc trưng; lĩnh hội thuật ngữ, kí hiệu và phát biểu bằng lời định nghĩa.',
        tasks: [
          '• Dấu hiệu đặc trưng: Tổng của tích giữa từng giá trị biến ngẫu nhiên với xác suất tương ứng của nó.',
          '• Kí hiệu then chốt: $E(X) = \\sum x_i p_i$ (rời rạc) hoặc $E(X) = \\int_{-\\infty}^{+\\infty} x f(x)dx$ (liên tục).',
          '• Ý nghĩa: Trọng tâm phân phối xác suất, giá trị trung bình theo lý thuyết khi số phép thử tiến tới vô cùng.'
        ]
      },
      {
        num: 3,
        title: 'Bước 3: Củng cố khái niệm',
        desc: 'Nhận diện khái niệm trong các trường hợp đơn giản và trong mối liên hệ logic với các khái niệm khác.',
        tasks: [
          '• Ví dụ quen thuộc: Tính kỳ vọng số chấm khi gieo xúc xắc: $E(X) = 1(1/6) + ... + 6(1/6) = 3.5$.',
          '• Liên hệ: Phân biệt Kỳ vọng lý thuyết $E(X)$ với Trung bình mẫu thực nghiệm $\\bar{x}$.'
        ]
      },
      {
        num: 4,
        title: 'Bước 4: Vận dụng vào thực tiễn',
        desc: 'Vận dụng khái niệm trong các tình huống gián tiếp, phức hợp hơn và giải quyết bài toán thực tế.',
        tasks: [
          '• Bài toán kinh doanh: Định phí bảo hiểm nhân thọ dựa trên kỳ vọng bồi thường rủi ro.',
          '• Bài toán tài chính: Tính tỷ suất sinh lời kỳ vọng của danh mục đầu tư cổ phiếu.'
        ]
      }
    ]
  },
  theorem: {
    title: 'Quy trình 4 Bước Học Định lí XSTK (Khám phá & Chứng minh)',
    badge: 'Cơ sở toán học',
    sampleTitle: 'Định lí Giới hạn Trung tâm (Central Limit Theorem - CLT)',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Trải nghiệm phát hiện',
        desc: 'Tiếp cận giả thiết và kết luận nhằm khơi gợi nhu cầu kiểm chứng hoặc chứng minh.',
        tasks: [
          '• Thí nghiệm mô phỏng: Lấy mẫu từ phân phối đều (xúc xắc) hoặc phân phối mũ bất kỳ. Tính trung bình mẫu $\\bar{x}$.',
          '• Quan sát: Khi kích thước mẫu $n \\ge 30$, đồ thị phân phối của $\\bar{x}$ luôn có hình chiếc chuông úp đối xứng kỳ lạ!'
        ]
      },
      {
        num: 2,
        title: 'Bước 2: Hình thành định lí & Chứng minh',
        desc: 'Nhận diện giả thiết, kết luận; cấu trúc logic và cách thức chứng minh định lí.',
        tasks: [
          '• Giả thiết (GT): $X_1, X_2, ..., X_n$ độc lập cùng phân phối với kỳ vọng $\\mu$, phương sai $\\sigma^2 < \\infty$.',
          '• Kết luận (KL): Khi $n \\to \\infty$, biến chuẩn hóa $Z = \\frac{\\bar{X} - \\mu}{\\sigma/\\sqrt{n}} \\xrightarrow{d} N(0, 1)$.',
          '• Luận cứ chứng minh: Sử dụng hàm sinh mô-men (MGF) hoặc hàm đặc trưng.'
        ]
      },
      {
        num: 3,
        title: 'Bước 3: Củng cố định lí',
        desc: 'Thực hành vận dụng định lí trong các trường hợp đơn giản đặc trưng.',
        tasks: [
          '• Quy tắc ngón tay cái: Trong thực tế ứng dụng thống kê, điều kiện $n \\ge 30$ thường đủ để xem $\\bar{X}$ có phân phối xấp xỉ chuẩn.'
        ]
      },
      {
        num: 4,
        title: 'Bước 4: Vận dụng thực tiễn',
        desc: 'Vận dụng định lí giải quyết bài toán suy diễn thống kê thực tế.',
        tasks: [
          '• Ứng dụng ước lượng: Xây dựng khoảng tin cậy cho trung bình tổng thể không cần biết phân phối gốc.',
          '• Ứng dụng kiểm định: Kiểm định chất lượng dây chuyền công nghiệp với mẫu lớn.'
        ]
      }
    ]
  }
};

function rPedagogy(a) {
  var type = ST.pedagogyType || 'solve';
  var data = PEDAGOGY_DATA[type] || PEDAGOGY_DATA.solve;
  var curStep = ST.pedagogyStep || 1;

  a.innerHTML = '<div class="space-y-4">' +
    '<div class="pc p-5 bg-white">' +
    '<div class="flex items-center gap-2 flex-wrap">' +
    '<span class="text-3xl">📘</span>' +
    '<div><h2 class="text-2xl font-black">Quy Trình Sư Phạm 4 Bước Chuẩn Hóa &amp; Meta-Engine (TN1 &amp; TN11)</h2>' +
    '<p class="text-xs font-bold text-gray-600">Dạy học Giải toán (George Pólya), Khái niệm &amp; Định lí (Kiến tạo) — Có công cụ nhân bản bài toán bất kỳ.</p></div></div>' +
    '<div class="flex gap-2 flex-wrap mt-4">' +
    '<button class="bt text-sm ' + (type === 'solve' ? 'on' : '') + '" onclick="setPedagogyType(\'solve\')">📐 1. Giải toán (4 bước Pólya)</button>' +
    '<button class="bt text-sm ' + (type === 'concept' ? 'on' : '') + '" onclick="setPedagogyType(\'concept\')">💡 2. Khái niệm (Kiến tạo)</button>' +
    '<button class="bt text-sm ' + (type === 'theorem' ? 'on' : '') + '" onclick="setPedagogyType(\'theorem\')">📜 3. Định lí (Khám phá)</button>' +
    '<button class="bt text-sm bg-[#D9C9FF] ' + (type === 'clone' ? 'on' : '') + '" onclick="setPedagogyType(\'clone\')">✨ 4. Nhân bản quy trình (TN11)</button></div></div>' +

    (type === 'clone' ? renderMetaEngineHTML() : renderPedagogyStepsHTML(data, curStep)) +
    '</div>';
  tx();
}

function setPedagogyType(t) {
  ST.pedagogyType = t;
  ST.pedagogyStep = 1;
  render();
}

function renderPedagogyStepsHTML(data, curStep) {
  var stepObj = data.steps[curStep - 1];
  return '<div class="pc p-5 bg-white">' +
    '<div class="flex items-center justify-between border-b-2 border-[#2D2A4A] pb-3">' +
    '<div><span class="tag bg-[#BFF1DC] mr-2">' + data.badge + '</span><b>' + data.title + '</b>' +
    '<div class="text-xs font-bold text-indigo-900 mt-1">📌 Bài học mẫu: ' + data.sampleTitle + '</div></div>' +
    '<div class="text-sm font-black">Bước ' + curStep + ' / 4</div></div>' +

    '<div class="grid grid-cols-4 gap-2 my-4">' +
    data.steps.map(function(s, idx) {
      var active = (idx + 1 === curStep);
      return '<button class="bt text-xs py-2 ' + (active ? 'on' : 'bg-white') + '" onclick="ST.pedagogyStep=' + (idx + 1) + ';render()">' +
        '<b>B' + (idx + 1) + '</b><br><span class="hidden md:inline">' + s.title.split(':')[1] + '</span></button>';
    }).join('') + '</div>' +

    '<div class="p-4 rounded-2xl bg-[#FFF1B8] border-2 border-[#2D2A4A]">' +
    '<h3 class="text-lg font-black">' + stepObj.title + '</h3>' +
    '<p class="text-sm font-bold text-gray-700 mt-1">' + stepObj.desc + '</p>' +
    '<div class="mt-3 space-y-1 text-sm font-medium">' +
    stepObj.tasks.map(function(t) { return '<div>' + t + '</div>'; }).join('') +
    '</div></div>' +

    '<div class="mt-4 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-[#2D2A4A]">' +
    '<b>✍️ Thực hành bước này cùng Giáo sư Cú Đêm (Socratic):</b>' +
    '<textarea id="pedagogyInput" rows="3" class="w-full mt-2 text-sm" placeholder="Nhập câu trả lời hoặc phân tích của bạn cho bước này..."></textarea>' +
    '<div class="flex gap-2 mt-2">' +
    '<button class="bt text-sm bg-[#BFF1DC]" onclick="checkPedagogyStep()">🦉 Nhờ Cú Đêm nhận xét tư duy</button>' +
    (curStep < 4 ? '<button class="bt text-sm ml-auto" onclick="ST.pedagogyStep++;render()">Qua bước tiếp theo ▶</button>' : '<button class="bt text-sm ml-auto bg-[#9BEFC8]" onclick="toast(\'🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn quy trình 4 bước!\')">🎉 Hoàn tất quy trình</button>') +
    '</div><div id="pedagogyFeedback" class="mt-3"></div></div></div>';
}

async function checkPedagogyStep() {
  var inp = $('#pedagogyInput'), txt = inp ? inp.value.trim() : '';
  var out = $('#pedagogyFeedback'); if (!out) return;
  if (!txt) return toast('Bạn hãy ghi phân tích của mình trước nhé ✍️');
  if (!KEY) {
    out.innerHTML = '<div class="pc p-3 bg-[#EFFFF8] text-sm font-bold">🦉 Nhận xét mẫu: Bạn đã nhận diện khá tốt các dữ kiện chính. Hãy chú ý kiểm tra thêm điều kiện độc lập của các biến cố trước khi áp dụng công thức nhé!</div>';
    return;
  }
  out.innerHTML = '<div class="pc p-3 bg-[#FFF1B8] font-bold">🦉 Giáo sư Cú Đêm đang phân tích tư duy của bạn theo quy trình...</div>';
  var type = ST.pedagogyType || 'solve';
  var data = PEDAGOGY_DATA[type];
  var curStep = ST.pedagogyStep || 1;
  var stepObj = data.steps[curStep - 1];

  var prompt = 'Nội dung: ' + data.title + ' - Bài học: ' + data.sampleTitle + '\n' +
    'Đang ở ' + stepObj.title + ' (' + stepObj.desc + ')\n' +
    'Bài làm của học sinh: ' + txt + '\n' +
    'NGUYÊN TẮC: Đóng vai Giáo sư Cú Đêm Socratic. Nhận xét xem học sinh làm đúng yêu cầu của bước này chưa. Chỉ ra chỗ tư duy tốt, chỗ còn sót và ĐẶT CÂU HỎI GỢI MỞ ĐỂ TỰ BỔ SUNG, TUYỆT ĐỐI KHÔNG ĐƯA SẴN LỜI GIẢI HOÀN CHỈNH. Dùng LaTeX $...$.';
  try {
    var res = await ai(prompt);
    out.innerHTML = '<div class="pc p-4 bg-[#EFFFF8] text-sm">' + res.replace(/\n/g, '<br>') + '</div>';
    tx();
  } catch (e) {
    out.innerHTML = '<div class="pc p-3 bg-[#FFD2D0]">Lỗi: ' + esc(e.message) + '</div>';
  }
}

function renderMetaEngineHTML() {
  return '<div class="pc p-5 bg-white">' +
    '<h3 class="text-xl font-black">✨ Meta Pedagogy Engine: Nhân Bản Quy Trình Sư Phạm 4 Bước (TN11)</h3>' +
    '<p class="text-xs font-bold text-gray-600 mt-1">Dán một bài toán, một khái niệm hoặc một định lí bất kỳ vào đây. AI sẽ tự động phân rã nó thành một bài học tương tác chuẩn 4 bước có ví dụ minh họa và bài tập củng cố:</p>' +
    '<div class="flex gap-2 flex-wrap mt-3">' +
    '<select id="cloneCat" class="text-sm">' +
    '<option value="solve">Dạng Bài Toán (4 bước Pólya)</option>' +
    '<option value="concept">Dạng Khái Niệm (4 bước Kiến tạo)</option>' +
    '<option value="theorem">Dạng Định Lí (4 bước Khám phá & Chứng minh)</option>' +
    '</select>' +
    '<input id="cloneTitle" class="flex-1 min-w-[200px] text-sm" placeholder="Tên bài toán / định lí (VD: Định lý Chebyshev, Phân phối Poisson)"></div>' +
    '<textarea id="cloneInput" rows="4" class="w-full mt-3 text-sm" placeholder="Dán nội dung bài toán, định lí hoặc khái niệm trên lớp của bạn vào đây..."></textarea>' +
    '<button class="bt w-full mt-3 bg-[#BFF1DC] font-black text-base py-2" onclick="generateClonedPedagogy()">🚀 AI Phân Rã &amp; Nhân Bản Thành Bài Học 4 Bước</button>' +
    '<div id="cloneResult" class="mt-4"></div></div>';
}

async function generateClonedPedagogy() {
  var cat = $('#cloneCat').value;
  var title = ($('#cloneTitle').value || 'Bài học tự tạo').trim();
  var content = ($('#cloneInput').value || '').trim();
  var out = $('#cloneResult'); if (!out) return;
  if (!content) return toast('Vui lòng dán nội dung bài toán hoặc khái niệm vào trước ✍️');

  if (!KEY) {
    out.innerHTML = '<div class="pc p-4 bg-[#FFF1B8] text-sm font-bold">🦉 Hãy nhập Gemini API Key ở thanh trên cùng để AI tự động phân rã bài toán của bạn thành tiến trình 4 bước tương tác nhé!</div>';
    return;
  }

  out.innerHTML = '<div class="pc p-4 bg-[#FFF1B8] font-bold">🦉 AI đang phân tích cấu trúc toán học và sinh bài học 4 bước tương tác...</div>';
  var catNames = { solve: 'Quy trình giải toán 4 bước của George Pólya', concept: 'Quy trình học khái niệm 4 bước kiến tạo', theorem: 'Quy trình học định lí 4 bước khám phá & chứng minh' };
  var prompt = 'Nhiệm vụ TN11: Phân rã nội dung sau thành bài học tương tác chuẩn theo ' + catNames[cat] + ':\n' +
    'Tiêu đề: ' + title + '\nNội dung: ' + content + '\n' +
    'YÊU CẦU ĐẦU RA: Chia rõ ràng đúng 4 bước. Mỗi bước gồm: 1. Mục tiêu bước; 2. Phân tích chi tiết nội dung tương ứng; 3. Câu hỏi tương tác để sinh viên tự thực hành; 4. Bẫy tư duy thường gặp. Sử dụng LaTeX $...$. Trả về dạng markdown đẹp.';
  try {
    var res = await ai(prompt, 'Bạn là Chuyên gia Thiết kế Sư phạm Toán học hiện đại.');
    out.innerHTML = '<div class="pc p-5 bg-[#EFFFF8]"><div class="flex items-center gap-2 mb-3"><span class="tag bg-[#BFF1DC]">Đã nhân bản thành công</span><b class="text-lg">' + esc(title) + '</b></div>' +
      '<div class="text-sm space-y-3 leading-relaxed">' + res.replace(/\n/g, '<br>') + '</div></div>';
    tx();
  } catch (e) {
    out.innerHTML = '<div class="pc p-3 bg-[#FFD2D0]">Lỗi: ' + esc(e.message) + '</div>';
  }
}
