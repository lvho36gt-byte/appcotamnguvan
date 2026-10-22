import type {
  AssignmentTask,
  CompetitionCriterion,
  LiteraryWork,
  MindmapData,
  StudentAccount,
  StudentSubmission,
  UserRole,
} from '../types';

const STORAGE_KEYS = {
  ROLE: 'vanhoc_ai_current_role',
  CURRENT_STUDENT: 'vanhoc_ai_current_student',
  WORKS: 'vanhoc_ai_works',
  TASKS: 'vanhoc_ai_tasks',
  SUBMISSIONS: 'vanhoc_ai_submissions',
  STUDENTS: 'vanhoc_ai_students',
  MINDMAPS: 'vanhoc_ai_mindmaps',
  COMPETITION: 'vanhoc_ai_competition',
};

// Seed Literary Work (Original text created for this applet set in Hanoi/West Lake)
export const SEED_WORKS: LiteraryWork[] = [
  {
    id: 'work-demo-01',
    title: 'Hồ Tây Chiều Gió Sớm',
    author: 'Dự án Sáng tạo Văn học Chu Văn An',
    grade: 8,
    genre: 'Truyện ngắn / Ký',
    skill: 'Đọc hiểu',
    difficulty: 'Trung bình',
    isDemo: true,
    text: `Chiều thu ấy, sương mỏng giăng mờ trên mặt nước Hồ Tây như tấm khăn voan khẽ lay trong gió sớm. Cậu bé An ngồi trên bậc thềm đá hoa cương cạnh đường Thanh Niên, chiếc cần câu trúc khẽ gác bên bờ cỏ thơm mùi sương ngậm.

Bà nội An thường bảo: "Hồ Tây như trái tim của Hà Nội, dẫu phố xá có ồn ào đến đâu, chỉ cần ra đây ngắm con sóng vỗ bờ là lòng người dịu lại". Lời bà dặn như hạt ngọc gieo vào tâm trí cậu, nuôi dưỡng một tình yêu thầm lặng với từng góc phố rêu phong.

Hôm nay là buổi câu cá cuối cùng trước ngày An theo bố mẹ chuyển vào phương Nam. Cậu không câu cá để bắt, mà chỉ để gom nhặt lại hương sen muộn, ánh hoàng hôn dát vàng trên mái đền Trấn Quốc, và tiếng chuông chùa Trấn Vũ ngân dài trong sương chiều. Nhìn đàn cá con tung tăng đớp bọt nước, An mỉm cười thả chú cá rô nhỏ vừa cắn câu trở lại làn nước biếc. Cậu nhận ra, sự trưởng thành không phải là giữ chặt mọi thứ cho riêng mình, mà là biết nâng niu những ký ức đẹp để vững bước trên con đường phía trước.`,
    notes: 'Văn bản sáng tác riêng phục vụ minh họa thực nghiệm mô hình 5S.',
  },
  {
    id: 'work-demo-02',
    title: 'Hương Cốm Mùa Cúc Vàng',
    author: 'Dự án Văn học Số',
    grade: 7,
    genre: 'Tản văn / Biểu cảm',
    skill: 'Viết',
    difficulty: 'Cơ bản',
    isDemo: true,
    text: `Cứ mỗi độ tháng Mười gõ cửa, phố phường Hà Nội lại dịu dàng đón những gánh cốm xanh Vòng thơm nức hương lúa mới. Từng hạt cốm dẻo thơm được bọc cẩn thận trong lớp lá sen già, buộc bằng sợi rơm vàng óng ả. Đó không chỉ là món quà thanh tao của đồng nội, mà còn là kết tinh tình cảm của bàn tay lao động cần cù, là nét văn hóa Tràng An lắng đọng qua ngàn năm văn hiến.`,
    notes: 'Ngữ liệu rèn luyện kỹ năng viết đoạn văn biểu cảm cho học sinh lớp 7.',
  },
  {
    id: 'work-demo-03',
    title: 'Khát Vọng Màu Xanh',
    author: 'Tổ Xã hội Chu Văn An',
    grade: 9,
    genre: 'Nghị luận xã hội',
    skill: 'Nghị luận',
    difficulty: 'Nâng cao',
    isDemo: true,
    text: `Bảo vệ môi trường hôm nay không còn là khẩu hiệu xa vời, mà là trách nhiệm sống còn của mỗi công dân trẻ. Khi chúng ta nhặt một mảnh rác ven hồ, trồng thêm một mầm cây nơi góc sân trường, hay chọn lối sống xanh giản dị, chính là lúc ta đang viết tiếp câu chuyện tình yêu với thành phố và tương lai mai sau.`,
    notes: 'Ngữ liệu rèn luyện kỹ năng nghị luận xã hội cho học sinh lớp 9.',
  },
];

