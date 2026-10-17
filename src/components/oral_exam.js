/* ===== COMPONENT PHÒNG KHẢO HẠCH VẤN ĐÁP LÝ THUYẾT (TN6) ===== */

var ORAL_TOPICS = [
  { id: 't1', ch: 1, title: 'Ý nghĩa thực tế của Công thức Xác suất đầy đủ & Công thức Bayes', q: 'Tại sao khi một căn bệnh có tỷ lệ mắc rất thấp trong cộng đồng thì một xét nghiệm có độ chính xác 99% vẫn cho tỷ lệ dương tính giả rất cao? Bản chất toán học ở đây là gì?' },
  { id: 't2', ch: 2, title: 'Bản chất của Kỳ vọng E(X) và Phương sai Var(X)', q: 'Giải thích sự khác biệt giữa Kỳ vọng toán học E(X) và Trung bình số học. Tại sao trong đầu tư tài chính người ta lại dùng Phương sai để đo lường mức độ rủi ro?' },
  { id: 't3', ch: 3, title: 'Định lí Giới hạn Trung tâm (CLT) & Ứng dụng', q: 'Phát biểu ý nghĩa cốt lõi của Định lí Giới hạn Trung tâm. Vì sao phân phối Chuẩn lại xuất hiện ở khắp mọi nơi trong tự nhiên và kinh tế xã hội?' },
  { id: 't4', ch: 4, title: 'Phương sai mẫu hiệu chỉnh s² và bậc tự do (n - 1)', q: 'Tại sao khi tính phương sai mẫu người ta lại phải chia cho (n - 1) thay vì chia cho n? Thế nào là một ước lượng không chệch?' },
  { id: 't5', ch: 5, title: 'Bản chất của Khoảng tin cậy 95%', q: 'Nói rằng "Khoảng tin cậy 95% cho chiều cao trung bình là (165cm; 170cm)" có đồng nghĩa với việc "có 95% xác suất chiều cao trung bình thực tế nằm trong khoảng này" không? Hãy chỉ ra sai lầm phổ biến ở câu này.' },
  { id: 't6', ch: 6, title: 'Sai lầm loại 1, Sai lầm loại 2 & Mức ý nghĩa alpha', q: 'Thế nào là Sai lầm loại 1 (bác bỏ đúng) và Sai lầm loại 2 (chấp nhận sai) trong kiểm định giả thuyết? Trong xét nghiệm tội phạm tại tòa án, sai lầm nào được xem là nghiêm trọng hơn?' }
];

function rOral(a) {
  var curTopic = ORAL_TOPICS.find(function(t) { return t.id === ST.oralTopic; }) || ORAL_TOPICS[0];
  ST.oralTopic = curTopic.id;

  a.innerHTML = '<div class="space-y-4">' +
    '<div class="pc p-5 bg-white">' +
    '<div class="flex items-center gap-3 flex-wrap">' +
    '<span class="text-3xl">🎙️</span>' +
    '<div><h2 class="text-2xl font-black">Phòng Khảo Hạch Vấn Đáp Lý Thuyết XSTK (TN6)</h2>' +
    '<p class="text-xs font-bold text-gray-600">Khảo hạch phản xạ lý thuyết: AI phỏng vấn vấn đáp, chấm điểm tư duy và chỉ mặt điểm tên lỗ hổng kiến thức.</p></div></div>' +

    '<div class="mt-4">' +
    '<label class="block text-sm font-bold">Chọn chủ đề khảo hạch vấn đáp:</label>' +
    '<select class="w-full mt-1" onchange="ST.oralTopic=this.value;ST.oralScore=null;ST.oralFeedback=\'\';render()">' +
    ORAL_TOPICS.map(function(t) {
      return '<option value="' + t.id + '" ' + (t.id === curTopic.id ? 'selected' : '') + '>Chương ' + t.ch + ' · ' + t.title + '</option>';
    }).join('') +
    '</select></div></div>' +

    '<div class="pc p-5 bg-[#F3EEFF] border-2 border-[#2D2A4A]">' +
    '<span class="tag bg-[#D9C9FF]">Câu hỏi khảo hạch từ Giáo sư Cú Đêm:</span>' +
    '<div class="text-lg font-black mt-2 text-[#2D2A4A]">🦉 "' + curTopic.q + '"</div>' +
    '<div class="mt-3 flex gap-2 flex-wrap items-center">' +
    '<button class="bt text-sm bg-white" onclick="speak(\'' + attr(curTopic.q) + '\')">🔊 Nghe câu hỏi của Cú Đêm</button>' +
    '<span class="text-xs font-bold text-gray-600">Bạn có thể trả lời bằng cách nói qua Micro hoặc gõ vào ô bên dưới:</span></div>' +

    vBlock('oral', curTopic.id, false) +

    '<div class="mt-4">' +
    '<label class="block text-sm font-bold">Nội dung câu trả lời của bạn:</label>' +
    '<textarea id="oralAnswer" rows="4" class="w-full mt-1 text-sm" placeholder="Trình bày quan điểm, lập luận và giải thích bản chất toán học của bạn..."></textarea>' +
    '<button class="bt w-full mt-3 bg-[#BFF1DC] font-black text-base py-2" onclick="gradeOralExam(\'' + curTopic.id + '\')">🎯 Nộp Câu Trả Lời &amp; Nhờ AI Chấm Điểm Vấn Đáp</button>' +
    '</div>' +

    '<div id="oralResult" class="mt-4">' + (ST.oralFeedback ? ST.oralFeedback : '') + '</div></div></div>';
  tx();
}

