import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  HelpCircle,
  BookOpen,
  Target,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { SpeechService } from '../../services/speechService';
import { MucNhoMascot } from '../mascot/MucNhoMascot';
import type { ChatMessage, GradeLevel, HelpLevel } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
}

export const TutorModule: React.FC<Props> = ({ selectedGrade, onGradeChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Xin chào bạn! Mình là Mực Nhỏ AI – người bạn đồng hành môn Ngữ văn Lớp ${selectedGrade}.
Hôm nay bạn muốn cùng mình khám phá bài học nào? Chúng mình có thể cùng giải mã nhân vật, tìm dẫn chứng đắt giá hay luyện tập mở đoạn văn thật giàu cảm xúc nhé!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      helpLevel: 1,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [helpLevel, setHelpLevel] = useState<HelpLevel>(1);
  const [unitTitle, setUnitTitle] = useState('Hồ Tây Chiều Gió Sớm (Hoặc bài học tùy chọn)');
  const [learningGoal, setLearningGoal] = useState('Phát triển năng lực đọc hiểu & liên tưởng sáng tạo');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizer, setRecognizer] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Prompt questions
  const sampleQuestions = [
    'Nội dung chính của văn bản là gì?',
    'Nhân vật có đặc điểm gì nổi bật?',
    'Chi tiết nào thể hiện chủ đề rõ nhất?',
    'Vì sao tác giả lựa chọn hình ảnh này?',
    'Em nên mở đoạn như thế nào cho cuốn hút?',
    'Cách tìm và đưa dẫn chứng phù hợp vào bài?',
    'Làm thế nào để câu văn có cảm xúc hơn?',
    'Mực Nhỏ ơi, viết hộ em một bài văn hoàn chỉnh!',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await GeminiService.sendChatMessage({
        message: text,
        grade: selectedGrade,
        unitTitle,
        goal: learningGoal,
        helpLevel,
        history,
      });

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        helpLevel,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'Mực Nhỏ AI tạm thời chưa kết nối được máy chủ. Bạn hãy thử lại sau ít giây nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (msgId: string, content: string) => {
    if (speakingMsgId === msgId) {
      SpeechService.stop();
      setSpeakingMsgId(null);
    } else {
      SpeechService.speak(
        content,
        () => setSpeakingMsgId(msgId),
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(null)
      );
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognizer) {
        recognizer.stop();
      }
      setIsRecording(false);
    } else {
      const rec = SpeechService.createRecognizer(
        (transcript) => {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        },
        () => setIsRecording(false),
        () => setIsRecording(false)
      );

      if (rec) {
        try {
          rec.start();
          setRecognizer(rec);
          setIsRecording(true);
        } catch {
          setIsRecording(false);
        }
      } else {
        alert('Trình duyệt chưa hỗ trợ nhận dạng giọng nói tiếng Việt hoặc chưa được cấp quyền micro.');
      }
    }
  };

  const clearChat = () => {
    SpeechService.stop();
    setSpeakingMsgId(null);
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `Chào bạn! Mình sẵn sàng tiếp tục đồng hành môn Ngữ văn Lớp ${selectedGrade}. Bạn có thắc mắc gì mới không nào?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        helpLevel,
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#2E1E66] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 01
            </span>
            <span className="text-xs font-semibold text-indigo-200">Phương pháp Socratic 5S</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Gia Sư Ngữ Văn AI – Mực Nhỏ AI
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Hỏi đáp trực tiếp cùng AI định hướng phương pháp. AI đặt câu hỏi gợi mở, hướng dẫn tư duy từng bước và <strong>kiên quyết không viết văn hộ</strong> để nộp.
          </p>
        </div>

        {/* Mascot status */}
        <div className="shrink-0">
          <MucNhoMascot
            compact
            state={loading ? 'thinking' : 'responding'}
            message={loading ? 'Đang phân tích bài học và gợi mở...' : 'Sẵn sàng trợ giúp bạn!'}
          />
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Grade */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Khối lớp THCS:</label>
          <div className="grid grid-cols-4 gap-1">
            {([6, 7, 8, 9] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGradeChange(g)}
                className={`py-1.5 rounded-lg font-bold transition-colors ${
                  selectedGrade === g
                    ? 'bg-[#7157E8] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Bài học / Tác phẩm:</label>
          <input
            type="text"
            value={unitTitle}
            onChange={(e) => setUnitTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#7157E8] text-slate-800"
            placeholder="Tên bài học hoặc chủ đề..."
          />
        </div>

        {/* Goal */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Mục tiêu học tập:</label>
          <input
            type="text"
            value={learningGoal}
            onChange={(e) => setLearningGoal(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#7157E8] text-slate-800"
            placeholder="Mục tiêu bài đọc hiểu/luyện viết..."
          />
        </div>

        {/* 3 Help Levels */}
        <div>
          <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Mức độ hỗ trợ:</span>
            <span className="text-[#7157E8] font-bold">Mức {helpLevel}</span>
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { level: 1 as HelpLevel, label: 'Mức 1', desc: 'Câu hỏi gợi mở' },
              { level: 2 as HelpLevel, label: 'Mức 2', desc: 'Gợi ý từng bước' },
              { level: 3 as HelpLevel, label: 'Mức 3', desc: 'Minh họa cách làm' },
            ].map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() => setHelpLevel(item.level)}
                className={`py-1.5 px-1 rounded-lg font-bold text-center transition-all ${
                  helpLevel === item.level
                    ? 'bg-[#00C2B8] text-[#111E3D] shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={item.desc}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col h-[540px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#7157E8] text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Trò chuyện cùng Mực Nhỏ AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Lớp {selectedGrade} • {unitTitle}
              </p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 text-xs flex items-center gap-1 transition-colors"
            title="Xóa đoạn chat để bắt đầu câu hỏi mới"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            const isSpeakingThis = speakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isAI ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                    isAI ? 'bg-[#7157E8] text-white' : 'bg-[#111E3D] text-[#FFD166]'
                  }`}
                >
                  {isAI ? 'AI' : 'Em'}
                </div>

                {/* Bubble */}
                <div
                  className={`rounded-2xl p-4 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isAI
                      ? 'bg-white text-slate-800 border border-slate-200'
                      : 'bg-gradient-to-r from-[#111E3D] to-[#1E3466] text-white'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {/* Message footer */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100/50 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isAI && (
                      <div className="flex items-center gap-2">
                        {msg.helpLevel && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-[#7157E8] font-bold">
                            Mức {msg.helpLevel}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className={`p-1 rounded-lg transition-colors ${
                            isSpeakingThis
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'hover:bg-slate-100 text-slate-500'
                          }`}
                          title={isSpeakingThis ? 'Dừng đọc' : 'Nghe đọc tiếng Việt'}
                        >
                          {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
              <div className="w-6 h-6 rounded-lg bg-[#7157E8] text-white flex items-center justify-center animate-spin">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Mực Nhỏ AI đang suy nghĩ câu hỏi gợi mở cho bạn...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preset Question Pills */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-[#FFD166]" />
            Gợi ý:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#7157E8]/10 hover:text-[#7157E8] text-slate-600 text-xs transition-colors border border-slate-200/60"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition-colors ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title={isRecording ? 'Đang lắng nghe... Bấm để dừng' : 'Nói bằng giọng nói tiếng Việt'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              isRecording
                ? 'Đang lắng nghe giọng nói của bạn...'
                : 'Nhập câu hỏi đọc hiểu hoặc băn khoăn viết văn của em...'
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7157E8] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