// Seed 5 Demo Students for Lớp 8A Chu Văn An
export const SEED_STUDENTS: StudentAccount[] = [
  {
    id: 'hs-1',
    code: 'HS-DEMO-01',
    name: 'Học sinh 01 (Ẩn danh)',
    className: 'Lớp 8A – Trải nghiệm',
    grade: 8,
    preTestScore: 5.5,
    postTestScore: 8.5,
    editCount: 4,
    completedTasks: 3,
    totalTasks: 3,
  },
  {
    id: 'hs-2',
    code: 'HS-DEMO-02',
    name: 'Học sinh 02 (Ẩn danh)',
    className: 'Lớp 8A – Trải nghiệm',
    grade: 8,
    preTestScore: 6.0,
    postTestScore: 8.0,
    editCount: 3,
    completedTasks: 3,
    totalTasks: 3,
  },
  {
    id: 'hs-3',
    code: 'HS-DEMO-03',
    name: 'Học sinh 03 (Ẩn danh)',
    className: 'Lớp 8A – Trải nghiệm',
    grade: 8,
    preTestScore: 4.5,
    postTestScore: 7.5,
    editCount: 5,
    completedTasks: 2,
    totalTasks: 3,
  },
  {
    id: 'hs-4',
    code: 'HS-DEMO-04',
    name: 'Học sinh 04 (Ẩn danh)',
    className: 'Lớp 8A – Trải nghiệm',
    grade: 8,
    preTestScore: 7.0,
    postTestScore: 9.0,
    editCount: 3,
    completedTasks: 3,
    totalTasks: 3,
  },
  {
    id: 'hs-5',
    code: 'HS-DEMO-05',
    name: 'Học sinh 05 (Ẩn danh)',
    className: 'Lớp 8A – Trải nghiệm',
    grade: 8,
    preTestScore: 5.0,
    postTestScore: 8.0,
    editCount: 4,
    completedTasks: 2,
    totalTasks: 3,
  },
];

// Seed Tasks
export const SEED_TASKS: AssignmentTask[] = [
  {
    id: 'task-demo-01',
    title: 'Khám phá nhân vật An và viết đoạn văn sáng tạo về tình yêu quê hương',
    grade: 8,
    workId: 'work-demo-01',
    genre: 'Đoạn văn cảm nhận / Sáng tạo',
    description: 'Em hãy đọc truyện ngắn "Hồ Tây Chiều Gió Sớm", nhập vai người bạn đồng hành của An để chia sẻ cảm xúc trước khoảnh khắc An thả chú cá nhỏ trở về với lòng hồ.',
    dueDate: '2026-11-15',
    rubricRequirements: [
      'Hiểu đúng tâm trạng và sự trưởng thành của nhân vật An',
      'Có dẫn chứng trích xuất từ câu chuyện Hồ Tây',
      'Thể hiện góc nhìn sáng tạo và cảm xúc chân thật',
      'Đảm bảo quy tắc chính tả, dung lượng 150 - 250 chữ',
    ],
    status: 'active',
    isDemo: true,
  },
  {
    id: 'task-demo-02',
    title: 'Thiết kế Sơ đồ tư duy vẻ đẹp văn hóa Tràng An qua "Hương Cốm Mùa Cúc Vàng"',
    grade: 7,
    workId: 'work-demo-02',
    genre: 'Sơ đồ tư duy',
    description: 'Sử dụng công cụ Sơ đồ tư duy AI để hệ thống hóa nét đẹp ẩm thực, bàn tay người thợ làng Vòng và ý nghĩa biểu tượng của hương cốm.',
    dueDate: '2026-11-20',
    rubricRequirements: ['Phân nhánh logic', 'Màu sắc trực quan', 'Đủ chi tiết dẫn chứng'],
    status: 'active',
    isDemo: true,
  },
];