async function gradeOralExam(topicId) {
  var curTopic = ORAL_TOPICS.find(function(t) { return t.id === topicId; }) || ORAL_TOPICS[0];
  var ansInp = $('#oralAnswer');
  var ansText = (ansInp ? ansInp.value : '').trim();
  var out = $('#oralResult'); if (!out) return;
  if (!ansText) return toast('Vui lòng nói qua micro hoặc gõ câu trả lời của bạn trước nhé 🎙️');

  if (!KEY) {
    var sampleFeedback = '<div class="pc p-4 bg-[#EFFFF8]">' +
      '<h4 class="font-black text-lg text-emerald-900">Điểm đánh giá vấn đáp: 7.5 / 10</h4>' +
      '<div class="mt-2 text-sm leading-relaxed">' +
      '<b>✅ Điểm mạnh:</b> Bạn đã nắm được khái niệm cơ bản về tỷ lệ nền và sự phụ thuộc điều kiện.<br>' +
      '<b>⚠️ Lỗ hổng nhận thức phát hiện:</b> Chưa phân biệt rạch ròi giữa $P(B|+)$ và $P(+|B)$, dẫn đến nhầm lẫn giữa độ nhạy của test và xác suất thực mắc bệnh.<br>' +
      '<b>🎯 Đề xuất khắc phục:</b> Hãy xem lại Quy trình 4 bước giải toán Bayes ở tab "Sư phạm 4 bước".' +
      '</div></div>';
    ST.oralFeedback = sampleFeedback;
    out.innerHTML = sampleFeedback;
    recordOralMistake(curTopic, 'Hiểu chưa chuẩn về Base rate fallacy trong Bayes', 7.5);
    return;
  }

  out.innerHTML = '<div class="pc p-4 bg-[#FFF1B8] font-bold">🦉 Giáo sư Cú Đêm đang phân tích câu trả lời vấn đáp của bạn...</div>';
  var prompt = 'Nhiệm vụ TN6: Khảo hạch vấn đáp lý thuyết Xác suất Thống kê.\n' +
    'Chủ đề: ' + curTopic.title + '\nCâu hỏi: ' + curTopic.q + '\n' +
    'Câu trả lời của sinh viên: ' + ansText + '\n' +
    'YÊU CẦU ĐÁNH GIÁ:\n' +
    '1. Chấm điểm trên thang 10 (Ghi rõ "Điểm đánh giá vấn đáp: X/10").\n' +
    '2. Nhận xét điểm mạnh trong tư duy.\n' +
    '3. CHỈ MẶT ĐIỂM TÊN LỖ HỔNG KIẾN THỨC VÀ SAI LẦM NHẬN THỨC (Misconceptions) nếu có.\n' +
    '4. Đưa ra hướng giải thích chuẩn xác bản chất toán học kèm ví dụ trực quan. Dùng LaTeX $...$.';
  try {
    var res = await ai(prompt, 'Bạn là Trưởng bộ môn Xác suất Thống kê khảo hạch vấn đáp công tâm, sắc bén.');
    var feedbackHTML = '<div class="pc p-4 bg-[#EFFFF8] text-sm leading-relaxed">' + res.replace(/\n/g, '<br>') + '</div>';
    ST.oralFeedback = feedbackHTML;
    out.innerHTML = feedbackHTML;
    var sc = scoreOf(res) || 7.0;
    if (sc < 8.0) {
      recordOralMistake(curTopic, 'Lỗ hổng lý thuyết vấn đáp: ' + curTopic.title, sc);
    }
    tx();
  } catch (e) {
    out.innerHTML = '<div class="pc p-3 bg-[#FFD2D0]">Lỗi: ' + esc(e.message) + '</div>';
  }
}

function recordOralMistake(topic, errorDesc, score) {
  var id = 'oral_' + topic.id + '_' + Date.now();
  miss.push({
    id: id,
    ch: topic.ch,
    mode: 'oral',
    q: '[Vấn đáp Ch' + topic.ch + '] ' + topic.title,
    ans: errorDesc + ' (Điểm: ' + score + '/10)',
    date: Date.now()
  });
  ls.set('miss', miss);
  recAtt({ ch: topic.ch }, score >= 5.0);
}
