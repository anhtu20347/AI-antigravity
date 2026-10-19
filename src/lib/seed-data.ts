import { Topic, QuizQuestion } from '@/types';

export const SEED_TOPICS: Topic[] = [
  {
    id: 'bayes_test',
    title: 'Quy trình giải bài toán Công thức Bayes trong Y tế (4 Bước Pólya)',
    type: 'solve',
    chapter: 1,
    content_json: {
      four_steps: [
        {
          step: 1,
          title: 'Bước 1: Tìm hiểu nội dung bài toán',
          objective: 'Phân biệt cái đã cho, cái phải tìm và cái phải chứng minh. Diễn đạt các biến cố bằng ký hiệu toán học.',
          content: 'Đề bài: Xét nghiệm một bệnh hiếm có tỷ lệ mắc 1% trong cộng đồng. Độ nhạy của xét nghiệm là 98% (có bệnh thì dương tính), và tỷ lệ dương tính giả là 3% (không bệnh nhưng vẫn dương tính). Nếu một người nhận kết quả dương tính, xác suất người này thực sự mắc bệnh là bao nhiêu?\n\n• Cái đã cho: $P(B) = 0{,}01$, $P(+|B) = 0{,}98$, $P(+|\\bar{B}) = 0{,}03$.\n• Cái cần tìm: Xác suất hậu nghiệm $P(B|+)$.\n• Điều kiện: Hệ đầy đủ $\{B, \\bar{B}\}$ với $P(B) + P(\\bar{B}) = 1$.',
          interactive_prompt: 'Hãy gọi tên các biến cố và viết biểu thức toán học xác suất cần tìm.',
          tips: 'Luôn kiểm tra xem các biến cố có tạo thành một hệ đầy đủ hay không trước khi giải.'
        },
        {
          step: 2,
          title: 'Bước 2: Xây dựng chương trình giải',
          objective: 'Phân tích bài toán thành các bài toán đơn giản quen thuộc; liên hệ công thức xác suất đầy đủ và công thức Bayes.',
          content: 'Kế hoạch giải quyết gồm 2 giai đoạn:\n1. Tính xác suất toàn phần của mẫu số $P(+)$ theo công thức xác suất đầy đủ:\n$$P(+) = P(B)P(+|B) + P(\\bar{B})P(+|\\bar{B})$$\n2. Áp dụng định lí Bayes để tính tỷ lệ nhánh $B$ trong tổng các trường hợp dương tính:\n$$P(B|+) = \\frac{P(B)P(+|B)}{P(+)}$$',
          interactive_prompt: 'Dự đoán trước xem $P(B|+)$ sẽ cao (trên 90%) hay thấp? Vì sao?',
          tips: 'Cẩn thận với trực giác sai lầm: Test 98% chính xác không có nghĩa là người dương tính có 98% khả năng mắc bệnh!'
        },
        {
          step: 3,
          title: 'Bước 3: Trình bày lời giải',
          objective: 'Thực hiện các phép tính logic, chuẩn xác và kiểm soát từng bước trung gian.',
          content: '• Tính $P(\\bar{B}) = 1 - 0{,}01 = 0{,}99$.\n• Xác suất nhận kết quả dương tính là:\n$$P(+) = 0{,}01 \\times 0{,}98 + 0{,}99 \\times 0{,}03 = 0{,}0098 + 0{,}0297 = 0{,}0395$$\n• Áp dụng công thức Bayes:\n$$P(B|+) = \\frac{0{,}0098}{0{,}0395} \\approx 0{,}2481 \\text{ (tức khoảng } 24{,}81\\%)$$',
          interactive_prompt: 'Tự bấm máy tính và kiểm tra lại phép chia thương số $0{,}0098 / 0{,}0395$.',
          tips: 'Giữ ít nhất 4 chữ số thập phân ở các bước trung gian để tránh sai số lũy tiến.'
        },
        {
          step: 4,
          title: 'Bước 4: Kiểm tra và nghiên cứu sâu',
          objective: 'Nhìn lại toàn bộ lời giải, rút ra tri thức phương pháp và đề xuất bài toán tương tự.',
          content: '• Nhìn lại: Dù test có độ nhạy 98%, khả năng thực sự mắc bệnh chỉ ~24,8% do bệnh quá hiếm (tỷ lệ nền 1%). Lượng người khỏe bị dương tính giả (0,0297) áp đảo lượng người bệnh thực sự (0,0098).\n• Tri thức phương pháp: Hiện tượng "Nghịch lý tỷ lệ nền" (Base Rate Fallacy). Trong thực hành y khoa, bác sĩ luôn yêu cầu xét nghiệm lần 2 độc lập.\n• Bài toán tương tự: Bộ lọc thư rác Spam Filter trong Email hoặc hệ thống cảnh báo gian lận thẻ tín dụng.',
          interactive_prompt: 'Nếu xét nghiệm lần 2 vẫn dương tính, xác suất mắc bệnh lúc này là bao nhiêu?',
          tips: 'Lấy kết quả 24,81% của lần 1 làm xác suất tiên nghiệm mới cho lần xét nghiệm thứ 2!'
        }
      ]
    },
    mindmap_json: {
      root: 'Công thức Bayes & Xác suất đầy đủ',
      nodes: [
        { id: '1', label: '1. Dạng toán', category: 'category', color: '#D9C9FF' },
        { id: '1a', label: 'Xác suất hậu nghiệm P(Ai|B)', category: 'detail' },
        { id: '1b', label: 'Nghịch lý tỷ lệ nền Base Rate', category: 'detail' },
        { id: '2', label: '2. Dữ kiện', category: 'category', color: '#BFF1DC' },
        { id: '2a', label: 'Hệ đầy đủ {A1, A2, ..., An}', category: 'detail' },
        { id: '2b', label: 'Xác suất tiên nghiệm P(Ai)', category: 'detail' },
        { id: '2c', label: 'Xác suất điều kiện P(B|Ai)', category: 'detail' },
        { id: '3', label: '3. Công thức', category: 'category', color: '#FFD2D0' },
        { id: '3a', label: 'P(B) = ∑ P(Ai)P(B|Ai)', category: 'formula' },
        { id: '3b', label: 'P(Ai|B) = [P(Ai)P(B|Ai)] / P(B)', category: 'formula' },
        { id: '4', label: '4. Bẫy hay gặp', category: 'category', color: '#FFF1B8' },
        { id: '4a', label: 'Nhầm lẫn giữa P(B|A) và P(A|B)', category: 'detail' },
        { id: '4b', label: 'Quên kiểm tra tổng xác suất hệ đầy đủ = 1', category: 'detail' }
      ],
      edges: [
        { from: 'root', to: '1' },
        { from: '1', to: '1a' },
        { from: '1', to: '1b' },
        { from: 'root', to: '2' },
        { from: '2', to: '2a' },
        { from: '2', to: '2b' },
        { from: '2', to: '2c' },
        { from: 'root', to: '3' },
        { from: '3', to: '3a' },
        { from: '3', to: '3b' },
        { from: 'root', to: '4' },
        { from: '4', to: '4a' },
        { from: '4', to: '4b' }
      ]
    }
  },
  {
    id: 'expectation_concept',
    title: 'Quy trình học Khái niệm Kỳ vọng toán học E(X) (Kiến tạo)',
    type: 'concept',
    chapter: 2,
    content_json: {
      four_steps: [
        {
          step: 1,
          title: 'Bước 1: Trải nghiệm',
          objective: 'Tiếp cận các dấu hiệu bản chất thông qua biểu tượng trực quan hoặc trải nghiệm thực tiễn.',
          content: 'Tình huống thực tế: Bạn tham gia trò chơi tung đồng xu cân đối. Nếu mặt Ngửa xuất hiện, bạn nhận 100.000đ; nếu mặt Sấp, bạn mất 60.000đ.\n• Nếu chơi 1.000 ván, trung bình mỗi ván bạn lời hay lỗ bao nhiêu tiền?\n• Trực giác: Trung bình = $100.000 \\times 0{,}5 + (-60.000) \\times 0{,}5 = +20.000$ đ/ván.\nKỳ vọng chính là điểm cân bằng lý thuyết của kết quả khi thực hiện phép thử vô số lần.',
          interactive_prompt: 'Nếu muốn nhà cái hòa vốn, số tiền mất khi xuất hiện mặt Sấp phải là bao nhiêu?',
          tips: 'Cảm nhận kỳ vọng như trọng tâm của một thanh gỗ có gắn các quả cân xác suất.'
        },
        {
          step: 2,
          title: 'Bước 2: Hình thành định nghĩa khái niệm',
          objective: 'Nhận biết dấu hiệu bản chất, phát biểu định nghĩa bằng lời và ghi nhớ thuật ngữ, công thức cốt lõi.',
          content: 'Định nghĩa: Kỳ vọng của biến ngẫu nhiên $X$ (ký hiệu $E(X)$ hoặc $\\mu$) là giá trị trung bình theo nghĩa xác suất của $X$.\n\n• Biến rời rạc:\n$$E(X) = \\sum_{i} x_i P(X = x_i)$$\n• Biến liên tục (với hàm mật độ $f(x)$):\n$$E(X) = \\int_{-\\infty}^{+\\infty} x f(x) dx$$\n• Tính chất quan trọng: Tuyến tính $E(aX + b) = aE(X) + b$; và nếu $X, Y$ độc lập thì $E(XY) = E(X)E(Y)$.',
          interactive_prompt: 'Giải thích bằng lời: Vì sao trong công thức rời rạc ta lại nhân mỗi giá trị $x_i$ với xác suất $p_i$ tương ứng?',
          tips: 'Kỳ vọng là một số thực cố định, không phải là một biến ngẫu nhiên!'
        },
        {
          step: 3,
          title: 'Bước 3: Củng cố',
          objective: 'Nhận diện khái niệm trong các trường hợp đơn giản đặc trưng và trong mối liên hệ với các khái niệm khác.',
          content: 'Ví dụ đơn giản: Gieo xúc xắc 6 mặt cân đối. Biến ngẫu nhiên $X \\in \\{1, 2, 3, 4, 5, 6\\}$ cùng xác suất $1/6$.\n$$E(X) = 1(1/6) + 2(1/6) + ... + 6(1/6) = \\frac{21}{6} = 3{,}5$$\nLưu ý: Không bao giờ có lần gieo nào ra 3,5 chấm, nhưng 3,5 là giá trị kỳ vọng trung bình lâu dài!\n\nPhân biệt: Kỳ vọng lý thuyết $E(X)$ (tham số tổng thể) khác với Trung bình mẫu $\\bar{x}$ (thống kê ngẫu nhiên tính từ dữ liệu khảo sát).',
          interactive_prompt: 'Tính $E(2X + 1)$ của con xúc xắc trên bằng tính chất tuyến tính.',
          tips: 'Dùng $E(2X + 1) = 2E(X) + 1 = 2(3,5) + 1 = 8$.'
        },
        {
          step: 4,
          title: 'Bước 4: Vận dụng vào thực tiễn',
          objective: 'Vận dụng khái niệm kỳ vọng vào các bài toán kinh tế, tài chính và ra quyết định thực tế.',
          content: '1. Định phí bảo hiểm: Một công ty bán bảo hiểm xe máy phí 200.000đ/năm. Xác suất tai nạn bồi thường 10.000.000đ là 1%. Lợi nhuận kỳ vọng của công ty trên mỗi hợp đồng là:\n$$E(\\text{Lợi nhuận}) = 200.000 - 10.000.000 \\times 0{,}01 = +100.000 \\text{ đ}$$\n2. Đầu tư tài chính: So sánh tỷ suất sinh lời kỳ vọng giữa hai danh mục cổ phiếu trước khi phân bổ vốn.',
          interactive_prompt: 'Tại sao công ty bảo hiểm luôn cần số lượng hợp đồng đủ lớn để kỳ vọng phát huy tác dụng?',
          tips: 'Đó chính là do Định luật số lớn (Law of Large Numbers) bảo đảm trung bình thực tế hội tụ về kỳ vọng lý thuyết.'
        }
      ]
    },
    mindmap_json: {
      root: 'Kỳ vọng toán học E(X)',
      nodes: [
        { id: '1', label: '1. Bản chất', category: 'category', color: '#D9C9FF' },
        { id: '1a', label: 'Trọng tâm của phân phối xác suất', category: 'detail' },
        { id: '1b', label: 'Giá trị trung bình dài hạn', category: 'detail' },
        { id: '2', label: '2. Công thức tính', category: 'category', color: '#BFF1DC' },
        { id: '2a', label: 'Rời rạc: E(X) = ∑ xi * pi', category: 'formula' },
        { id: '2b', label: 'Liên tục: E(X) = ∫ x*f(x)dx', category: 'formula' },
        { id: '3', label: '3. Tính chất', category: 'category', color: '#FFD2D0' },
        { id: '3a', label: 'E(c) = c (hằng số)', category: 'formula' },
        { id: '3b', label: 'E(aX + b) = a*E(X) + b', category: 'formula' },
        { id: '3c', label: 'E(X + Y) = E(X) + E(Y)', category: 'formula' },
        { id: '4', label: '4. Ứng dụng thực tế', category: 'category', color: '#FFF1B8' },
        { id: '4a', label: 'Định phí bảo hiểm rủi ro', category: 'detail' },
        { id: '4b', label: 'Kỳ vọng sinh lời danh mục đầu tư', category: 'detail' }
      ],
      edges: [
        { from: 'root', to: '1' },
        { from: '1', to: '1a' },
        { from: '1', to: '1b' },
        { from: 'root', to: '2' },
        { from: '2', to: '2a' },
        { from: '2', to: '2b' },
        { from: 'root', to: '3' },
        { from: '3', to: '3a' },
        { from: '3', to: '3b' },
        { from: '3', to: '3c' },
        { from: 'root', to: '4' },
        { from: '4', to: '4a' },
        { from: '4', to: '4b' }
      ]
    }
  },
  {
    id: 'clt_theorem',
    title: 'Quy trình học Định lí Giới hạn Trung tâm (CLT) (Khám phá & Chứng minh)',
    type: 'theorem',
    chapter: 3,
    content_json: {
      four_steps: [
        {
          step: 1,
          title: 'Bước 1: Trải nghiệm phát hiện',
          objective: 'Tiếp cận trực tiếp các yếu tố giả thiết và kết luận, khơi gợi nhu cầu kiểm chứng.',
          content: 'Thí nghiệm thực tế:\n• Giả sử bạn lấy mẫu kích thước $n$ từ một tổng thể có phân phối bất kỳ (phân phối đều, phân phối lệch, phân phối Poisson...).\n• Tính trung bình mẫu $\\bar{X} = \\frac{1}{n}\\sum X_i$.\n• Lặp lại việc lấy mẫu 1.000 lần và vẽ biểu đồ tần số của $\\bar{X}$.\nKết quả kỳ diệu: Khi $n \\ge 30$, đồ thị của $\\bar{X}$ luôn có hình dạng chiếc chuông úp đối xứng của Phân phối Chuẩn, bất chấp phân phối gốc ban đầu kỳ dị đến mức nào!',
          interactive_prompt: 'Tại sao việc tổng hợp nhiều yếu tố ngẫu nhiên độc lập lại triệt tiêu tính bất đối xứng ban đầu?',
          tips: 'Cảm nhận sự cân bằng vĩ mô được tạo nên từ vô số vi hạt ngẫu nhiên độc lập.'
        },
        {
          step: 2,
          title: 'Bước 2: Hình thành định lí & Chứng minh',
          objective: 'Nhận diện chính xác giả thiết (GT), kết luận (KL), cấu trúc logic và phương pháp chứng minh.',
          content: 'Nội dung Định lí (Lindeberg-Lévy CLT):\n• Giả thiết (GT): Cho $X_1, X_2, ..., X_n$ là các biến ngẫu nhiên độc lập, cùng phân phối (i.i.d) có kỳ vọng $\\mu$ và phương sai $\\sigma^2 < \\infty$.\n• Kết luận (KL): Khi $n \\to \\infty$, phân phối của biến chuẩn hóa:\n$$Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}} \\xrightarrow{d} N(0, 1)$$\n• Hoặc tương đương: $\\bar{X} \\approx N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$ và Tổng $S_n = \\sum X_i \\approx N(n\\mu, n\\sigma^2)$.\n• Luận cứ chứng minh: Sử dụng hàm đặc trưng (Characteristic Functions) hoặc khai triển Taylor của hàm sinh mô-men.',
          interactive_prompt: 'Chỉ rõ sự khác nhau giữa độ lệch chuẩn của một quan sát ($\\sigma$) và độ lệch chuẩn của trung bình mẫu ($\\sigma/\\sqrt{n}$).',
          tips: 'Mẫu càng lớn ($n$ tăng), sai số chuẩn $\\sigma/\\sqrt{n}$ càng nhỏ, phân phối trung bình mẫu càng nhọn và chụm quanh $\\mu$.'
        },
        {
          step: 3,
          title: 'Bước 3: Củng cố định lí',
          objective: 'Vận dụng định lí trong các trường hợp đơn giản đặc trưng.',
          content: 'Quy tắc ngón tay cái trong thực hành thống kê:\n• Nếu tổng thể ban đầu đã có phân phối Chuẩn: $\\bar{X}$ có phân phối chuẩn với mọi cỡ mẫu $n$.\n• Nếu tổng thể không chuẩn nhưng có dạng đối xứng: chỉ cần $n \\ge 15$.\n• Nếu tổng thể bị lệch nhiều: cần $n \\ge 30$ để áp dụng xấp xỉ Chuẩn an toàn.\n\nVí dụ: Tuổi thọ bóng đèn có trung bình $\\mu = 1000$ giờ, $\\sigma = 80$ giờ. Khảo sát $n = 64$ bóng. Xác suất tuổi thọ trung bình $\\bar{X} > 1020$ giờ là:\n$$Z = \\frac{1020 - 1000}{80 / \\sqrt{64}} = \\frac{20}{10} = 2 \\implies P(Z > 2) = 1 - \\Phi(2) \\approx 0{,}0228$$',
          interactive_prompt: 'Tại sao mẫu 64 bóng giúp sai số chuẩn giảm về đúng 10 giờ?',
          tips: 'Vì $\\sigma / \\sqrt{n} = 80 / \\sqrt{64} = 80 / 8 = 10$.'
        },
        {
          step: 4,
          title: 'Bước 4: Vận dụng thực tiễn',
          objective: 'Vận dụng định lí CLT vào xây dựng khoảng ước lượng và bài toán kiểm định giả thuyết.',
          content: 'Ý nghĩa vĩ đại của CLT trong Thống kê hiện đại:\n1. Giải thích sự tồn tại của Phân phối Chuẩn: Chiều cao, cân nặng, sai số đo lường, chỉ số IQ đều chịu tác động của hàng ngàn gen và yếu tố môi trường cộng gộp lại.\n2. Cơ sở cho Thống kê suy diễn: Chúng ta có thể ước lượng khoảng tin cậy 95% cho trung bình tổng thể $\\mu \\in \\left(\\bar{x} - 1{,}96\\frac{s}{\\sqrt{n}}, \\bar{x} + 1{,}96\\frac{s}{\\sqrt{n}}\\right)$ với mẫu lớn $n \\ge 30$ mà không cần biết phân phối gốc của tổng thể là gì!',
          interactive_prompt: 'Nếu không có định lí CLT, ngành Thống kê suy diễn sẽ gặp khó khăn gì?',
          tips: 'Nếu không có CLT, chúng ta sẽ không thể áp dụng bảng tra Z cho các mẫu dữ liệu thực tế!'
        }
      ]
    },
    mindmap_json: {
      root: 'Định lí Giới hạn Trung tâm (CLT)',
      nodes: [
        { id: '1', label: '1. Giả thiết (GT)', category: 'category', color: '#D9C9FF' },
        { id: '1a', label: 'Các biến Xi độc lập cùng phân phối (i.i.d)', category: 'detail' },
        { id: '1b', label: 'Kỳ vọng μ và phương sai σ² hữu hạn', category: 'detail' },
        { id: '2', label: '2. Kết luận (KL)', category: 'category', color: '#BFF1DC' },
        { id: '2a', label: 'Z = (x̄ - μ) / (σ/√n) -> N(0, 1)', category: 'formula' },
        { id: '2b', label: 'x̄ ~ N(μ, σ²/n)', category: 'formula' },
        { id: '2c', label: 'Tổng Sn ~ N(nμ, nσ²)', category: 'formula' },
        { id: '3', label: '3. Điều kiện thực tế', category: 'category', color: '#FFD2D0' },
        { id: '3a', label: 'Quy tắc mẫu lớn n ≥ 30', category: 'detail' },
        { id: '3b', label: 'Sai số chuẩn SE = σ / √n giảm theo √n', category: 'formula' },
        { id: '4', label: '4. Ứng dụng cốt lõi', category: 'category', color: '#FFF1B8' },
        { id: '4a', label: 'Cơ sở xây dựng khoảng tin cậy mẫu lớn', category: 'detail' },
        { id: '4b', label: 'Cơ sở thực hiện kiểm định Z-test', category: 'detail' }
      ],
      edges: [
        { from: 'root', to: '1' },
        { from: '1', to: '1a' },
        { from: '1', to: '1b' },
        { from: 'root', to: '2' },
        { from: '2', to: '2a' },
        { from: '2', to: '2b' },
        { from: '2', to: '2c' },
        { from: 'root', to: '3' },
        { from: '3', to: '3a' },
        { from: '3', to: '3b' },
        { from: 'root', to: '4' },
        { from: '4', to: '4a' },
        { from: '4', to: '4b' }
      ]
    }
  }
];