// Seed Submission with 3 versions (V1 before feedback, V2 after AI feedback, V3 Final)
export const SEED_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-demo-01',
    studentId: 'hs-1',
    studentCode: 'HS-DEMO-01',
    taskId: 'task-demo-01',
    taskTitle: 'Khám phá nhân vật An và viết đoạn văn sáng tạo',
    grade: 8,
    genre: 'Đoạn văn cảm nhận / Sáng tạo',
    status: 'completed',
    currentVersionIndex: 2,
    updatedAt: '2026-10-21T14:30:00Z',
    versions: [
      {
        versionNumber: 1,
        label: 'Phiên bản 1 – Trước phản hồi (Bản nháp)',
        text: `Đọc truyện Hồ Tây Chiều Gió Sớm, em thấy An là một bạn nhỏ rất tốt bụng. An sắp phải đi xa nên ra hồ Tây câu cá. Cảnh hồ Tây buổi chiều rất đẹp có sương mờ và chuông chùa. Khi câu được con cá rô, An không đem về nhà mà thả nó đi. Hành động đó cho thấy An rất yêu thiên nhiên và biết suy nghĩ. Em rất thích bạn An.`,
        wordCount: 77,
        createdAt: '2026-10-20T09:15:00Z',
        diffSummary: 'Bản viết sơ khởi, câu văn ngắn, chưa liên kết cảm xúc sâu.',
      },
      {
        versionNumber: 2,
        label: 'Phiên bản 2 – Sau phản hồi AI (Bổ sung dẫn chứng & từ nối)',
        text: `Đọc truyện ngắn "Hồ Tây Chiều Gió Sớm", hình ảnh nhân vật An trong buổi chiều thu bên mặt hồ đã để lại trong em nhiều rung động sâu sắc. Không chỉ là một bạn nhỏ giàu lòng nhân ái, An còn mang tâm hồn nhạy cảm trước vẻ đẹp của đất trời Hà Nội. Đứng trước giờ phút chia tay thành phố thân thương, An gom nhặt hương sen muộn và tiếng chuông chùa Trấn Vũ như giữ gìn kỷ niệm quý báu của tuổi thơ. Đặc biệt, khoảnh khắc An mỉm cười thả chú cá rô nhỏ trở về với làn nước biếc chính là minh chứng cho sự trưởng thành: biết nâng niu sự sống và trân quý những điều bình dị quanh mình.`,
        wordCount: 125,
        createdAt: '2026-10-21T10:00:00Z',
        diffSummary: 'Học sinh tiếp thu phản biện AI: mở rộng câu văn, thêm chi tiết tiếng chuông chùa và hương sen.',
      },
      {
        versionNumber: 3,
        label: 'Phiên bản 3 (Hoàn thiện) – Có duyệt của Giáo viên',
        text: `Đọc truyện ngắn "Hồ Tây Chiều Gió Sớm", hình ảnh nhân vật An bên bờ nước hoàng hôn đã chạm sâu vào trái tim em bởi vẻ đẹp trong trẻo của tình yêu quê hương và sự trưởng thành lặng lẽ. Đứng trước bước ngoặt phải rời xa Hà Nội, An không chọn sự buồn bã ủ ê, mà lắng lòng mình để gom nhặt từng vạt sương sớm, hương sen muộn cùng tiếng chuông chùa ngân vang. Chi tiết An mỉm cười thả chú cá rô nhỏ trở lại lòng hồ Tây bao la không đơn thuần là lòng nhân đạo, mà là một sự giác ngộ đầy chất thơ: trưởng thành là biết buông tay để nâng niu, là gìn giữ những ký ức thiêng liêng làm hành trang soi sáng cho chặng đường tương lai.`,
        wordCount: 148,
        createdAt: '2026-10-21T14:30:00Z',
        diffSummary: 'Phiên bản hoàn thiện: từ ngữ trau chuốt, ý văn sâu sắc, có liên hệ triết lý sống.',
      },
    ],
    rubricScores: {
      understanding: 4,
      evidence: 4,
      argument: 3,
      expression: 4,
      creativity: 4,
    },
    critiqueReport: {
      overallSummary: 'Bài viết tiến bộ vượt bậc qua 3 phiên bản, thể hiện tư duy thẩm mỹ độc lập và giàu chất văn.',
      criteria: [
        { name: 'Hiểu đúng vấn đề và nội dung', score: 4, levelName: 'Tốt', strength: 'Phân tích trúng tâm lý nhân vật An', weakness: 'Không', suggestion: 'Phát huy mạch cảm xúc này' },
        { name: 'Sử dụng dẫn chứng phù hợp', score: 4, levelName: 'Tốt', strength: 'Dẫn chứng đắt giá về tiếng chuông chùa và hành động thả cá', weakness: 'Không', suggestion: 'Tiếp tục rèn luyện cách trích dẫn tự nhiên' },
        { name: 'Lập luận và tổ chức ý', score: 3, levelName: 'Đạt yêu cầu', strength: 'Mở - thân - kết mạch lạc', weakness: 'Có thể làm rõ hơn ranh giới giữa nuối tiếc và trưởng thành', suggestion: 'Thêm 1 câu bình tương phản' },
        { name: 'Diễn đạt, chính tả và ngôn ngữ', score: 4, levelName: 'Tốt', strength: 'Ngôn từ gợi cảm, giàu hình ảnh', weakness: 'Không', suggestion: 'Văn phong rất trong sáng' },
        { name: 'Tính độc lập, sáng tạo', score: 4, levelName: 'Tốt', strength: 'Liên tưởng "trưởng thành là biết nâng niu" rất độc đáo', weakness: 'Không', suggestion: 'Rất đáng khen ngợi' },
      ],
      quotesToReview: [
        { quote: 'trưởng thành là biết buông tay để nâng niu', comment: 'Câu đúc kết tuyệt vời, thể hiện năng lực sáng tạo vượt trội.' },
      ],
      counterQuestions: [
        'Theo em, nếu An đem chú cá về nuôi thì ý nghĩa câu chuyện sẽ thay đổi ra sao?',
      ],
      suggestedActions: [
        'Lưu tác phẩm vào Thư viện bài viết tiêu biểu của lớp',
      ],
    },
    studentRebuttal: 'Em muốn nhấn mạnh rằng An thả cá không phải vì không thích nuôi, mà vì An muốn cá được tự do trong lòng hồ Tây cũng như tình yêu của An với Hà Nội luôn bao la không biên giới.',
    rebuttalFeedback: 'Mực Nhỏ AI và cô giáo hoàn toàn đồng ý! Lập luận phản biện của em rất có chiều sâu thẩm mỹ, xứng đáng được nâng điểm tiêu chí Sáng tạo lên mức Tốt nhất.',
    teacherOfficialFeedback: 'Cô rất tự hào về sự tiến bộ của em. Từ bản nháp 77 từ đơn sơ, em đã chủ động lắng nghe gợi mở của Mực Nhỏ AI để tự tay hoàn thiện một đoạn văn 148 từ đầy cảm xúc và triết lý sống. Đạt điểm Tốt!',
    teacherApproved: true,
  },
];

