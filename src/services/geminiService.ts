import type { CritiqueReport, GradeLevel, HelpLevel, MindmapData, GameQuestion } from '../types';

export class GeminiService {
  /**
   * Chat with Socratic Tutor AI
   */
  static async sendChatMessage(params: {
    message: string;
    grade: GradeLevel;
    unitTitle: string;
    goal: string;
    helpLevel: HelpLevel;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{ reply: string; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Gemini chat API fallback:', err);
      return {
        reply: `[Chế độ Ngoại tuyến] Mực Nhỏ AI đồng hành cùng bạn: Theo quy trình 5S (Suy luận), bạn hãy thử chọn 1 từ ngữ hoặc hình ảnh giàu cảm xúc nhất trong tác phẩm để bắt đầu xây dựng ý tưởng nhé! (Mức hỗ trợ: ${params.helpLevel})`,
        isFallback: true,
      };
    }
  }

  /**
   * Request critique with 5 criteria and 4 rubric levels
   */
  static async critiqueEssay(params: {
    text: string;
    promptTitle: string;
    grade: GradeLevel;
    genre: string;
  }): Promise<{ critique: CritiqueReport; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Gemini critique fallback:', err);
      return {
        critique: {
          overallSummary: "Bài viết của em giàu cảm xúc tự nhiên, văn phong trong sáng và đúng định hướng chủ đề.",
          criteria: [
            { name: "Hiểu đúng vấn đề và nội dung", score: 3, levelName: "Đạt yêu cầu", strength: "Nắm vững chủ đề trọng tâm", weakness: "Có thể đào sâu hơn cảm xúc cá nhân", suggestion: "Thêm 1 câu bình liên hệ bài học cuộc sống" },
            { name: "Sử dụng dẫn chứng phù hợp", score: 3, levelName: "Đạt yêu cầu", strength: "Có trích dẫn các hình ảnh đắt giá", weakness: "Cần phân tích kỹ hơn hiệu quả từ ngữ", suggestion: "Giải thích rõ từ ngữ gợi tả điều gì" },
            { name: "Lập luận và tổ chức ý", score: 2, levelName: "Đạt bước đầu", strength: "Bố cục 3 phần rõ ràng", weakness: "Sự liên kết giữa các câu còn hơi rời rạc", suggestion: "Sử dụng các từ nối linh hoạt hơn" },
            { name: "Diễn đạt, chính tả và ngôn ngữ", score: 3, levelName: "Đạt yêu cầu", strength: "Chữ viết mạch lạc, ít lỗi chính tả", weakness: "Còn một số câu lặp từ ngữ", suggestion: "Thay bằng từ đồng nghĩa" },
            { name: "Tính độc lập, sáng tạo", score: 4, levelName: "Tốt", strength: "Có cảm nhận chân thành, góc nhìn mới mẻ", weakness: "Tự tin giữ vững cá tính sáng tạo", suggestion: "Phát huy nét riêng này trong các bài sau" }
          ],
          quotesToReview: [
            { quote: "mặt nước Hồ Tây mênh mang như tấm gương phẳng", comment: "Hình ảnh so sánh đẹp, nếu em gắn thêm cảm xúc của nhân vật khi ngắm nhìn thì đoạn văn sẽ lắng đọng hơn." }
          ],
          counterQuestions: [
            "Tại sao em lại chọn chi tiết này làm điểm nhấn chính cho bài viết?",
            "Nếu có cơ hội viết tiếp, em sẽ gửi gắm thông điệp gì đến bạn bè?"
          ],
          suggestedActions: [
            "Xem lại các câu chuyển ý",
            "Nhấn nút 'Em muốn phản biện AI' nếu em có lý do nghệ thuật riêng"
          ]
        },
        isFallback: true
      };
    }
  }

