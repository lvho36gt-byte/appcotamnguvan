import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  LogOut,
  HelpCircle,
  Lightbulb,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import type { GradeLevel } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
}

export const RoleplayModule: React.FC<Props> = ({ selectedGrade }) => {
  const characters = [
    {
      id: 'an',
      name: 'Cậu bé An',
      work: 'Hồ Tây Chiều Gió Sớm',
      grade: 8,
      avatarBg: 'bg-teal-600',
      tag: 'Nhân vật truyện ngắn tự sáng tác',
      context:
        'Cậu bé thiếu niên yêu Hà Nội, chuẩn bị chuyển vào miền Nam cùng bố mẹ, có hành động thả cá rô nhỏ trở lại lòng Hồ Tây.',
      suggestedQuestions: [
        'Vì sao bạn lại quyết định thả chú cá rô nhỏ thay vì mang về nhà?',
        'Nếu có cơ hội ở lại Hà Nội, bạn sẽ làm gì cùng người bạn thân?',
        'Bạn mong muốn người đọc nhớ về bạn qua phẩm chất nào nhất?',
        'Bạn có cảm thấy buồn khi phải rời xa mặt nước Hồ Tây không?',
      ],
    },
    {
      id: 'com_girl',
      name: 'Cô bé gói Cốm',
      work: 'Hương Cốm Mùa Cúc Vàng',
      grade: 7,
      avatarBg: 'bg-amber-600',
      tag: 'Nhân vật văn hóa Tràng An',
      context:
        'Cô bé lớn lên bên gánh cốm làng Vòng, yêu nét văn hóa ẩm thực truyền thống của Thủ đô.',
      suggestedQuestions: [
        'Điều gì làm nên hương vị đặc biệt nhất của hạt cốm làng Vòng?',
        'Bạn có sợ những món quà truyền thống bị lãng quên trong nhịp sống hiện đại không?',
      ],
    },
    {
      id: 'de_men',
      name: 'Dế Mèn',
      work: 'Bài học đường đời đầu tiên',
      grade: 6,
      avatarBg: 'bg-emerald-700',
      tag: 'Truyện đồng thoại kinh điển',
      context:
        'Chàng Dế Mèn cường tráng nhưng kiêu ngạo, vừa trải qua biến cố đau lòng với Dế Choắt.',
      suggestedQuestions: [
        'Giây phút Dế Choắt trút hơi thở cuối cùng, bạn đã ân hận như thế nào?',
        'Nếu được làm lại, bạn sẽ đối xử với những người yếu thế ra sao?',
      ],
    },
  ];

  const [selectedCharId, setSelectedCharId] = useState('an');
  const currentChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const [dialogue, setDialogue] = useState<
    Array<{ role: 'user' | 'character' | 'analysis'; text: string; timestamp: string }>
  >([
    {
      role: 'character',
      text: `Chào bạn! Mình là ${currentChar.name}. Mình đang ngồi bên bờ hồ ngắm những con sóng thu lăn tăn. Bạn muốn trò chuyện cùng mình về điều gì?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [inAnalysisMode, setInAnalysisMode] = useState(false);

  const handleSelectCharacter = (id: string) => {
    setSelectedCharId(id);
    const chosen = characters.find((c) => c.id === id) || characters[0];
    setInAnalysisMode(false);
    setDialogue([
      {
        role: 'character',
        text: `Chào bạn! Mình là ${chosen.name}. Hôm nay chúng mình cùng tâm sự về câu chuyện của mình nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputMessage).trim();
    if (!text || loading) return;

    const userEntry = {
      role: 'user' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setDialogue((prev) => [...prev, userEntry]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await GeminiService.roleplay({
        characterName: currentChar.name,
        workTitle: currentChar.work,
        userMessage: text,
        mode: inAnalysisMode ? 'exit-role' : 'roleplay',
        characterContext: currentChar.context,
      });

      setDialogue((prev) => [
        ...prev,
        {
          role: inAnalysisMode ? 'analysis' : 'character',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setDialogue((prev) => [
        ...prev,
        {
          role: 'character',
          text: 'Mình đã lắng nghe câu hỏi của bạn. Đó thực sự là điều làm mình trăn trở suốt bao ngày qua...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Exit role & analyze
  const handleExitRoleAnalysis = async () => {
    setInAnalysisMode(true);
    setLoading(true);

    try {
      const res = await GeminiService.roleplay({
        characterName: currentChar.name,
        workTitle: currentChar.work,
        userMessage: 'Hãy tổng kết và đối chiếu chi tiết trong cuộc đối thoại vừa rồi.',
        mode: 'exit-role',
        characterContext: currentChar.context,
      });

      setDialogue((prev) => [
        ...prev,
        {
          role: 'analysis',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#583ECE] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#111E3D] font-black text-xs">
              MODULE 07
            </span>
            <span className="text-xs text-indigo-200">Đồng cảm thẩm mỹ & Nhập vai</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Đối Thoại Cùng Nhân Vật Văn Học
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            AI mô phỏng tính cách, ngôn ngữ và hoàn cảnh của nhân vật. Tích hợp nút <strong>"Thoát vai – Phân tích nhân vật"</strong> để làm rõ ranh giới giữa chi tiết có thật trong văn bản và giả định sáng tạo.
          </p>
        </div>

        <button
          onClick={handleExitRoleAnalysis}
          disabled={loading}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4 text-slate-900" />
          <span>Thoát vai – Phân tích nhân vật</span>
        </button>
      </div>

      {/* Character Selector & Dialogue Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Character List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Chọn nhân vật đối thoại:
            </span>

            <div className="space-y-2">
              {characters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    selectedCharId === char.id
                      ? 'bg-[#111E3D] text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${char.avatarBg} text-white font-bold flex items-center justify-center shrink-0`}
                  >
                    {char.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{char.name}</p>
                    <p className={`text-[11px] truncate ${selectedCharId === char.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {char.work}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#00C2B8] font-semibold">
                      {char.tag}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Disclaimer badge */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-[#7157E8] flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Quy định an toàn học đường:
              </span>
              <p>
                Đây là cuộc hội thoại mô phỏng bằng AI nhằm mục đích phát triển năng lực đọc hiểu và cảm thụ văn học.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Chat Dialogue Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[520px] overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${currentChar.avatarBg} text-white font-bold flex items-center justify-center`}>
                  {currentChar.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    Đối thoại với: {currentChar.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Văn bản: {currentChar.work}
                  </p>
                </div>
              </div>

              {inAnalysisMode && (
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
                  Chế độ Phân tích văn bản
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {dialogue.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isAnalysis = msg.role === 'analysis';

                return (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${
                      isUser ? 'self-end ml-auto flex-row-reverse' : 'self-start'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                        isUser
                          ? 'bg-[#111E3D] text-[#FFD166]'
                          : isAnalysis
                          ? 'bg-amber-500 text-white'
                          : currentChar.avatarBg + ' text-white'
                      }`}
                    >
                      {isUser ? 'Em' : isAnalysis ? 'PT' : currentChar.name[0]}
                    </div>

                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? 'bg-[#111E3D] text-white'
                          : isAnalysis
                          ? 'bg-amber-50 text-slate-800 border-2 border-amber-300 font-sans'
                          : 'bg-white text-slate-800 border border-slate-200 font-serif'
                      }`}
                    >
                      {isAnalysis && (
                        <p className="font-bold text-amber-900 font-sans text-xs mb-1">
                          📊 GÓC PHÂN TÍCH VĂN BẢN (THOÁT VAI):
                        </p>
                      )}
                      <p className="whitespace-pre-line">{msg.text}</p>
                      <span className="block text-[10px] text-slate-400 mt-2 font-sans">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-[#7157E8] animate-spin" />
                  <span>{currentChar.name} đang suy ngẫm câu trả lời...</span>
                </div>
              )}
            </div>

            {/* Suggested Question Pills */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Hỏi nhanh:</span>
              {currentChar.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#7157E8]/10 hover:text-[#7157E8] text-slate-600 text-xs transition-colors border border-slate-200/60"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Nhập câu hỏi bạn muốn tâm sự cùng ${currentChar.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#7157E8]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-2.5 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