// Seed Mindmap
export const SEED_MINDMAP: MindmapData = {
  id: 'mindmap-demo-01',
  title: 'Phân tích hình tượng nhân vật An (Hồ Tây Chiều Gió Sớm)',
  mapType: 'tree',
  updatedAt: '2026-10-21T10:00:00Z',
  nodes: [
    { id: 'root', label: 'Nhân vật An (Hồ Tây)', type: 'root', color: '#7157E8', x: 420, y: 50, details: 'Hình tượng thiếu niên Hà Nội giàu tình cảm' },
    { id: 'b1', label: '1. Hoàn cảnh đặc biệt', type: 'branch', color: '#00C2B8', x: 120, y: 170, details: 'Buổi chiều cuối cùng trước ngày chuyển vào Nam' },
    { id: 'b2', label: '2. Tình yêu tha thiết với Hà Nội', type: 'branch', color: '#FFD166', x: 320, y: 170, details: 'Gắn bó với Hồ Tây, nhớ lời dạy của bà' },
    { id: 'b3', label: '3. Hành động thả cá đầy ý nghĩa', type: 'branch', color: '#8B75F3', x: 520, y: 170, details: 'Không câu để bắt, mỉm cười thả cá về hồ' },
    { id: 'b4', label: '4. Sự trưởng thành trong nhận thức', type: 'branch', color: '#009E96', x: 720, y: 170, details: 'Biết trân quý ký ức để bước tiếp tương lai' },
    { id: 's1', label: 'Bờ đường Thanh Niên mùa thu', type: 'leaf', color: '#00C2B8', x: 80, y: 310, details: 'Không gian tĩnh lặng, đượm chút bâng khuâng' },
    { id: 's2', label: 'Hương sen & Chuông Trấn Vũ', type: 'leaf', color: '#FFD166', x: 280, y: 310, details: 'Các giác quan đánh thức ký ức thiêng liêng' },
    { id: 's3', label: 'Lòng nhân ái với sinh vật', type: 'leaf', color: '#8B75F3', x: 480, y: 310, details: 'Hành động nhân văn của tuổi học trò' },
    { id: 's4', label: 'Thông điệp nâng niu kỷ niệm', type: 'leaf', color: '#009E96', x: 680, y: 310, details: 'Tư tưởng chủ đề của tác phẩm' },
  ],
  edges: [
    { from: 'root', to: 'b1' },
    { from: 'root', to: 'b2' },
    { from: 'root', to: 'b3' },
    { from: 'root', to: 'b4' },
    { from: 'b1', to: 's1' },
    { from: 'b2', to: 's2' },
    { from: 'b3', to: 's3' },
    { from: 'b4', to: 's4' },
  ],
};

