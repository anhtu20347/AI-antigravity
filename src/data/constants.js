/* ===== CÁC HẰNG SỐ & DỮ LIỆU ĐỊNH NGHĨA HỆ THỐNG XSTK ===== */

// Tiện ích DOM & Storage
var $ = function(s){ return document.querySelector(s); };
var ls = {
  get: function(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
var tx = function(){ try{ if(window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise(); }catch(e){} };
var toast = function(m){
  var t = $('#toast'); if(!t) return;
  t.textContent = m; t.classList.remove('hidden');
  clearTimeout(toast.h); toast.h = setTimeout(function(){ t.classList.add('hidden'); }, 3200);
};
var esc = function(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
var attr = function(x){ return esc(x).replace(/"/g,'&quot;'); };

// Cấu hình AI
var KEY = '', MODEL = 'gemini-2.5-flash';

// Trạng thái ứng dụng toàn cục (State Management)
var ST = {
  view: 'home', 
  ch: 1, 
  type: 'all', 
  lv: 'all', 
  gen: [], 
  ex: null,
  cfg: { scope: 'all', n: 10, min: 15 }, 
  ui: {}, 
  tch: 1, 
  tlv: 'Vận dụng',
  cnt: 15, 
  pi: 0, 
  fdraft: '', 
  ftitle: '', 
  cd: {},
  activeChatUid: null, 
  dmDraft: '',
  // Thêm trạng thái cho Quy trình sư phạm 4 bước (TN1 & TN11)
  pedagogyType: 'solve', // 'solve' | 'concept' | 'theorem' | 'clone'
  pedagogyStep: 1,
  pedagogySubject: '',
  pedagogyHistory: [],
  // Thêm trạng thái cho Khảo hạch Vấn đáp (TN6)
  oralScore: null,
  oralFeedback: '',
  oralTopic: 'CLT'
};

var QM = {};
var LB = ['A','B','C','D'];

// Danh mục 7 chương Xác suất & Thống kê bậc Đại học
var CH = [
  'Xác suất và công thức tính xác suất',
  'Biến ngẫu nhiên',
  'Phân phối xác suất của biến ngẫu nhiên',
  'Mẫu ngẫu nhiên và các số đặc trưng của mẫu',
  'Khoảng ước lượng',
  'Kiểm định giả thuyết trong thống kê',
  'So sánh 2 tham số'
];

// Menu điều hướng 8 màn hình chức năng (bao gồm đủ 11 tính năng)
var NAV = [
  ['home', '🏠 Trang chủ'],
  ['pedagogy', '📘 Sư phạm 4 bước'],
  ['practice', '🎯 Luyện tập 3D'],
  ['exam', '⏰ Thi thử bấm giờ'],
  ['tutor', '✍️ AI Tutor & iPad'],
  ['oral', '🎙️ Khảo hạch Vấn đáp'],
  ['stats', '🎓 Hồ sơ & Lỗi sai'],
  ['forum', '🌐 Diễn đàn 100% người thật']
];

var MODES = { mcq: 'Trắc nghiệm', essay: 'Tự luận', exam: 'Thi thử', oral: 'Vấn đáp' };

// Barem chấm điểm chuẩn 4 tiêu chí XSTK (Thang điểm 10)
var RUBRIC = [
  { k: 'Nhận diện dạng toán & gọi tên biến cố/biến ngẫu nhiên', p: 2.0 },
  { k: 'Thiết lập đúng công thức toán học phù hợp', p: 3.0 },
  { k: 'Quá trình thay số & tính toán chuẩn xác', p: 3.5 },
  { k: 'Kết luận ý nghĩa thực tế & điều kiện ràng buộc', p: 1.5 }
];

var TITLES = ['Cú Đêm Tập Sự', 'Cú Đêm Chăm Chỉ', 'Cú Đêm Thông Thái', 'Giáo Sư Cú Đêm'];
var REACTS = [['like', '👍 Thích'], ['love', '❤️ Yêu thích'], ['wow', '🤯 Xoắn não']];
var LBL = [
  ['📌 Dạng toán', '#D9C9FF'],
  ['📋 Dữ kiện đề cho', '#BFF1DC'],
  ['🧮 Công thức cốt lõi', '#FFD2D0'],
  ['🪜 Các bước giải & ⚠️ Bẫy hay sai', '#FFF1B8']
];

var VIZ_LIST = ['factory_3d','dice_3d','bellcurve_3d','medical_3d','finance_3d','queue_3d','sampling_3d','abtest_3d','dice_cards_3d'];

// Dữ liệu tiến độ học tập & hồ sơ lưu trữ
var prog = ls.get('prog', { done: [], streak: 1, last: '' });
var PROF = ls.get('prof', { name: '', sid: '', cls: '', title: 'Cú Đêm Tập Sự', email: '', photo: '' });
var ATT = ls.get('att', {});
var miss = ls.get('miss', []);

// Bộ nhớ đệm bảng vẽ iPad
var PSTK = [], last = [0, 0], down = false, upFile = null, PADIMG = '';
var PEN = { c: '#2D2A4A', w: 4, e: 0 };