export const SEED_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    chapter: 1,
    topic_id: 'bayes_test',
    question: 'Gieo một con xúc xắc 6 mặt cân đối đồng chất. Xác suất xuất hiện mặt có số chấm là số nguyên tố là bao nhiêu?',
    options: ['1/6', '1/3', '1/2', '2/3'],
    correct_index: 2,
    explanation: 'Các số nguyên tố trên mặt xúc xắc gồm có: 2, 3, 5 (3 mặt). Không gian mẫu có 6 mặt {1, 2, 3, 4, 5, 6}. Số 1 không phải số nguyên tố. Do đó P = 3/6 = 1/2.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q2',
    chapter: 1,
    topic_id: 'bayes_test',
    question: 'Hai biến cố A và B độc lập với nhau khi và chỉ khi:',
    options: ['P(A ∩ B) = 0', 'P(A ∪ B) = P(A) + P(B)', 'P(A ∩ B) = P(A) * P(B)', 'P(A|B) = 0'],
    correct_index: 2,
    explanation: 'Theo định nghĩa, hai biến cố A và B độc lập nếu việc biến cố này xảy ra không làm thay đổi xác suất xảy ra biến cố kia, tương đương P(A ∩ B) = P(A) * P(B).',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q3',
    chapter: 1,
    topic_id: 'bayes_test',
    question: 'Máy A sản xuất 60% sản phẩm (tỷ lệ lỗi 2%), máy B sản xuất 40% sản phẩm (tỷ lệ lỗi 5%). Lấy ngẫu nhiên 1 sản phẩm thấy bị lỗi. Xác suất sản phẩm này do máy B sản xuất là:',
    options: ['0,250', '0,500', '0,625', '0,750'],
    correct_index: 2,
    explanation: 'Theo công thức xác suất đầy đủ: P(Lỗi) = 0,6*0,02 + 0,4*0,05 = 0,032. Theo Bayes: P(B|Lỗi) = (0,4*0,05) / 0,032 = 0,020 / 0,032 = 0,625 (tức 62,5%).',
    difficulty: 'Vận dụng cao'
  },
  {
    id: 'q4',
    chapter: 2,
    topic_id: 'expectation_concept',
    question: 'Biến ngẫu nhiên rời rạc X có bảng phân phối: P(X = 0) = 0,3; P(X = 1) = 0,5; P(X = 2) = 0,2. Kỳ vọng E(X) bằng:',
    options: ['0,7', '0,9', '1,0', '1,2'],
    correct_index: 1,
    explanation: 'Áp dụng công thức E(X) = ∑ xi * pi = 0*0,3 + 1*0,5 + 2*0,2 = 0 + 0,5 + 0,4 = 0,9.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q5',
    chapter: 2,
    topic_id: 'expectation_concept',
    question: 'Nếu X có kỳ vọng E(X) = 5 và phương sai Var(X) = 4, thì E(2X - 3) và Var(2X - 3) lần lượt bằng:',
    options: ['E = 7; Var = 5', 'E = 7; Var = 8', 'E = 7; Var = 16', 'E = 10; Var = 16'],
    correct_index: 2,
    explanation: 'Tính chất: E(aX + b) = a*E(X) + b => E(2X - 3) = 2*5 - 3 = 7. Var(aX + b) = a^2 * Var(X) => Var(2X - 3) = 2^2 * 4 = 16 (chú ý bình phương hệ số a).',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q6',
    chapter: 3,
    topic_id: 'clt_theorem',
    question: 'Điểm số thi tuyển sinh X có phân phối chuẩn N(100; 15^2). Giá trị chuẩn hóa Z tương ứng với điểm X = 130 là:',
    options: ['1,0', '1,5', '2,0', '2,5'],
    correct_index: 2,
    explanation: 'Công thức chuẩn hóa Z = (X - μ) / σ = (130 - 100) / 15 = 30 / 15 = 2,0.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q7',
    chapter: 3,
    topic_id: 'clt_theorem',
    question: 'Theo Định lí Giới hạn Trung tâm (CLT), điều kiện thường được dùng để xấp xỉ phân phối của trung bình mẫu về chuẩn là kích thước mẫu n:',
    options: ['n ≥ 5', 'n ≥ 10', 'n ≥ 30', 'n ≥ 100'],
    correct_index: 2,
    explanation: 'Trong thực hành thống kê, quy tắc ngón tay cái là n ≥ 30 đủ bảo đảm cho trung bình mẫu có phân phối xấp xỉ chuẩn đối với hầu hết các dạng phân phối gốc.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q8',
    chapter: 4,
    question: 'Cho mẫu quan sát gồm 5 giá trị: 2, 4, 6, 8, 10. Trung bình mẫu x̄ và phương sai mẫu hiệu chỉnh s² là:',
    options: ['x̄ = 6; s² = 8', 'x̄ = 6; s² = 10', 'x̄ = 6; s² = 40', 'x̄ = 5; s² = 10'],
    correct_index: 1,
    explanation: 'Trung bình mẫu x̄ = (2+4+6+8+10)/5 = 30/5 = 6. Tổng bình phương độ lệch ∑(xi - x̄)^2 = (-4)^2 + (-2)^2 + 0^2 + 2^2 + 4^2 = 16 + 4 + 0 + 4 + 16 = 40. Phương sai mẫu hiệu chỉnh s² = 40 / (n - 1) = 40 / 4 = 10.',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q9',
    chapter: 5,
    question: 'Khi độ tin cậy của khoảng ước lượng tăng từ 90% lên 99% trong khi kích thước mẫu n không đổi, độ rộng của khoảng tin cậy sẽ:',
    options: ['Thu hẹp lại', 'Giữ nguyên không đổi', 'Mở rộng ra', 'Giảm đi một nửa'],
    correct_index: 2,
    explanation: 'Khi độ tin cậy 1 - α tăng, giá trị ngưỡng tới hạn z_(α/2) tăng lên, làm cho sai số ước lượng ε = z_(α/2) * (σ/√n) tăng, do đó khoảng tin cậy sẽ rộng hơn.',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q10',
    chapter: 6,
    question: 'Trong kiểm định giả thuyết thống kê, Sai lầm loại 1 (Type I error) xảy ra khi:',
    options: ['Bác bỏ giả thuyết H0 khi H0 thực sự đúng', 'Chấp nhận giả thuyết H0 khi H0 thực sự sai', 'Bác bỏ giả thuyết H0 khi H0 thực sự sai', 'Chấp nhận giả thuyết H0 khi H0 thực sự đúng'],
    correct_index: 0,
    explanation: 'Sai lầm loại 1 là sai lầm khi bác bỏ giả thuyết đúng (tương đương kết án người vô tội). Xác suất mắc sai lầm loại 1 lớn nhất chính là mức ý nghĩa α.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q11',
    chapter: 1,
    topic_id: 'bayes_test',
    question: 'Cho P(A) = 0,4, P(B) = 0,5 và P(A ∪ B) = 0,7. Xác suất có điều kiện P(A|B) bằng:',
    options: ['0,2', '0,4', '0,5', '0,8'],
    correct_index: 1,
    explanation: 'Theo công thức cộng: P(A ∩ B) = P(A) + P(B) - P(A ∪ B) = 0,4 + 0,5 - 0,7 = 0,2. Do đó P(A|B) = P(A ∩ B) / P(B) = 0,2 / 0,5 = 0,4.',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q12',
    chapter: 1,
    topic_id: 'bayes_test',
    question: 'Một hộp có 7 bi đỏ và 3 bi trắng. Lấy ngẫu nhiên không hoàn lại 2 viên bi. Xác suất để cả 2 viên đều màu đỏ là:',
    options: ['21/45 (hoặc 7/15)', '49/100', '14/30', '1/2'],
    correct_index: 0,
    explanation: 'Cách 1: C(7,2) / C(10,2) = 21 / 45 = 7/15. Cách 2: (7/10) * (6/9) = 42/90 = 7/15.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q13',
    chapter: 2,
    topic_id: 'expectation_concept',
    question: 'Biến ngẫu nhiên X có phân phối nhị thức B(n = 100, p = 0,2). Phương sai Var(X) bằng:',
    options: ['20', '16', '4', '80'],
    correct_index: 1,
    explanation: 'Với phân phối nhị thức B(n, p): E(X) = n*p = 20; Var(X) = n*p*(1 - p) = 100 * 0,2 * 0,8 = 16. Độ lệch chuẩn là sqrt(16) = 4.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q14',
    chapter: 2,
    topic_id: 'expectation_concept',
    question: 'Số cuộc gọi đến tổng đài trong 1 phút có phân phối Poisson với trung bình λ = 3 cuộc gọi/phút. Xác suất trong 1 phút không có cuộc gọi nào là:',
    options: ['e^(-3)', '3 * e^(-3)', '1 - e^(-3)', 'e^3'],
    correct_index: 0,
    explanation: 'Công thức Poisson: P(X = k) = (λ^k * e^(-λ)) / k!. Với k = 0: P(X = 0) = (3^0 * e^(-3)) / 0! = e^(-3) ≈ 0,0498.',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q15',
    chapter: 2,
    question: 'Hàm mật độ xác suất f(x) của biến liên tục X thỏa mãn điều kiện tích phân chuẩn hóa nào?',
    options: ['Tích phân từ -∞ đến +∞ của f(x)dx = 0', 'Tích phân từ -∞ đến +∞ của f(x)dx = 1', 'f(x) ≤ 1 với mọi x', 'Tích phân từ 0 đến 1 của f(x)dx = 1'],
    correct_index: 1,
    explanation: 'Tổng xác suất trên toàn bộ miền xác định phải bằng 1, nghĩa là ∫_{-∞}^{+∞} f(x)dx = 1 và f(x) ≥ 0 với mọi x.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q16',
    chapter: 3,
    topic_id: 'clt_theorem',
    question: 'Quy tắc 3-Sigma đối với biến ngẫu nhiên có phân phối chuẩn N(μ, σ²) khẳng định rằng khoảng (μ - 2σ, μ + 2σ) chứa khoảng bao nhiêu % xác suất?',
    options: ['68,26%', '95,44%', '99,73%', '90,00%'],
    correct_index: 1,
    explanation: 'Với phân phối chuẩn: trong 1 sigma là ~68,26%; trong 2 sigma là ~95,44%; và trong 3 sigma là ~99,73%.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q17',
    chapter: 4,
    question: 'Một ước lượng θ̂ được gọi là ước lượng không chệch (unbiased) của tham số θ nếu:',
    options: ['Var(θ̂) = 0', 'E(θ̂) = θ', 'lim n->∞ θ̂ = θ', 'θ̂ = θ với mọi mẫu'],
    correct_index: 1,
    explanation: 'Ước lượng không chệch có kỳ vọng của giá trị ước lượng bằng chính giá trị thực của tham số cần ước lượng: E(θ̂) = θ.',
    difficulty: 'Cơ bản'
  },
  {
    id: 'q18',
    chapter: 4,
    question: 'Tại sao khi tính phương sai mẫu hiệu chỉnh s², người ta chia cho (n - 1) thay vì chia cho n?',
    options: ['Để làm tròn số nguyên dễ tính hơn', 'Để biến s² thành ước lượng không chệch của phương sai tổng thể σ²', 'Vì công thức quy định vậy trong mọi giáo trình', 'Để giảm phương sai của mẫu quan sát'],
    correct_index: 1,
    explanation: 'Chia cho n sẽ cho ước lượng bị chệch dưới (E(S^2) = (n-1)/n * σ^2). Nhân với n/(n-1) (tức chia mẫu số cho n - 1) gọi là hiệu chỉnh Bessel để bảo đảm tính không chệch E(s²) = σ².',
    difficulty: 'Vận dụng cao'
  },
  {
    id: 'q19',
    chapter: 5,
    question: 'Khảo sát 400 cử tri thấy có 240 người ủng hộ ứng viên A. Tỷ lệ mẫu p̂ và sai số chuẩn của tỷ lệ mẫu SE(p̂) là:',
    options: ['p̂ = 0,6; SE ≈ 0,0245', 'p̂ = 0,6; SE ≈ 0,0500', 'p̂ = 0,5; SE ≈ 0,0245', 'p̂ = 0,4; SE ≈ 0,0245'],
    correct_index: 0,
    explanation: 'Tỷ lệ mẫu p̂ = 240 / 400 = 0,6. Sai số chuẩn SE = sqrt(p̂(1 - p̂)/n) = sqrt(0,6 * 0,4 / 400) = sqrt(0,0006) ≈ 0,0245 (2,45%).',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q20',
    chapter: 6,
    question: 'Trong bài toán kiểm định giả thuyết H0: μ = μ0 đối kháng H1: μ > μ0, nếu giá trị p-value = 0,012 và mức ý nghĩa α = 0,05 thì kết luận là:',
    options: ['Chưa đủ cơ sở bác bỏ H0', 'Bác bỏ H0, chấp nhận H1 vì p-value < α', 'Bác bỏ H1 vì p-value nhỏ', 'Kiểm định vô nghĩa vì cần p-value > 0,10'],
    correct_index: 1,
    explanation: 'Quy tắc vàng: Nếu p-value ≤ α, ta bác bỏ giả thuyết vô hiệu H0 (dữ liệu thực nghiệm không ủng hộ H0). Ở đây 0,012 < 0,05 nên bác bỏ H0.',
    difficulty: 'Vận dụng'
  },
  {
    id: 'q21',
    chapter: 6,
    question: 'Mối quan hệ giữa Sai lầm loại 1 (α) và Sai lầm loại 2 (β) khi cỡ mẫu n cố định là gì?',
    options: ['Cả hai cùng giảm đồng thời', 'Cả hai cùng tăng đồng thời', 'Khi giảm xác suất sai lầm loại 1 thì xác suất sai lầm loại 2 sẽ tăng lên', 'Hai sai lầm hoàn toàn độc lập không ảnh hưởng lẫn nhau'],
    correct_index: 2,
    explanation: 'Với kích thước mẫu n cố định, α và β đánh đổi nghịch chiều (trade-off). Cách duy nhất để giảm đồng thời cả α và β là tăng kích thước mẫu n.',
    difficulty: 'Vận dụng cao'
  },
  {
    id: 'q22',
    chapter: 3,
    topic_id: 'clt_theorem',
    question: 'Tuổi thọ bóng đèn có phân phối bất kỳ với μ = 1000 giờ, σ = 100 giờ. Lấy ngẫu nhiên một mẫu gồm 100 bóng đèn. Xác suất để tuổi thọ trung bình của mẫu lớn hơn 1020 giờ xấp xỉ bao nhiêu (biết Φ(2) = 0,9772)?',
    options: ['0,0228 (2,28%)', '0,9772 (97,72%)', '0,5000 (50%)', '0,1587 (15,87%)'],
    correct_index: 0,
    explanation: 'Theo CLT: x̄ ~ N(1000, 100^2/100) = N(1000, 10^2). Giá trị chuẩn hóa Z = (1020 - 1000) / 10 = 2,0. P(x̄ > 1020) = 1 - Φ(2) = 1 - 0,9772 = 0,0228.',
    difficulty: 'Vận dụng cao'
  }
];