  /**
   * Student rebuttal
   */
  static async submitRebuttal(params: {
    studentRebuttal: string;
    originalQuote: string;
    aiComment: string;
  }): Promise<{ result: any; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/rebuttal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err: any) {
      return {
        result: {
          acknowledged: true,
          teacherFeedback: `Mực Nhỏ AI rất trân trọng giải thích của bạn: "${params.studentRebuttal}". Bạn đã thể hiện tư duy phản biện xuất sắc và biết bảo vệ góc nhìn thẩm mỹ của mình!`,
          rubricAdjustment: "Nâng tiêu chí Tính độc lập, sáng tạo lên Mức 4 (Tốt)",
          reason: "Học sinh có dụng ý nghệ thuật rõ ràng và giải thích thuyết phục."
        },
        isFallback: true
      };
    }
  }

  /**
   * Generate Mindmap JSON
   */
  static async generateMindmap(params: {
    topic: string;
    text: string;
    mapType: string;
    grade: GradeLevel;
  }): Promise<{ mapData: MindmapData; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch (err: any) {
      return {
        mapData: {
          id: 'demo-map',
          title: `Sơ đồ tư duy: ${params.topic}`,
          mapType: params.mapType as any || 'tree',
          updatedAt: new Date().toISOString(),
          nodes: [
            { id: 'root', label: params.topic || 'Phân tích tác phẩm', type: 'root', color: '#7157E8', x: 420, y: 50, details: 'Chủ đề và trọng tâm' },
            { id: 'b1', label: '1. Nội dung & Bối cảnh', type: 'branch', color: '#00C2B8', x: 120, y: 170, details: 'Không gian, thời gian nghệ thuật' },
            { id: 'b2', label: '2. Hình tượng nhân vật', type: 'branch', color: '#FFD166', x: 320, y: 170, details: 'Ngoại hình, nội tâm, hành động' },
            { id: 'b3', label: '3. Nét đặc sắc nghệ thuật', type: 'branch', color: '#8B75F3', x: 520, y: 170, details: 'Ngôn từ, biện pháp tu từ, giọng điệu' },
            { id: 'b4', label: '4. Thông điệp & Ý nghĩa', type: 'branch', color: '#009E96', x: 720, y: 170, details: 'Bài học cuộc sống và giá trị nhân văn' },
            { id: 's1', label: 'Bối cảnh Hà Nội / Hồ Tây', type: 'leaf', color: '#00C2B8', x: 80, y: 310, details: 'Dấu ấn văn hóa truyền thống' },
            { id: 's2', label: 'Tấm lòng hiếu thảo, vị tha', type: 'leaf', color: '#FFD166', x: 280, y: 310, details: 'Chi tiết lời nói và cử chỉ' },
            { id: 's3', label: 'Biện pháp so sánh & nhân hóa', type: 'leaf', color: '#8B75F3', x: 480, y: 310, details: 'Tăng sức gợi hình, gợi cảm' },
            { id: 's4', label: 'Tình yêu quê hương, gia đình', type: 'leaf', color: '#009E96', x: 680, y: 310, details: 'Trách nhiệm với cộng đồng' }
          ],
          edges: [
            { from: 'root', to: 'b1' },
            { from: 'root', to: 'b2' },
            { from: 'root', to: 'b3' },
            { from: 'root', to: 'b4' },
            { from: 'b1', to: 's1' },
            { from: 'b2', to: 's2' },
            { from: 'b3', to: 's3' },
            { from: 'b4', to: 's4' }
          ]
        },
        isFallback: true
      };
    }
  }

  /**
   * Literary work deep analysis
   */
  static async analyzeWork(params: {
    title: string;
    author: string;
    grade: GradeLevel;
    genre: string;
    text: string;
  }): Promise<{ analysis: any; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/analyze-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      return {
        analysis: {
          theme: "Ca ngợi vẻ đẹp thiên nhiên thanh bình và tình yêu quê hương đất nước",
          structure: ["Phần 1: Khởi đầu cảm xúc bên mặt hồ", "Phần 2: Hồi ức và kỷ niệm sâu đậm", "Phần 3: Bài học trưởng thành"],
          characterTraits: [
            {
              trait: "Tâm hồn trong sáng, nhạy cảm trước cái đẹp",
              evidenceQuote: "Mặt nước Hồ Tây gợn sóng lăn tăn như dát vàng dưới ánh hoàng hôn",
              explanation: "Chi tiết chứng minh khả năng quan sát tinh tế và tình yêu tha thiết với cảnh sắc Hà Nội."
            }
          ],
          artisticFeatures: [
            {
              feature: "Nghệ thuật miêu tả sinh động, ngôn ngữ giàu chất thơ",
              evidenceQuote: "Gió heo may len qua từng kẽ lá mang hương sen thoang thoảng",
              impact: "Đánh thức mọi giác quan của người đọc, gợi nỗi nhớ quê nhà da diết."
            }
          ],
          message: "Mỗi kỷ niệm tuổi thơ bên người thân là hành trang quý giá nâng đỡ tâm hồn ta khi lớn lên.",
          criticDebates: [
            {
              statement: "Liệu ký ức tuổi thơ có làm con người đắm chìm trong quá khứ?",
              perspectiveA: "Ký ức giúp nuôi dưỡng tâm hồn, là điểm tựa tinh thần vững chắc để vững bước tương lai.",
              perspectiveB: "Cần trân trọng quá khứ nhưng không để nỗi hoài niệm ngăn cản bước tiến hiện tại."
            }
          ]
        },
        isFallback: true
      };
    }
  }

  /**
   * Roleplay with character
   */
  static async roleplay(params: {
    characterName: string;
    workTitle: string;
    userMessage: string;
    mode: 'roleplay' | 'exit-role';
    characterContext?: string;
  }): Promise<{ reply: string; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      if (params.mode === 'exit-role') {
        return {
          reply: `[CHẾ ĐỘ THOÁT VAI – PHÂN TÍCH NHÂN VẬT]:\n- Chi tiết có trong văn bản: Tính cách của ${params.characterName} xuất phát từ tình huống truyện và các hành động được nhà văn miêu tả rõ trong ngữ liệu.\n- Giả định sáng tạo: Lời tâm sự về 'nếu có cơ hội thay đổi' là giả định nghệ thuật giúp học sinh thấu hiểu sâu hơn động cơ của nhân vật.\n- Gợi ý: Hãy tìm thêm 2 dẫn chứng về ngôn ngữ đối thoại của nhân vật trong văn bản gốc nhé!`,
          isFallback: true
        };
      }
      return {
        reply: `Chào bạn! Mình là ${params.characterName}. Cảm ơn bạn đã hỏi thăm mình. Giữa bao biến cố trong câu chuyện, câu hỏi của bạn làm mình suy nghĩ rất nhiều về con đường mà mình đã chọn...`,
        isFallback: true
      };
    }
  }

  /**
   * Generate Quiz Questions
   */
  static async generateQuiz(params: {
    title: string;
    text: string;
    grade: GradeLevel;
    count?: number;
  }): Promise<{ questions: GameQuestion[]; isFallback?: boolean }> {
    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await res.json();
    } catch {
      return {
        questions: [
          {
            id: 1,
            level: 'Nhận biết',
            question: 'Văn bản được viết theo thể loại chính nào?',
            options: ['Truyện ngắn / Ký', 'Thơ lục bát', 'Kịch bản sân khấu', 'Văn bản nhật dụng'],
            correctIndex: 0,
            explanation: 'Văn bản có cốt truyện, nhân vật và sự việc diễn tiến theo thời gian.'
          },
          {
            id: 2,
            level: 'Thông hiểu',
            question: 'Tâm trạng nổi bật của nhân vật chính là gì?',
            options: ['Bồi hồi, xúc động và trân trọng kỷ niệm', 'Thờ ơ, lạnh nhạt', 'Lo lắng, sợ hãi trước tương lai', 'Hân hoan phấn khích tột cùng'],
            correctIndex: 0,
            explanation: 'Nhân vật luôn bày tỏ sự gắn bó thiêng liêng với những ký ức tuổi thơ.'
          },
          {
            id: 3,
            level: 'Vận dụng',
            question: 'Nghệ thuật xây dựng nhân vật thành công nhất là gì?',
            options: ['Khắc họa nội tâm tinh tế qua hành động và dòng suy ngẫm', 'Chỉ tập trung miêu tả trang phục hào nhoáng', 'Sử dụng quá nhiều lời thoại khoa trương', 'Không có miêu tả ngoại cảnh'],
            correctIndex: 0,
            explanation: 'Tác giả đi sâu vào những rung cảm bên trong tâm hồn nhân vật.'
          },
          {
            id: 4,
            level: 'Vận dụng cao',
            question: 'Bài học ý nghĩa nhất em rút ra từ văn bản là gì?',
            options: ['Biết lắng nghe, thấu hiểu và yêu thương những điều bình dị quanh mình', 'Chỉ quan tâm đến lợi ích bản thân', 'Không cần trân trọng ký ức', 'Chờ đợi người khác giúp đỡ'],
            correctIndex: 0,
            explanation: 'Giá trị nhân văn cốt lõi giúp học sinh tự rèn luyện phẩm chất tốt đẹp.'
          }
        ],
        isFallback: true
      };
    }
  }
}
