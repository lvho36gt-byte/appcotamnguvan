import React, { useState } from 'react';
import {
  PenTool,
  Save,
  Sparkles,
  Layers,
  History,
  FileCheck,
  Download,
  Printer,
  ChevronRight,
  Lightbulb,
  Check,
  AlertCircle,
  Eye,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import type { GradeLevel, StudentSubmission, WritingVersion } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  onGoToCritique?: (text: string, title: string) => void;
}

export const CreativeWorkshopModule: React.FC<Props> = ({
  selectedGrade,
  onGoToCritique,
}) => {
  const genres = [
    'Viết đoạn văn cảm nhận',
    'Viết bài nghị luận văn học',
    'Viết bài nghị luận xã hội',
    'Viết truyện ngắn sáng tạo',
    'Viết tiếp câu chuyện',
    'Thay đổi kết thúc truyện',
    'Nhập vai nhân vật',
    'Viết thư gửi nhân vật',
    'Viết nhật ký nhân vật',
    'Viết bài thơ ngắn',
    'Viết bài giới thiệu sách',
    'Viết từ góc nhìn khác',
  ];

  // Load existing submission or seed
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() =>
    StorageService.getSubmissions()
  );
  const currentSub = submissions[0];

  const [activeStep, setActiveStep] = useState<number>(4); // default on writing step
  const [selectedGenre, setSelectedGenre] = useState<string>(currentSub?.genre || 'Viết đoạn văn cảm nhận');
  const [promptTitle, setPromptTitle] = useState<string>(
    currentSub?.taskTitle || 'Cảm nhận về hành động thả cá của nhân vật An (Hồ Tây Chiều Gió Sớm)'
  );
  const [brainstormIdea, setBrainstormIdea] = useState<string>(
    'Ý tưởng: An thả cá vì tình yêu thiên nhiên, lòng hiếu thảo nhớ lời bà dặn, xem ký ức là hành trang trưởng thành.'
  );
  const [outline, setOutline] = useState<string>(
    '1. Mở đoạn: Giới thiệu nhân vật An và buổi chiều thu Hồ Tây.\n2. Thân đoạn: Phân tích tâm trạng chia tay và hành động mỉm cười thả cá rô về hồ.\n3. Kết đoạn: Khái quát bài học trưởng thành và tình cảm với quê hương.'
  );

  // Versions state
  const [versions, setVersions] = useState<WritingVersion[]>(() => currentSub?.versions || [
    {
      versionNumber: 1,
      label: 'Phiên bản 1 – Bản nháp ban đầu',
      text: 'Đọc truyện Hồ Tây Chiều Gió Sớm, em thấy An là một bạn nhỏ rất tốt bụng...',
      wordCount: 77,
      createdAt: new Date().toISOString(),
      diffSummary: 'Bản viết ban đầu',
    },
  ]);

  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(
    versions.length > 0 ? versions.length - 1 : 0
  );
  const [currentText, setCurrentText] = useState<string>(
    versions[selectedVersionIdx]?.text || ''
  );
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showDiffView, setShowDiffView] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Word count calculation
  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

  // Save as new version
  const handleSaveAsVersion = (versionLabel?: string) => {
    const nextVerNum = versions.length + 1;
    const newVer: WritingVersion = {
      versionNumber: nextVerNum,
      label: versionLabel || `Phiên bản ${nextVerNum} – Học sinh tự chỉnh sửa`,
      text: currentText,
      outline,
      createdAt: new Date().toISOString(),
      wordCount,
      diffSummary: `Đã chỉnh sửa lúc ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    const updatedVersions = [...versions, newVer];
    setVersions(updatedVersions);
    setSelectedVersionIdx(updatedVersions.length - 1);

    // Save to storage
    const updatedSub: StudentSubmission = {
      ...currentSub,
      taskTitle: promptTitle,
      genre: selectedGenre,
      versions: updatedVersions,
      currentVersionIndex: updatedVersions.length - 1,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveSubmission(updatedSub);
    setSubmissions(StorageService.getSubmissions());

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Switch viewing version
  const handleSelectVersion = (idx: number) => {
    setSelectedVersionIdx(idx);
    setCurrentText(versions[idx]?.text || '');
  };

  // Get quick AI feedback
  const handleGetAIFeedback = async () => {
    if (!currentText.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiSuggestions(null);

    try {
      const res = await GeminiService.critiqueEssay({
        text: currentText,
        promptTitle,
        grade: selectedGrade,
        genre: selectedGenre,
      });

      const rep = res.critique;
      const suggestionsText = `✨ Nhận xét chung: ${rep.overallSummary}

🔹 Điểm sáng:
${rep.criteria.slice(0, 2).map((c) => `• ${c.name}: ${c.strength}`).join('\n')}

💡 Gợi ý cải thiện:
${rep.criteria.slice(0, 2).map((c) => `• ${c.name}: ${c.suggestion}`).join('\n')}

❓ Câu hỏi khơi gợi:
${rep.counterQuestions.map((q) => `• ${q}`).join('\n')}`;

      setAiSuggestions(suggestionsText);
    } catch {
      setAiSuggestions('Mực Nhỏ AI rất ấn tượng với ý tứ của bài viết! Em hãy chú ý thêm các câu chuyển ý giữa mở - thân - kết đoạn để bài văn liền mạch hơn nhé.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Export as text file
  const handleExportText = () => {
    const content = `TRỢ LÝ VĂN HỌC SỐ AI - XƯỞNG SÁNG TẠO
Tác phẩm: ${promptTitle}
Thể loại: ${selectedGenre} | Lớp: ${selectedGrade}
Phiên bản: ${versions[selectedVersionIdx]?.label || 'Bản hoàn thiện'}
Thời gian: ${new Date().toLocaleDateString('vi-VN')}
--------------------------------------------------
DÀN Ý:
${outline}

NỘI DUNG BÀI VIẾT (${wordCount} từ):
${currentText}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bai-viet-${selectedGenre.replace(/\s+/g, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#2A1B5E] to-[#7157E8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#111E3D] font-black text-xs">
              MODULE 03
            </span>
            <span className="text-xs text-indigo-200">S3 – Sáng tạo & S5 – Sửa bài</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Xưởng Sáng Tạo – "Mỗi Học Sinh Là Một Tác Giả"
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Quy trình sáng tạo 7 bước rõ ràng: Khởi tạo ý tưởng → Lập dàn ý → Tự viết → Nhận gợi ý AI → Tự tay sửa bài. <strong>Lưu vết đầy đủ 3 phiên bản để ghi nhận sự tiến bộ.</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveAsVersion('Phiên bản hoàn thiện')}
            className="px-4 py-2.5 rounded-2xl bg-[#00C2B8] hover:bg-[#26E5DC] text-[#111E3D] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu phiên bản mới</span>
          </button>
          <button
            onClick={handleExportText}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            title="Tải văn bản bài viết"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7-Step Navigation Wizard */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center min-w-max gap-2 text-xs">
          {[
            { num: 1, label: '1. Chọn thể loại' },
            { num: 2, label: '2. Khởi tạo ý tưởng' },
            { num: 3, label: '3. Lập dàn ý' },
            { num: 4, label: '4. Tự viết bài' },
            { num: 5, label: '5. Nhận góp ý AI' },
            { num: 6, label: '6. Tự sửa bài' },
            { num: 7, label: '7. Hoàn thiện' },
          ].map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeStep === st.num
                  ? 'bg-[#111E3D] text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{st.label}</span>
              {activeStep > st.num && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Config, Ideas & Outline (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Genre & Prompt Setup */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thể loại bài viết (12 dạng):
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#7157E8]"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đề bài / Nhiệm vụ:
              </label>
              <textarea
                rows={2}
                value={promptTitle}
                onChange={(e) => setPromptTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#7157E8]"
                placeholder="Nhập đề bài của em..."
              />
            </div>

            {/* Brainstorming Ideas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Ý tưởng cốt lõi (Brainstorm):</span>
                <Lightbulb className="w-3.5 h-3.5 text-[#FFD166]" />
              </label>
              <textarea
                rows={2}
                value={brainstormIdea}
                onChange={(e) => setBrainstormIdea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-slate-800 focus:outline-none focus:border-[#7157E8]"
                placeholder="Ghi nhanh các ý tưởng, cảm xúc đầu tiên..."
              />
            </div>

            {/* Outline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dàn ý tự tạo (Mở - Thân - Kết):
              </label>
              <textarea
                rows={5}
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#7157E8] font-mono leading-relaxed"
                placeholder="Lập dàn ý các luận điểm..."
              />
            </div>
          </div>

          {/* Versions Selector Tab */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111E3D] flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#7157E8]" />
                Lịch sử phiên bản bài viết ({versions.length})
              </span>
              <button
                onClick={() => setShowDiffView(!showDiffView)}
                className="text-[11px] font-bold text-[#7157E8] hover:underline"
              >
                {showDiffView ? 'Ẩn so sánh' : 'So sánh 3 bản'}
              </button>
            </div>

            <div className="space-y-2">
              {versions.map((ver, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectVersion(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs ${
                    selectedVersionIdx === idx
                      ? 'bg-indigo-50/80 border-[#7157E8] text-[#111E3D] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-0.5">
                    <span>{ver.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                      {ver.wordCount} từ
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {ver.diffSummary || ver.createdAt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Writing Canvas & AI Feedback (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Editor Container */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
            {/* Editor Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">
                  {versions[selectedVersionIdx]?.label || 'Bài viết học sinh'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#7157E8] font-bold">
                  {selectedGenre}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-slate-500">
                  Số từ:{' '}
                  <strong className="text-[#111E3D] text-sm">{wordCount}</strong> từ
                </span>

                {savedSuccess && (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3.5 h-3.5" /> Đã lưu phiên bản!
                  </span>
                )}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              rows={12}
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Bắt đầu viết bài của em tại đây... Tự do thể hiện cảm xúc và góc nhìn độc lập nhé!"
              className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-[#7157E8] text-sm leading-relaxed text-slate-800 font-serif placeholder:font-sans placeholder:text-slate-400 shadow-inner resize-y"
            />

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveAsVersion()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-[#7157E8]" />
                  <span>Lưu bản nháp mới</span>
                </button>

                <button
                  type="button"
                  onClick={handleGetAIFeedback}
                  disabled={isAiLoading || !currentText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD166]" />
                  <span>{isAiLoading ? 'Mực Nhỏ đang đọc bài...' : 'Nhận góp ý Mực Nhỏ AI'}</span>
                </button>
              </div>

              {onGoToCritique && (
                <button
                  type="button"
                  onClick={() => onGoToCritique(currentText, promptTitle)}
                  className="px-4 py-2 rounded-xl bg-[#111E3D] hover:bg-[#1A2C56] text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Chuyển sang Hội đồng phản biện</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00C2B8]" />
                </button>
              )}
            </div>

            {/* AI Feedback Banner */}
            {aiSuggestions && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-[#7157E8]">
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                  <span>Góp ý xây dựng từ Mực Nhỏ AI (Tham khảo để tự sửa):</span>
                </div>
                <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans">
                  {aiSuggestions}
                </div>
              </div>
            )}
          </div>

          {/* 3 Versions Comparison (Diff inspection view) */}
          {showDiffView && versions.length >= 2 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#7157E8]/30 shadow-lg space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <History className="w-4 h-4 text-[#7157E8]" />
                  So Sánh Tiến Bộ Qua Các Phiên Bản
                </h4>
                <span className="text-[11px] text-slate-500">
                  Minh chứng cho nỗ lực tự sửa của học sinh
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Version 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Phiên bản 1 (Trước phản hồi)</span>
                    <span className="text-[10px] text-slate-500">
                      {versions[0]?.wordCount} từ
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 font-serif text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                    {versions[0]?.text}
                  </div>
                  <p className="text-[10px] text-amber-700 italic">
                    * Bản khởi thảo đơn sơ, chưa trau chuốt câu từ.
                  </p>
                </div>

                {/* Final Version */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-950">
                    <span>Phiên bản hoàn thiện (Sau phản hồi)</span>
                    <span className="text-[10px] text-emerald-700">
                      {versions[versions.length - 1]?.wordCount} từ
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-200 font-serif text-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                    {versions[versions.length - 1]?.text}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    ✓ Câu văn phong phú hơn, bổ sung dẫn chứng Hồ Tây và triết lý trưởng thành.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
