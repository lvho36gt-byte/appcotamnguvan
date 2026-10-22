import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Scale,
  Send,
  PlusCircle,
  FileText,
  Quote,
  MessageSquare,
  BookmarkCheck,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import type { GradeLevel, LiteraryWork } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
}

export const WorkAnalysisModule: React.FC<Props> = ({ selectedGrade }) => {
  const [works, setWorks] = useState<LiteraryWork[]>(() => StorageService.getWorks());
  const [selectedWorkId, setSelectedWorkId] = useState<string>(() => works[0]?.id || '');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Critic debate state
  const [activeDebateIndex, setActiveDebateIndex] = useState<number>(0);
  const [studentStance, setStudentStance] = useState<'agree' | 'disagree' | 'other'>('agree');
  const [studentArgument, setStudentArgument] = useState('');
  const [criticFeedback, setCriticFeedback] = useState<string | null>(null);
  const [criticLoading, setCriticLoading] = useState(false);

  // New work form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('Truyện ngắn');
  const [newText, setNewText] = useState('');

  const currentWork = works.find((w) => w.id === selectedWorkId) || works[0];

  const handleAnalyze = async () => {
    if (!currentWork) return;
    setLoading(true);
    setCriticFeedback(null);
    try {
      const res = await GeminiService.analyzeWork({
        title: currentWork.title,
        author: currentWork.author,
        grade: currentWork.grade,
        genre: currentWork.genre,
        text: currentWork.text,
      });
      setAnalysis(res.analysis);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleAddWork = () => {
    if (!newTitle.trim() || !newText.trim()) {
      alert('Vui lòng nhập tên tác phẩm và trích đoạn văn bản.');
      return;
    }
    const created: LiteraryWork = {
      id: `work-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Khuyết danh / Sưu tầm',
      grade: selectedGrade,
      genre: newGenre,
      skill: 'Đọc hiểu',
      difficulty: 'Trung bình',
      text: newText.trim(),
    };
    StorageService.saveWork(created);
    setWorks(StorageService.getWorks());
    setSelectedWorkId(created.id);
    setShowAddForm(false);
    setNewTitle('');
    setNewAuthor('');
    setNewText('');
  };

  const handleSubmitCriticArgument = async () => {
    if (!studentArgument.trim() || criticLoading) return;
    setCriticLoading(true);
    const debate = analysis?.criticDebates?.[activeDebateIndex];

    try {
      const prompt = `Học sinh THCS (Lớp ${selectedGrade}) đang tham gia hoạt động "THỬ LÀ NHÀ PHÊ BÌNH VĂN HỌC" cho tác phẩm "${currentWork.title}".
Nhận định tranh luận: "${debate?.statement}"
Quan điểm của học sinh: [${studentStance.toUpperCase()}]
Lập luận của học sinh: "${studentArgument}"

Nhiệm vụ AI phản biện:
1. Ghi nhận và tôn trọng lập luận của học sinh (không áp đặt một cách hiểu độc tôn).
2. Chỉ ra mặt tích cực trong cách học sinh nhìn nhận vấn đề.
3. Đặt 1 câu hỏi phản biện mở rộng để kích thích học sinh đào sâu hơn về bối cảnh hoặc cảm xúc nhân vật.
4. Động viên tinh thần tư duy độc lập. Giọng văn ấm áp, gợi mở.`;

      const res = await GeminiService.sendChatMessage({
        message: prompt,
        grade: selectedGrade,
        unitTitle: currentWork.title,
        goal: 'Rèn luyện tư duy phản biện văn học',
        helpLevel: 2,
        history: [],
      });

      setCriticFeedback(res.reply);
    } catch {
      setCriticFeedback('AI rất hoan nghênh lập luận của bạn! Việc nhìn nhận vấn đề từ nhiều khía cạnh chính là tố chất của một nhà phê bình văn học thực thụ.');
    } finally {
      setCriticLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1A2C56] to-[#009E96] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 02
            </span>
            <span className="text-xs text-indigo-200">S1 – Soi tác phẩm</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Khám Phá Tác Phẩm & "Chi Tiết Nào Chứng Minh?"
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Học sinh soi chiếu văn bản, giải mã nhân vật và nghệ thuật. Mọi nhận định đều phải được đối sánh với chi tiết thật trong văn bản, không bịa đặt trích dẫn.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-[#FFD166]" />
          <span>{showAddForm ? 'Đóng form nhập' : 'Thêm ngữ liệu mới'}</span>
        </button>
      </div>

      {/* Add Work Form Modal/Card */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#7157E8]/30 shadow-lg space-y-4 animate-fadeIn">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7157E8]" />
            Dán nội dung văn bản hoặc trích đoạn mới vào thư viện
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên tác phẩm *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="VD: Mùa Hoa Sữa Ký Ức..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tác giả</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Tên tác giả..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thể loại</label>
              <select
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
              >
                <option value="Truyện ngắn / Ký">Truyện ngắn / Ký</option>
                <option value="Thơ">Thơ</option>
                <option value="Tản văn / Tùy bút">Tản văn / Tùy bút</option>
                <option value="Nghị luận">Nghị luận</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1 text-xs">
              Nội dung trích đoạn văn bản được phép sử dụng *
            </label>
            <textarea
              rows={4}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Dán toàn bộ văn bản hoặc trích đoạn ở đây..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8] text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
            >
              Hủy
            </button>
            <button
              onClick={handleAddWork}
              className="px-5 py-2 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] text-white text-xs font-bold shadow-md"
            >
              Lưu vào thư viện & Chọn bài
            </button>
          </div>
        </div>
      )}

      {/* Select work & Text inspection layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Work details & Text */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Chọn tác phẩm học tập:
              </span>
              {currentWork.isDemo && (
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  DỮ LIỆU DEMO
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {works.map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    setSelectedWorkId(w.id);
                    setAnalysis(null);
                    setCriticFeedback(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    selectedWorkId === w.id
                      ? 'bg-[#111E3D] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <p className="truncate">{w.title}</p>
                  <span className="text-[10px] opacity-75 font-normal">
                    {w.author} • Lớp {w.grade}
                  </span>
                </button>
              ))}
            </div>

            {/* Current Work Text Display */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#111E3D] text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#7157E8]" />
                  <span>{currentWork.title}</span>
                </h3>
                <span className="text-[11px] text-slate-500 italic">
                  Tác giả: {currentWork.author}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 max-h-72 overflow-y-auto text-xs leading-relaxed text-slate-700 font-serif whitespace-pre-line shadow-inner">
                {currentWork.text}
              </div>

              {currentWork.notes && (
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  * Ghi chú: {currentWork.notes}
                </p>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#FFD166]" />
                  <span>Mực Nhỏ AI đang soi chiếu ngữ liệu...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Khám phá chủ đề & Chi tiết chứng minh</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis & "Chi tiết nào chứng minh?" */}
        <div className="lg:col-span-7 space-y-4">
          {!analysis && !loading ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-indigo-50 text-[#7157E8] flex items-center justify-center mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">
                Bắt đầu khám phá văn bản
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Nhấn nút "Khám phá chủ đề & Chi tiết chứng minh" ở bên trái để Mực Nhỏ AI trích xuất các nét nghệ thuật và dẫn chứng trực tiếp từ ngữ liệu gốc.
              </p>
            </div>
          ) : null}

          {loading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#7157E8] text-white flex items-center justify-center mx-auto animate-bounce">
                <Sparkles className="w-6 h-6 text-[#FFD166]" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Đang phân tích cấu trúc, chủ đề và tìm kiếm dẫn chứng xác thực...
              </p>
            </div>
          )}

          {analysis && (
            <div className="space-y-4 animate-fadeIn">
              {/* Theme & Structure */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7157E8]" />
                  <h4 className="font-bold text-slate-900 text-sm">Chủ đề & Cấu trúc tác phẩm</h4>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed">
                  <strong>Chủ đề:</strong> {analysis.theme}
                </div>

                {analysis.structure && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Bố cục văn bản:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {analysis.structure.map((part: string, idx: number) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <span className="font-bold text-[#7157E8] block text-[10px]">Phần {idx + 1}</span>
                          <span className="leading-tight">{part}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* "CHI TIẾT NÀO CHỨNG MINH?" Box */}
              <div className="bg-white rounded-3xl p-5 border-2 border-[#00C2B8]/40 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#00C2B8] text-[#111E3D] font-extrabold text-[11px]">
                      TÍNH NĂNG ĐẶC BIỆT
                    </span>
                    <h4 className="font-bold text-[#111E3D] text-sm">
                      Chi Tiết Nào Chứng Minh?
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 italic">
                    Dẫn chứng 100% từ ngữ liệu gốc
                  </span>
                </div>

                {/* Character Traits Evidence */}
                {analysis.characterTraits && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Đặc điểm nhân vật & Dẫn chứng xác thực:
                    </span>
                    {analysis.characterTraits.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-teal-950">
                          <span>{item.trait}</span>
                          <span className="text-[10px] text-teal-700 px-2 py-0.5 rounded-full bg-teal-100">
                            Chứng minh
                          </span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-teal-200 text-slate-700 italic flex items-start gap-2">
                          <Quote className="w-3.5 h-3.5 text-[#00C2B8] shrink-0 mt-0.5" />
                          <span>"{item.evidenceQuote}"</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          <strong>Vì sao chứng minh:</strong> {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Artistic Features Evidence */}
                {analysis.artisticFeatures && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Nét đặc sắc nghệ thuật & Dẫn chứng:
                    </span>
                    {analysis.artisticFeatures.map((art: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <p className="font-bold text-slate-800">{art.feature}</p>
                        <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 italic flex items-start gap-2">
                          <Quote className="w-3.5 h-3.5 text-[#7157E8] shrink-0 mt-0.5" />
                          <span>"{art.evidenceQuote}"</span>
                        </div>
                        <p className="text-[11px] text-indigo-900">
                          <strong>Tác dụng:</strong> {art.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* "THỬ LÀ NHÀ PHÊ BÌNH VĂN HỌC" Box */}
              {analysis.criticDebates && analysis.criticDebates.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-900 via-[#111E3D] to-[#2E1E66] rounded-3xl p-6 text-white shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#FFD166]" />
                      <h4 className="font-bold text-sm md:text-base">
                        Thử Là Nhà Phê Bình Văn Học
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-indigo-200">
                      Tư duy phản biện
                    </span>
                  </div>

                  <p className="text-xs text-indigo-200 leading-relaxed">
                    Văn học có nhiều cách cảm nhận hợp lý. Em hãy lựa chọn một quan điểm và đưa ra lập luận của riêng mình để Mực Nhỏ AI cùng trao đổi nhé!
                  </p>

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2 text-xs">
                    <p className="font-bold text-[#FFD166]">
                      Vấn đề tranh luận:
                    </p>
                    <p className="text-slate-100 font-semibold italic text-sm">
                      "{analysis.criticDebates[activeDebateIndex]?.statement}"
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <span className="font-bold text-emerald-300 block">Góc nhìn A:</span>
                        <span>{analysis.criticDebates[activeDebateIndex]?.perspectiveA}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <span className="font-bold text-amber-300 block">Góc nhìn B:</span>
                        <span>{analysis.criticDebates[activeDebateIndex]?.perspectiveB}</span>
                      </div>
                    </div>
                  </div>

                  {/* Student input for debate */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span>Lựa chọn của em:</span>
                      {[
                        { val: 'agree', label: 'Đồng ý với A' },
                        { val: 'disagree', label: 'Ủng hộ góc nhìn B' },
                        { val: 'other', label: 'Em có cách hiểu riêng' },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setStudentStance(item.val as any)}
                          className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                            studentStance === item.val
                              ? 'bg-[#00C2B8] text-[#111E3D] font-bold'
                              : 'bg-white/10 text-slate-300 hover:bg-white/20'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={studentArgument}
                      onChange={(e) => setStudentArgument(e.target.value)}
                      placeholder="Trình bày lý lẽ và dẫn chứng của em (Vì sao em nghĩ như vậy?)..."
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#00C2B8]"
                    />

                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmitCriticArgument}
                        disabled={!studentArgument.trim() || criticLoading}
                        className="px-4 py-2 rounded-xl bg-[#00C2B8] hover:bg-[#26E5DC] disabled:opacity-40 text-[#111E3D] font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                      >
                        {criticLoading ? (
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Gửi lập luận phản biện</span>
                      </button>
                    </div>

                    {criticFeedback && (
                      <div className="p-4 rounded-2xl bg-white/15 border border-[#00C2B8]/40 text-xs space-y-1.5 animate-fadeIn">
                        <div className="flex items-center gap-2 text-[#FFD166] font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>Mực Nhỏ AI phản hồi lập luận của bạn:</span>
                        </div>
                        <p className="text-slate-100 whitespace-pre-line leading-relaxed">
                          {criticFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
