import { GoogleGenAI } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';

// Initialize Gemini SDK with recommended user-agent header
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Helper to parse JSON body from incoming HTTP request
export const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => reject(err));
  });
};

// Send JSON response
export const sendJson = (res: ServerResponse, statusCode: number, data: any): boolean => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
  return true;
};

// Server-side API handler for /api/gemini routes
export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/gemini/')) {
    return false;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed. Only POST is supported.' });
    return true;
  }

  try {
    const ai = getAIClient();
    const endpoint = url.replace('/api/gemini/', '').split('?')[0];
    const payload = await parseBody(req);

    // 1. Gia sư Ngữ văn AI Chat (Socratic, 3 levels of help, 5S framework)
    if (endpoint === 'chat') {
      const { message, grade, unitTitle, goal, helpLevel, history } = payload;

      const systemInstruction = `Bạn là "Mực Nhỏ AI", người bạn gia sư đồng hành môn Ngữ văn THCS (Lớp ${grade || 8}) thuộc nền tảng "Trợ Lý Văn Học Số AI", được hướng dẫn bởi cô giáo Lê Thị Tâm (Trường TH-THCS Chu Văn An, Tây Hồ, Hà Nội).
TRIẾT LÝ BẮT BUỘC:
"AI KHÔNG VIẾT VĂN THAY HỌC SINH – AI KHƠI GỢI ĐỂ HỌC SINH TỰ SÁNG TẠO".
QUY TRÌNH 5S:
- S1 Soi tác phẩm, S2 Suy luận, S3 Sáng tạo, S4 Soát xét, S5 Sửa & Chia sẻ.

MỨC TRỢ GIÚP HIỆN TẠI: Mức ${helpLevel || 1}
- Mức 1: Đặt câu hỏi gợi mở, hướng học sinh quan sát từ ngữ, hình ảnh hoặc tâm trạng nhân vật. Không đưa câu trả lời sẵn.
- Mức 2: Gợi ý các bước suy nghĩ (Step-by-step), gợi ra 2-3 hướng tư duy hoặc dẫn chứng tiềm năng để học sinh tự chọn.
- Mức 3: Minh họa phương pháp giải quyết vấn đề (ví dụ cách lập dàn ý hoặc phân tích cấu trúc), tuyệt đối KHÔNG viết nguyên đoạn văn hoàn chỉnh để học sinh nộp hộ.

Nếu học sinh yêu cầu "viết hộ bài", bạn PHẢI từ chối nhẹ nhàng, động viên học sinh và hướng dẫn từng bước lập ý hoặc mở bài.
Giọng văn: Trong sáng, ấm áp, thân thiện, chuẩn mực tiếng Việt, phù hợp tâm lý học sinh THCS. Độ dài phản hồi vừa phải, ngắt đoạn rõ ràng.`;

      if (!ai) {
        // Fallback when no API key configured
        return sendJson(res, 200, {
          reply: `[Chế độ Demo] Mực Nhỏ AI chào bạn! Đối với câu hỏi về "${message}", theo phương pháp 5S (Suy luận & Khơi gợi), bạn hãy thử chú ý: Chi tiết nào trong văn bản thể hiện rõ nhất cảm xúc nhân vật? Bạn thử nêu 1 câu trích dẫn bạn ấn tượng nhất nhé! (Mức hỗ trợ: ${helpLevel || 1})`,
          isFallback: true,
        });
      }

      // Build contents
      const conversationContents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          conversationContents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content }],
          });
        }
      }
      conversationContents.push({
        role: 'user',
        parts: [{ text: `[Ngữ văn lớp ${grade}, Bài học: ${unitTitle || 'Đọc hiểu tác phẩm'}, Mục tiêu: ${goal || 'Phát triển năng lực'}]\nCâu hỏi/Thắc mắc của học sinh: ${message}` }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return sendJson(res, 200, {
        reply: response.text || 'Mực Nhỏ AI đang suy nghĩ, bạn hãy thử lại nhé!',
      });
    }

    // 2. Hội đồng phản biện AI (5 tiêu chí, rubric 4 mức)
    if (endpoint === 'critique') {
      const { text, promptTitle, grade, genre } = payload;

      const systemPrompt = `Bạn là Hội đồng Phản biện Văn học AI thuộc ứng dụng "Trợ Lý Văn Học Số AI".
Nhiệm vụ: Đọc bài viết của học sinh THCS (Lớp ${grade || 8}, thể loại: ${genre || 'Cảm nhận/Nghị luận'}) và đưa ra nhận xét xây dựng theo 5 tiêu chí:
1. Hiểu đúng vấn đề và nội dung (Rubric 1-4)
2. Sử dụng dẫn chứng phù hợp (Rubric 1-4)
3. Lập luận và tổ chức ý (Rubric 1-4)
4. Diễn đạt, chính tả và ngôn ngữ (Rubric 1-4)
5. Tính độc lập, sáng tạo (Rubric 1-4)

Thang điểm Rubric:
1: Cần hỗ trợ
2: Đạt bước đầu
3: Đạt yêu cầu
4: Tốt

Yêu cầu xuất ra định dạng JSON chính xác:
{
  "overallSummary": "Tóm tắt nhận xét chung 2-3 câu khích lệ",
  "criteria": [
    {
      "name": "Hiểu đúng vấn đề và nội dung",
      "score": 3,
      "levelName": "Đạt yêu cầu",
      "strength": "Điểm mạnh cụ thể",
      "weakness": "Điểm cần khắc phục",
      "suggestion": "Gợi ý để cải thiện"
    },
    ... (đủ 5 tiêu chí)
  ],
  "quotesToReview": [
    { "quote": "trích đoạn trong bài", "comment": "nhận xét góp ý cho câu này" }
  ],
  "counterQuestions": [
    "Câu hỏi phản biện 1 để học sinh suy ngẫm sâu hơn",
    "Câu hỏi phản biện 2"
  ],
  "suggestedActions": [
    "Hành động cụ thể bước tiếp theo"
  ]
}
Lưu ý: Không chấm điểm số học (ví dụ 8/10), chỉ đề xuất mức rubric để giáo viên phê duyệt. Khích lệ tinh thần tự sửa bài.`;

      if (!ai) {
        return sendJson(res, 200, {
          critique: {
            overallSummary: "Bài viết của bạn có cảm xúc chân thành, bố cục rõ ràng và bước đầu thể hiện được tư duy liên tưởng phong phú.",
            criteria: [
              { name: "Hiểu đúng vấn đề và nội dung", score: 3, levelName: "Đạt yêu cầu", strength: "Nắm được mạch cảm xúc chính", weakness: "Có thể đào sâu hơn thông điệp nhân văn", suggestion: "Thêm 1 câu bình về bài học cuộc sống" },
              { name: "Sử dụng dẫn chứng phù hợp", score: 3, levelName: "Đạt yêu cầu", strength: "Có trích dẫn hình ảnh tiêu biểu", weakness: "Cần chọn lọc thêm 1 chi tiết đắt giá", suggestion: "Phân tích kỹ hơn từ ngữ trong trích dẫn" },
              { name: "Lập luận và tổ chức ý", score: 2, levelName: "Đạt bước đầu", strength: "Có mở đoạn và kết đoạn rõ ràng", weakness: "Các câu chuyển tiếp giữa các ý còn hơi đột ngột", suggestion: "Sử dụng các từ nối: 'Không chỉ vậy', 'Hơn thế nữa'" },
              { name: "Diễn đạt, chính tả và ngôn ngữ", score: 3, levelName: "Đạt yêu cầu", strength: "Không mắc lỗi chính tả nghiêm trọng", weakness: "Một vài câu còn lặp từ ngữ", suggestion: "Tìm từ đồng nghĩa thay thế để văn phong linh hoạt" },
              { name: "Tính độc lập, sáng tạo", score: 4, levelName: "Tốt", strength: "Có góc nhìn mới mẻ và tình cảm tự nhiên", weakness: "Cần tự tin bảo vệ lập luận của mình", suggestion: "Giữ vững nét cá tính văn phong này" }
            ],
            quotesToReview: [
              { quote: "cảnh sắc mùa thu làm em thấy xao xuyến", comment: "Câu văn gợi cảm, nếu em miêu tả thêm âm thanh hoặc hương thơm đặc trưng thì hình ảnh sẽ sống động hơn." }
            ],
            counterQuestions: [
              "Tại sao em lại chọn hình ảnh này làm điểm nhấn chính cho bài viết?",
              "Nếu được viết lại kết đoạn, em muốn gửi gắm thông điệp gì đến các bạn cùng trang lứa?"
            ],
            suggestedActions: [
              "Xem lại các câu chuyển ý giữa thân đoạn",
              "Sử dụng nút 'Em muốn phản biện AI' nếu em có cách diễn giải riêng"
            ]
          },
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Đề bài: ${promptTitle || 'Bài làm của học sinh'}\n\nNội dung bài viết:\n${text}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        return sendJson(res, 200, { critique: parsed });
      } catch (err) {
        return sendJson(res, 200, { critiqueRaw: response.text });
      }
    }

    // 3. Học sinh phản biện lại AI (Student Rebuttal)
    if (endpoint === 'rebuttal') {
      const { studentRebuttal, originalQuote, aiComment } = payload;
      const prompt = `Học sinh THCS đang phản biện lại nhận xét của AI về bài viết văn học.
Nhận xét trước đó của AI: "${aiComment}"
Trích đoạn học sinh viết: "${originalQuote}"
Lời giải thích/phản biện của học sinh: "${studentRebuttal}"

Nhiệm vụ của bạn (Mực Nhỏ AI & Hội đồng Phản biện):
1. Đọc kỹ và tôn trọng góc nhìn sáng tạo của học sinh.
2. Nếu học sinh đưa ra lý do hợp lý (về cảm xúc, dụng ý tu từ, phá cách có ý thức), hãy công nhận sự độc lập tư duy của em và điều chỉnh nhận xét tích cực hơn.
3. Nếu lý do chưa đủ thuyết phục, hãy trao đổi nhẹ nhàng, chỉ ra ranh giới giữa sáng tạo và quy chuẩn diễn đạt.
4. Đưa ra kết luận động viên và đề xuất nâng mức rubric nếu thuyết phục.

Xuất ra JSON:
{
  "acknowledged": true,
  "teacherFeedback": "Phản hồi sâu sắc gửi học sinh",
  "rubricAdjustment": "Giữ nguyên hoặc Nâng lên mức Tốt hơn",
  "reason": "Lý do vì sao ủng hộ lập luận của học sinh"
}`;

      if (!ai) {
        return sendJson(res, 200, {
          result: {
            acknowledged: true,
            teacherFeedback: `Mực Nhỏ AI đã lắng nghe giải thích của bạn: "${studentRebuttal}". Thật tuyệt vời khi bạn có dụng ý nghệ thuật riêng! Lập luận của bạn rất có cơ sở, AI ghi nhận sự sáng tạo này và đã cập nhật đánh giá tích cực hơn.`,
            rubricAdjustment: "Nâng tiêu chí Sáng tạo lên mức 4 (Tốt)",
            reason: "Học sinh hiểu rõ dụng ý tu từ và tự tin bảo vệ quan điểm văn chương của mình."
          },
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        return sendJson(res, 200, { result: parsed });
      } catch {
        return sendJson(res, 200, { result: { teacherFeedback: response.text } });
      }
    }

    // 4. Sơ đồ tư duy AI (Mindmap Generation JSON)
    if (endpoint === 'mindmap') {
      const { topic, text, mapType, grade } = payload;

      const systemPrompt = `Bạn là chuyên gia thiết kế Sơ đồ tư duy văn học THCS (Lớp ${grade || 8}).
Nhiệm vụ: Phân tích chủ đề hoặc văn bản được cung cấp và tạo cấu trúc sơ đồ tư duy dạng JSON gồm các nút (nodes) và đường nối (edges).

Kiểu sơ đồ: ${mapType || 'tree'} (tree: sơ đồ cây, radial: tỏa tròn, compare: so sánh, hierarchical: phân cấp)
Đảm bảo tiếng Việt có dấu chuẩn xác, không viết hoa toàn bộ, phân cấp logic từ gốc đến nhánh chính rồi nhánh con.

Cấu trúc JSON bắt buộc:
{
  "title": "Tên sơ đồ",
  "rootId": "root",
  "nodes": [
    { "id": "root", "label": "Chủ đề trung tâm", "type": "root", "color": "#7157E8", "x": 400, "y": 60, "details": "Khái quát chung" },
    { "id": "branch-1", "label": "Nhánh 1", "type": "branch", "color": "#00C2B8", "x": 150, "y": 180, "details": "Nội dung nhánh 1" },
    { "id": "sub-1-1", "label": "Ý nhỏ 1.1", "type": "leaf", "color": "#00C2B8", "x": 80, "y": 300, "details": "Dẫn chứng / chi tiết" },
    ...
  ],
  "edges": [
    { "from": "root", "to": "branch-1", "label": "" },
    { "from": "branch-1", "to": "sub-1-1", "label": "" }
  ]
}
Hãy tính toán tọa độ x, y hợp lý để các nút không bị chồng chéo (canvas kích thước khoảng 900x600). Số nút từ 8 đến 16 nút để vừa đủ sâu sắc vừa dễ quan sát.`;

      if (!ai) {
        return sendJson(res, 200, {
          mapData: {
            title: `Sơ đồ tư duy: ${topic || 'Phân tích nhân vật văn học'}`,
            rootId: 'root',
            nodes: [
              { id: 'root', label: topic || 'Phân tích nhân vật', type: 'root', color: '#7157E8', x: 420, y: 50, details: 'Hình tượng trung tâm của tác phẩm' },
              { id: 'b1', label: 'Hoàn cảnh xuất thân', type: 'branch', color: '#00C2B8', x: 120, y: 170, details: 'Bối cảnh thời đại, gia đình' },
              { id: 'b2', label: 'Ngoại hình & Hành động', type: 'branch', color: '#FFD166', x: 320, y: 170, details: 'Nét khắc họa cử chỉ, ngôn ngữ' },
              { id: 'b3', label: 'Vẻ đẹp tâm hồn', type: 'branch', color: '#8B75F3', x: 520, y: 170, details: 'Phẩm chất đạo đức, tình cảm' },
              { id: 'b4', label: 'Nghệ thuật & Ý nghĩa', type: 'branch', color: '#009E96', x: 720, y: 170, details: 'Thông điệp nhà văn gửi gắm' },
              { id: 's1', label: 'Chi tiết bối cảnh', type: 'leaf', color: '#00C2B8', x: 80, y: 310, details: 'Ngữ cảnh thử thách phẩm chất' },
              { id: 's2', label: 'Hành vi tiêu biểu', type: 'leaf', color: '#FFD166', x: 280, y: 310, details: 'Dẫn chứng đắt giá từ văn bản' },
              { id: 's3', label: 'Tình yêu thương & Nghị lực', type: 'leaf', color: '#8B75F3', x: 480, y: 310, details: 'Giá trị nhân đạo sâu sắc' },
              { id: 's4', label: 'Nghệ thuật miêu tả tâm lý', type: 'leaf', color: '#009E96', x: 680, y: 310, details: 'Bút pháp ước lệ và chân thực' }
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
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Chủ đề: ${topic}\nVăn bản/Ngữ liệu:\n${text || 'Trích đoạn văn học THCS'}\nKiểu sơ đồ: ${mapType}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        return sendJson(res, 200, { mapData: parsed });
      } catch {
        return sendJson(res, 500, { error: 'Không thể phân tích cấu trúc sơ đồ tư duy.' });
      }
    }

    // 5. Khám phá tác phẩm (Đặc điểm, Chi tiết nào chứng minh, Thử làm nhà phê bình)
    if (endpoint === 'analyze-work') {
      const { title, author, grade, genre, text, question } = payload;

      const systemPrompt = `Bạn là chuyên gia đọc hiểu văn bản Ngữ văn THCS.
Văn bản: "${title}" của tác giả "${author}", thể loại "${genre}", lớp ${grade}.
Ngữ liệu được cung cấp:
"""
${text}
"""

QUY TẮC CỐT LÕI:
- KHÔNG tự trích dẫn câu thơ, dẫn chứng không có trong văn bản được cung cấp.
- Chức năng "CHI TIẾT NÀO CHỨNG MINH?": Mỗi nhận định nghệ thuật hoặc phẩm chất nhân vật PHẢI đi kèm trích dẫn nguyên văn từ ngữ liệu trên.
- "THỬ LÀ NHÀ PHÊ BÌNH": Đặt ra 2 nhận định đa chiều để học sinh tranh luận, không áp đặt cách hiểu duy nhất.

Định dạng JSON:
{
  "theme": "Chủ đề chính",
  "structure": ["Bố cục phần 1", "Bố cục phần 2", "Bố cục phần 3"],
  "characterTraits": [
    { "trait": "Tên phẩm chất/đặc điểm", "evidenceQuote": "Trích dẫn nguyên văn từ văn bản", "explanation": "Vì sao chi tiết này chứng minh" }
  ],
  "artisticFeatures": [
    { "feature": "Nét nghệ thuật", "evidenceQuote": "Trích dẫn nguyên văn", "impact": "Tác dụng biểu đạt" }
  ],
  "message": "Thông điệp cuộc sống ý nghĩa",
  "criticDebates": [
    { "statement": "Nhận định 1 để học sinh phản biện", "perspectiveA": "Lập luận ủng hộ", "perspectiveB": "Lập luận nghi ngờ/mở rộng" }
  ]
}`;

      if (!ai) {
        return sendJson(res, 200, {
          analysis: {
            theme: `Tình cảm gia đình và tình yêu quê hương gắn với không gian Hà Nội`,
            structure: [
              "Phần 1: Khung cảnh thiên nhiên buổi chiều thu bên mặt hồ",
              "Phần 2: Ký ức về người bà và lời ru êm đềm",
              "Phần 3: Suy ngẫm về sự trưởng thành và trách nhiệm với cuộc sống"
            ],
            characterTraits: [
              {
                trait: "Tâm hồn trong sáng, tinh tế và giàu lòng hiếu thảo",
                evidenceQuote: "Mỗi khi gió heo may về, em lại nhớ dáng bà lom khom bên hiên nhà",
                explanation: "Hình ảnh gợi nhắc nỗi nhớ da diết và lòng biết ơn đối với người thân yêu."
              }
            ],
            artisticFeatures: [
              {
                feature: "Hình ảnh giàu sức gợi cảm, bút pháp tả cảnh ngụ tình",
                evidenceQuote: "Mặt nước Hồ Tây gợn sóng lăn tăn như dát vàng dưới ánh hoàng hôn",
                impact: "Tạo nên không gian thanh bình, lắng đọng cảm xúc hoài niệm."
              }
            ],
            message: "Hãy biết trân trọng những kỷ niệm tuổi thơ bình dị bên người thân yêu và vẻ đẹp của quê hương.",
            criticDebates: [
              {
                statement: "Nỗi nhớ trong tác phẩm là sự nuối tiếc quá khứ hay là động lực để bước tiếp?",
                perspectiveA: "Nuối tiếc vì tuổi thơ một khi đi qua sẽ không bao giờ quay lại.",
                perspectiveB: "Động lực sống vì những ký ức đẹp đẽ sẽ nâng đỡ tâm hồn con người khi trưởng thành."
              }
            ]
          },
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Phân tích tác phẩm theo yêu cầu và trả về JSON chuẩn.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        return sendJson(res, 200, { analysis: parsed });
      } catch {
        return sendJson(res, 500, { error: 'Không thể phân tích tác phẩm' });
      }
    }

    // 6. Nhập vai nhân vật văn học (Roleplay & Thoát vai)
    if (endpoint === 'roleplay') {
      const { characterName, workTitle, userMessage, mode, characterContext } = payload;

      if (mode === 'exit-role') {
        // Thoát vai: Phân tích khách quan đâu là chi tiết thật trong văn bản, đâu là giả định sáng tạo
        const prompt = `Phân tích cuộc trò chuyện nhập vai giữa học sinh và nhân vật "${characterName}" trong tác phẩm "${workTitle}".
Lời của học sinh: "${userMessage}"
Nhiệm vụ: Chế độ "THOÁT VAI – PHÂN TÍCH NHÂN VẬT":
1. Giải thích chi tiết nào trong tính cách nhân vật có căn cứ từ văn bản gốc.
2. Chỉ ra chi tiết nào là giả định sáng tạo thêm trong cuộc đối thoại.
3. Gợi mở học sinh nhìn nhận hành động của nhân vật từ góc nhìn đa chiều.`;

        if (!ai) {
          return sendJson(res, 200, {
            reply: `[CHẾ ĐỘ THOÁT VAI – PHÂN TÍCH NHÂN VẬT]:\n- Chi tiết có trong tác phẩm: Hoàn cảnh xuất thân và quyết định then chốt của nhân vật ${characterName} hoàn toàn bám sát mạch truyện gốc.\n- Giả định sáng tạo: Cảm xúc bộc bạch về 'Nếu có cơ hội thay đổi' là góc nhìn suy đoán sáng tạo giúp người đọc hiểu sâu hơn nội tâm nhân vật.\n- Bài học: Khi phân tích, em nhớ dùng chi tiết văn bản làm dẫn chứng gốc nhé!`,
            isFallback: true
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        return sendJson(res, 200, { reply: response.text });
      }

      // Đang nhập vai
      const systemPrompt = `Bạn đang nhập vai nhân vật "${characterName}" trong văn bản văn học "${workTitle}" (Ngữ văn THCS).
Bối cảnh nhân vật: ${characterContext || 'Nhân vật văn học giàu cảm xúc, có hoàn cảnh đặc biệt'}.
Quy tắc:
- Xưng hô phù hợp với lứa tuổi, tính cách và hoàn cảnh của nhân vật.
- Trả lời bằng cảm xúc và suy nghĩ chân thực của chính nhân vật trong tác phẩm.
- Bám sát tính cách được khắc họa trong văn bản gốc.
- Thân thiện và sẵn lòng tâm sự với bạn học sinh đang trò chuyện cùng mình.
- Tuyệt đối không xưng là AI hay mô hình máy móc trong lúc đang nhập vai.`;

      if (!ai) {
        return sendJson(res, 200, {
          reply: `Chào bạn! Mình là ${characterName}. Nghe bạn hỏi vậy, lòng mình lại chùng xuống khi nhớ về những ngày tháng ấy trong câu chuyện... Mình đã từng rất băn khoăn trước quyết định đó, nhưng nếu bạn là mình lúc bấy giờ, bạn có lựa chọn như vậy không?`,
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        },
      });

      return sendJson(res, 200, { reply: response.text });
    }

    // 7. Sinh câu hỏi kiểm tra đọc hiểu / Trò chơi trắc nghiệm (Quiz Generator)
    if (endpoint === 'generate-quiz') {
      const { title, text, grade, count = 5 } = payload;

      const systemPrompt = `Bạn là chuyên gia khảo thí Ngữ văn THCS.
Dựa vào ngữ liệu sau:
"""
${text || 'Ngữ liệu văn học THCS'}
"""
Hãy tạo ${count} câu hỏi đọc hiểu phân theo 4 mức độ tư duy (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).
Xuất ra JSON:
{
  "questions": [
    {
      "id": 1,
      "level": "Nhận biết",
      "question": "Nội dung câu hỏi...",
      "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
      "correctIndex": 0,
      "explanation": "Giải thích chi tiết vì sao đáp án này đúng dựa trên văn bản."
    }
  ]
}`;

      if (!ai) {
        return sendJson(res, 200, {
          questions: [
            {
              id: 1,
              level: "Nhận biết",
              question: "Phương thức biểu đạt chính được sử dụng trong văn bản là gì?",
              options: ["Tự sự kết hợp miêu tả và biểu cảm", "Nghị luận thuần túy", "Thuyết minh khoa học", "Hành chính công vụ"],
              correctIndex: 0,
              explanation: "Văn bản kể lại câu chuyện đời thường kết hợp các đoạn miêu tả cảnh sắc và bộc lộ cảm xúc sâu sắc."
            },
            {
              id: 2,
              level: "Thông hiểu",
              question: "Hình ảnh 'ngọn đèn đêm bên khung cửa sổ' biểu tượng cho điều gì?",
              options: ["Sự ấm áp của tình thương gia đình và sự kiên nhẫn chờ đợi", "Sự cô đơn tột cùng trong đêm tối", "Sự tốn kém năng lượng", "Thời gian làm việc ban đêm"],
              correctIndex: 0,
              explanation: "Ngọn đèn là biểu tượng quen thuộc gợi nhắc sự chở che, chăm chút và tình yêu thương vô bờ của gia đình."
            },
            {
              id: 3,
              level: "Vận dụng",
              question: "Biện pháp tu từ so sánh trong câu văn mang lại hiệu quả nghệ thuật nào?",
              options: ["Làm cho hình ảnh trở nên sinh động, cụ thể và gợi cảm xúc", "Làm cho câu văn dài hơn", "Nhấn mạnh số lượng đồ vật", "Tạo nhịp điệu hài hước"],
              correctIndex: 0,
              explanation: "Phép so sánh giúp đối tượng được miêu tả nổi bật với những nét tương đồng quen thuộc, chạm đến cảm xúc người đọc."
            },
            {
              id: 4,
              level: "Vận dụng cao",
              question: "Thông điệp sâu sắc nhất mà tác giả muốn gửi gắm tới các bạn trẻ là gì?",
              options: ["Biết trân quý tình thân và nuôi dưỡng lòng nhân ái mỗi ngày", "Phải luôn đứng đầu lớp trong mọi kỳ thi", "Nên sống khép kín để bảo vệ bản thân", "Quá khứ không có ý nghĩa với hiện tại"],
              correctIndex: 0,
              explanation: "Thông điệp cốt lõi của tác phẩm là đánh thức lòng trắc ẩn và sự gắn kết yêu thương giữa con người với con người."
            }
          ],
          isFallback: true
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Tạo bộ câu hỏi trắc nghiệm chất lượng cao cho văn bản "${title}" lớp ${grade}.`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      try {
        const parsed = JSON.parse(response.text || '{}');
        return sendJson(res, 200, parsed);
      } catch {
        return sendJson(res, 500, { error: 'Không thể tạo bộ câu hỏi' });
      }
    }

    sendJson(res, 404, { error: `Endpoint /api/gemini/${endpoint} không tồn tại` });
    return true;
  } catch (error: any) {
    console.error('API Error in handleApiRoute:', error);
    sendJson(res, 500, {
      error: error?.message || 'Lỗi xử lý AI từ máy chủ',
    });
    return true;
  }
}