// Seed Competition Criteria (Hồ sơ minh chứng dự thi 2026)
export const SEED_COMPETITION: CompetitionCriterion[] = [
  {
    id: 'crit-1',
    number: 1,
    name: 'Tính thực tiễn',
    weight: '25%',
    description: 'Giải quyết trực tiếp thách thức dạy học Ngữ văn THCS: học sinh sợ viết văn, lệ thuộc văn mẫu hoặc chép AI nguyên xi.',
    requiredEvidence: 'Kế hoạch bài dạy theo quy trình 5S, nhật ký ứng dụng tại lớp 8A trường Chu Văn An, số liệu học sinh tương tác.',
    addedEvidence: 'Đã tích hợp 3 bài học thực nghiệm khối 7, 8, 9; có biên bản dự giờ của tổ Xã hội trường TH-THCS Chu Văn An.',
    status: 'ĐÃ KIỂM TRA',
    notes: 'Phù hợp chặt chẽ với chương trình Giáo dục phổ thông 2018 môn Ngữ văn.',
  },
  {
    id: 'crit-2',
    number: 2,
    name: 'Tính sáng tạo',
    weight: '20%',
    description: 'Mô hình 5S độc đáo (Soi - Suy luận - Sáng tạo - Soát xét - Sửa/Chia sẻ); AI Socratic gợi mở thay vì viết hộ; Nút "Em muốn phản biện AI".',
    requiredEvidence: 'Cơ chế lưu trữ 3 phiên bản bài viết, tính năng Thoát vai nhân vật, thuật toán Sơ đồ tư duy trực quan.',
    addedEvidence: 'Giao diện linh vật Mực Nhỏ AI thân thiện; quy trình phản biện đa chiều giữa trò - AI - cô giáo.',
    status: 'ĐÃ BỔ SUNG',
    notes: 'Khẳng định triết lý cốt lõi: AI không viết văn thay học sinh.',
  },
  {
    id: 'crit-3',
    number: 3,
    name: 'Tác động và kết quả thực tiễn',
    weight: '25%',
    description: 'Nâng cao năng lực tự học, tự chỉnh sửa văn bản và tư duy phản biện của học sinh THCS.',
    requiredEvidence: 'Bảng đối chiếu điểm khảo sát Trước - Sau có cùng thang đo rubric; biểu đồ tăng trưởng số lần tự sửa bài.',
    addedEvidence: 'Điểm trung bình lớp 8A tăng từ 5.6 lên 8.2; 100% học sinh tự chỉnh sửa ít nhất 3 phiên bản trước khi nộp.',
    status: 'ĐÃ BỔ SUNG',
    notes: 'Gắn nhãn minh bạch: Kết quả thực nghiệm tại nhóm mẫu học sinh.',
  },
  {
    id: 'crit-4',
    number: 4,
    name: 'Tính bền vững và khả năng nhân rộng',
    weight: '15%',
    description: 'Kiến trúc Full-stack hiện đại, hỗ trợ đa nền tảng, dễ dàng mở rộng sang các khối lớp và trường học khác.',
    requiredEvidence: 'Tài liệu hướng dẫn sử dụng cho giáo viên, mã nguồn mở chuẩn mực, tính năng quản lý lớp học bằng mã ẩn danh.',
    addedEvidence: 'Hệ thống chạy mượt mà trên desktop, tablet và mobile; phân quyền rõ ràng giữa Giáo viên, Học sinh và Khách trải nghiệm.',
    status: 'ĐÃ KIỂM TRA',
    notes: 'Bảo vệ quyền riêng tư học sinh theo quy chuẩn an toàn số.',
  },
  {
    id: 'crit-5',
    number: 5,
    name: 'Chất lượng trình bày, tính thuyết phục',
    weight: '15%',
    description: 'Giao diện EdTech chuyên nghiệp, màu sắc chuẩn nhận diện, biểu đồ trực quan, hỗ trợ xuất báo cáo PDF/CSV.',
    requiredEvidence: 'Video trình diễn trực tiếp, slide báo cáo, file xuất dữ liệu thống kê từ hệ thống.',
    addedEvidence: 'Hệ thống có đầy đủ tính năng xuất CSV, in báo cáo thống kê tiến độ, sơ đồ tư duy tải về file ảnh PNG sắc nét.',
    status: 'ĐÃ KIỂM TRA',
    notes: 'Sẵn sàng thuyết trình trực tiếp trước Hội đồng Ban giám khảo.',
  },
];

