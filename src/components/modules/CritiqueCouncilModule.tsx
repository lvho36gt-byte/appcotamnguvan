import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  HelpCircle,
  Check,
  Send,
  UserCheck,
  Award,
  ChevronDown,
  Quote,
  ShieldAlert,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import type { CritiqueReport, GradeLevel, StudentSubmission, UserRole } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  currentRole: UserRole;
  initialText?: string;
  initialTitle?: string;
}

export const CritiqueCouncilModule: React.FC<Props> = ({
  selectedGrade,
  currentRole,
  initialText,
  initialTitle,
}) => {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() =>
    StorageService.getSubmissions()
  );
  const currentSub = submissions[0];

  const [essayText, setEssayText] = useState(
    initialText || currentSub?.versions[currentSub.versions.length - 1]?.text || ''
  );
  const [promptTitle, setPromptTitle] = useState(
    initialTitle || currentSub?.taskTitle || 'Cảm nhận nhân vật An trong Hồ Tây Chiều Gió Sớm'
  );

  const [critiqueReport, setCritiqueReport] = useState<CritiqueReport | null>(
    currentSub?.critiqueReport || null
  );
  const [loading, setLoading] = useState(false);

  // Student Rebuttal state
  const [showRebuttalBox, setShowRebuttalBox] = useState(false);
  const [selectedQuoteForRebuttal, setSelectedQuoteForRebuttal] = useState(
    currentSub?.critiqueReport?.quotesToReview?.[0]?.quote || 'cảnh sắc mùa thu làm em thấy xao xuyến'
  );
  const [studentDefenseText, setStudentDefenseText] = useState(
    currentSub?.studentRebuttal || ''
  );
  const [rebuttalFeedback, setRebuttalFeedback] = useState<string | null>(
    currentSub?.rebuttalFeedback || null
  );
  const [rebuttalLoading, setRebuttalLoading] = useState(false);

  // Teacher Approval state
  const [teacherOfficialNote, setTeacherOfficialNote] = useState(
    currentSub?.teacherOfficialFeedback || ''
  );
  const [isApproved, setIsApproved] = useState(currentSub?.teacherApproved || false);

  const rubricLabels: Record<number, { text: string; color: string; badgeBg: string }> = {
    1: { text: 'Cần hỗ trợ', color: 'text-rose-700', badgeBg: 'bg-rose-100 text-rose-800' },
    2: { text: 'Đạt bước đầu', color: 'text-amber-700', badgeBg: 'bg-amber-100 text-amber-800' },
    3: { text: 'Đạt yêu cầu', color: 'text-teal-700', badgeBg: 'bg-teal-100 text-teal-800' },
    4: { text: 'Tốt', color: 'text-emerald-700', badgeBg: 'bg-emerald-100 text-emerald-800' },
  };

  const handleRunCritique = async () => {
    if (!essayText.trim() || loading) return;
    setLoading(true);
    setRebuttalFeedback(null);

    try {
      const res = await GeminiService.critiqueEssay({
        text: essayText,
        promptTitle,
        grade: selectedGrade,
        genre: 'Cảm nhận / Sáng tạo',
      });

      setCritiqueReport(res.critique);

      // Save to active submission
      const updatedSub: StudentSubmission = {
        ...currentSub,
        critiqueReport: res.critique,
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveSubmission(updatedSub);
      setSubmissions(StorageService.getSubmissions());
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  // Submit student rebuttal
  const handleSubmitRebuttal = async () => {
    if (!studentDefenseText.trim() || rebuttalLoading) return;
    setRebuttalLoading(true);

    try {
      const res = await GeminiService.submitRebuttal({
        studentRebuttal: studentDefenseText,
        originalQuote: selectedQuoteForRebuttal,
        aiComment: critiqueReport?.quotesToReview?.[0]?.comment || 'Câu văn cần chú ý trau chuốt.',
      });

      const feedback = res.result?.teacherFeedback || res.result?.reason;
      setRebuttalFeedback(feedback);

      // If adjustment recommended, adjust rubric in state
      if (critiqueReport && res.result?.rubricAdjustment) {
        const updatedCriteria = critiqueReport.criteria.map((c) =>
          c.name.includes('sáng tạo') ? { ...c, score: 4, levelName: 'Tốt' } : c
        );
        setCritiqueReport({ ...critiqueReport, criteria: updatedCriteria });
      }

      // Save to submission
      const updatedSub: StudentSubmission = {
        ...currentSub,
        studentRebuttal: studentDefenseText,
        rebuttalFeedback: feedback,
        updatedAt: new Date().toISOString(),
      };
      StorageService.saveSubmission(updatedSub);
    } catch {
      setRebuttalFeedback('Mực Nhỏ AI ghi nhận giải thích của bạn! Lập luận thẩm mỹ của bạn hoàn toàn thuyết phục.');
    } finally {
      setRebuttalLoading(false);
    }
  };

  // Teacher save official approval
  const handleTeacherApprove = () => {
    setIsApproved(true);
    const updatedSub: StudentSubmission = {
      ...currentSub,
      teacherApproved: true,
      teacherOfficialFeedback: teacherOfficialNote || 'Giáo viên đã phê duyệt nhận xét và biểu dương sự sáng tạo của học sinh.',
      status: 'completed',
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveSubmission(updatedSub);
    alert('Đã lưu nhận xét và phê duyệt chính thức thành công!');
  };

  // Calculate overall average score
  const avgScore = critiqueReport
    ? (
        critiqueReport.criteria.reduce((sum, c) => sum + c.score, 0) /
        critiqueReport.criteria.length
      ).toFixed(1)
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#241355] to-[#7157E8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 05
            </span>
            <span className="text-xs text-indigo-200">S4 – Soát xét & Phản biện</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Hội Đồng Phản Biện Văn Học AI
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Đánh giá đa chiều theo <strong>5 tiêu chí rubric chuẩn hóa (4 mức)</strong>. AI gợi ý, đặt câu hỏi phản biện và học sinh có quyền bảo vệ quan điểm thông qua tính năng <strong>"Em muốn phản biện AI"</strong>.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-center">
          <p className="text-[10px] text-slate-300 uppercase">Quyền kiểm soát</p>
          <p className="font-bold text-[#FFD166] mt-0.5">Giáo viên phê duyệt cuối</p>
        </div>
      </div>

      {/* Input essay & action row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Bài viết của học sinh ({promptTitle})
            </h3>
            <p className="text-xs text-slate-500">
              Lớp {selectedGrade} • Mã học sinh: {currentSub?.studentCode || 'HS-DEMO-01'}
            </p>
          </div>

          <button
            onClick={handleRunCritique}
            disabled={loading || !essayText.trim()}
            className="px-5 py-2.5 rounded-2xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Scale className="w-4 h-4 text-[#FFD166]" />
            <span>{loading ? 'Hội đồng đang phản biện...' : 'Bắt đầu phản biện bài viết'}</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Dán hoặc nhập nội dung bài viết cần phản biện ở đây..."
          className="w-full p-4 rounded-2xl border border-slate-200 font-serif text-slate-800 text-xs sm:text-sm leading-relaxed focus:outline-none focus:border-[#7157E8] bg-slate-50/50 shadow-inner"
        />
      </div>

      {/* Critique Results */}
      {critiqueReport && (
        <div className="space-y-6 animate-fadeIn">
          {/* Overall Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">Tổng kết Hội đồng Phản biện</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-[#7157E8] font-bold">
                  Khuyến nghị phát triển
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                {critiqueReport.overallSummary}
              </p>
            </div>

            {avgScore && (
              <div className="shrink-0 p-4 rounded-2xl bg-gradient-to-br from-[#111E3D] to-[#1A2C56] text-white text-center min-w-[140px] shadow-md">
                <span className="text-[10px] text-indigo-200 uppercase font-semibold">
                  Mức Rubric trung bình
                </span>
                <p className="text-2xl font-black text-[#FFD166] mt-1">{avgScore} / 4.0</p>
                <span className="text-[11px] text-[#00C2B8] font-semibold">
                  {Number(avgScore) >= 3.5 ? 'Tốt (Mức 4)' : 'Đạt yêu cầu (Mức 3)'}
                </span>
              </div>
            )}
          </div>

          {/* 5 Criteria Breakdown Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#7157E8]" />
              Chi Tiết 5 Tiêu Chí Đánh Giá Năng Lực
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {critiqueReport.criteria.map((crit, idx) => {
                const rubricInfo = rubricLabels[crit.score] || rubricLabels[3];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#7157E8]/40 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {idx + 1}. {crit.name}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${rubricInfo.badgeBg}`}
                        >
                          Mức {crit.score}: {crit.levelName}
                        </span>
                      </div>

                      {/* Strengths */}
                      <div className="text-xs space-y-1">
                        <p className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Điểm mạnh:
                        </p>
                        <p className="text-slate-600 pl-4">{crit.strength}</p>
                      </div>

                      {/* Suggestions */}
                      <div className="text-xs space-y-1 mt-2">
                        <p className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Gợi ý hoàn thiện:
                        </p>
                        <p className="text-slate-600 pl-4">{crit.suggestion}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Tiêu chuẩn môn Ngữ văn</span>
                      <span className="font-semibold text-slate-600">{crit.levelName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quotes to review & Counter questions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quotes to review */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-[#7157E8]" />
                Câu văn cần xem lại hoặc trau chuốt:
              </h4>

              <div className="space-y-2">
                {critiqueReport.quotesToReview?.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs space-y-1">
                    <p className="font-serif italic text-slate-800">"{q.quote}"</p>
                    <p className="text-slate-600 font-medium text-[11px]">
                      👉 <strong>Gợi ý:</strong> {q.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Counter Questions */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#00C2B8]" />
                Câu hỏi phản biện khơi gợi chiều sâu:
              </h4>

              <ul className="space-y-2">
                {critiqueReport.counterQuestions?.map((q, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium leading-relaxed flex items-start gap-2"
                  >
                    <span className="font-bold text-[#7157E8]">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* "EM MUỐN PHẢN BIỆN AI" Button & Modal Section */}
          <div className="bg-gradient-to-br from-indigo-950 to-[#111E3D] rounded-3xl p-6 text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFD166] text-[#111E3D] uppercase">
                  Trao quyền cho học sinh
                </span>
                <h4 className="text-base sm:text-lg font-bold mt-1">
                  Tính Năng: "Em Muốn Phản Biện AI"
                </h4>
                <p className="text-xs text-indigo-200 leading-relaxed max-w-xl">
                  Em không đồng ý với nhận xét nào của AI? Em có dụng ý nghệ thuật riêng? Hãy trình bày lý lẽ để AI lắng nghe và cùng thảo luận nhé!
                </p>
              </div>

              <button
                onClick={() => setShowRebuttalBox(!showRebuttalBox)}
                className="shrink-0 px-4 py-2.5 rounded-2xl bg-[#00C2B8] hover:bg-[#26E5DC] text-[#111E3D] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{showRebuttalBox ? 'Đóng hộp phản biện' : 'Em muốn phản biện AI'}</span>
              </button>
            </div>

            {/* Rebuttal Interactive Form */}
            {showRebuttalBox && (
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-3 text-xs animate-fadeIn">
                <div>
                  <label className="block text-slate-200 font-bold mb-1">
                    Trích dẫn hoặc nhận xét em muốn bảo vệ:
                  </label>
                  <input
                    type="text"
                    value={selectedQuoteForRebuttal}
                    onChange={(e) => setSelectedQuoteForRebuttal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#00C2B8]"
                  />
                </div>

                <div>
                  <label className="block text-slate-200 font-bold mb-1">
                    Lý lẽ và căn cứ nghệ thuật của em:
                  </label>
                  <textarea
                    rows={3}
                    value={studentDefenseText}
                    onChange={(e) => setStudentDefenseText(e.target.value)}
                    placeholder="Giải thích vì sao em chọn cách viết này (dụng ý tu từ, cảm xúc nhân vật...)..."
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-[#00C2B8] leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitRebuttal}
                    disabled={!studentDefenseText.trim() || rebuttalLoading}
                    className="px-4 py-2 rounded-xl bg-[#FFD166] hover:bg-[#FFE08F] disabled:opacity-40 text-[#111E3D] font-extrabold text-xs flex items-center gap-2 shadow transition-all"
                  >
                    {rebuttalLoading ? (
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Gửi phản biện tới AI</span>
                  </button>
                </div>

                {/* AI Rebuttal Feedback Display */}
                {rebuttalFeedback && (
                  <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 space-y-2 mt-3 animate-fadeIn">
                    <div className="flex items-center gap-2 text-[#00C2B8] font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Hội đồng AI tiếp thu lập luận của em:</span>
                    </div>
                    <p className="text-emerald-100 whitespace-pre-line leading-relaxed">
                      {rebuttalFeedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Teacher Official Approval Box (Visible for Teacher / Demo role) */}
          {(currentRole === 'teacher' || currentRole === 'demo') && (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#7157E8]/40 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#7157E8]" />
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">
                    Phê Duyệt Chính Thức Của Giáo Viên (Cô Lê Thị Tâm)
                  </h4>
                </div>
                {isApproved && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Đã phê duyệt chính thức
                  </span>
                )}
              </div>

              <textarea
                rows={3}
                value={teacherOfficialNote}
                onChange={(e) => setTeacherOfficialNote(e.target.value)}
                placeholder="Nhập lời nhận xét, động viên chính thức từ giáo viên để gửi cho học sinh..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#7157E8] leading-relaxed"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleTeacherApprove}
                  className="px-5 py-2.5 rounded-xl bg-[#111E3D] hover:bg-[#1A2C56] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Award className="w-4 h-4 text-[#FFD166]" />
                  <span>Lưu nhận xét & Phê duyệt kết quả</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