export class StorageService {
  // Current user role
  static getRole(): UserRole {
    if (typeof window === 'undefined') return 'demo';
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'demo';
  }

  static setRole(role: UserRole): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }

  // Active student
  static getCurrentStudent(): StudentAccount {
    if (typeof window === 'undefined') return SEED_STUDENTS[0];
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return SEED_STUDENTS[0];
  }

  static setCurrentStudent(student: StudentAccount): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  }

  // Literary Works
  static getWorks(): LiteraryWork[] {
    if (typeof window === 'undefined') return SEED_WORKS;
    const saved = localStorage.getItem(STORAGE_KEYS.WORKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(SEED_WORKS));
    return SEED_WORKS;
  }

  static saveWork(work: LiteraryWork): void {
    const list = this.getWorks();
    const index = list.findIndex((w) => w.id === work.id);
    if (index >= 0) {
      list[index] = work;
    } else {
      list.unshift(work);
    }
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(list));
  }

  static deleteWork(workId: string): void {
    const list = this.getWorks().filter((w) => w.id !== workId);
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(list));
  }

  // Tasks
  static getTasks(): AssignmentTask[] {
    if (typeof window === 'undefined') return SEED_TASKS;
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    return SEED_TASKS;
  }

  static saveTask(task: AssignmentTask): void {
    const list = this.getTasks();
    const index = list.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      list[index] = task;
    } else {
      list.unshift(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(list));
  }

  // Submissions
  static getSubmissions(): StudentSubmission[] {
    if (typeof window === 'undefined') return SEED_SUBMISSIONS;
    const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(SEED_SUBMISSIONS));
    return SEED_SUBMISSIONS;
  }

  static saveSubmission(sub: StudentSubmission): void {
    const list = this.getSubmissions();
    const index = list.findIndex((s) => s.id === sub.id);
    if (index >= 0) {
      list[index] = sub;
    } else {
      list.unshift(sub);
    }
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(list));
  }

  // Students list
  static getStudents(): StudentAccount[] {
    if (typeof window === 'undefined') return SEED_STUDENTS;
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
    return SEED_STUDENTS;
  }

  static saveStudent(student: StudentAccount): void {
    const list = this.getStudents();
    const index = list.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(list));
  }

  // Mindmap
  static getMindmap(): MindmapData {
    if (typeof window === 'undefined') return SEED_MINDMAP;
    const saved = localStorage.getItem(STORAGE_KEYS.MINDMAPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.MINDMAPS, JSON.stringify(SEED_MINDMAP));
    return SEED_MINDMAP;
  }

  static saveMindmap(data: MindmapData): void {
    localStorage.setItem(STORAGE_KEYS.MINDMAPS, JSON.stringify(data));
  }

  // Competition Criteria
  static getCompetitionCriteria(): CompetitionCriterion[] {
    if (typeof window === 'undefined') return SEED_COMPETITION;
    const saved = localStorage.getItem(STORAGE_KEYS.COMPETITION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.COMPETITION, JSON.stringify(SEED_COMPETITION));
    return SEED_COMPETITION;
  }

  static saveCompetitionCriteria(criteria: CompetitionCriterion[]): void {
    localStorage.setItem(STORAGE_KEYS.COMPETITION, JSON.stringify(criteria));
  }

  // Reset to initial demo state
  static resetToDemo(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(SEED_WORKS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(SEED_SUBMISSIONS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.MINDMAPS, JSON.stringify(SEED_MINDMAP));
    localStorage.setItem(STORAGE_KEYS.COMPETITION, JSON.stringify(SEED_COMPETITION));
  }
}
