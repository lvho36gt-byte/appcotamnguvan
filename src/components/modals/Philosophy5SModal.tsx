import React from 'react';
import { X, Layers, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGoToModule?: (moduleId: string) => void;
}

export const Philosophy5SModal: React.FC<Props> = ({ isOpen, onClose, onGoToModule }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 'S1',
      title: 'SOI TÁC PHẨM',
      color: 'from-[#7157E8] to-[#8B75F3]',
      tagBg: 'bg-indigo-100 text-[#7157E8]',
      action: 'explore',
      actionLabel: 'Đến Khám phá tác phẩm',
      desc: 'Học sinh khám phá nội dung văn bản, cấu trúc không gian, nhân vật, hình ảnh và nét đặc sắc nghệ thuật qua hệ thống chỉ dẫn đa tầng.',
      highlight: 'Chức năng: "Chi tiết nào chứng minh?" giúp bám sát câu chữ thật.',
    },
    {
      num: 'S2',
      title: 'SUY LUẬN',
      color: 'from-[#00C2B8] to-[#009E96]',
      tagBg: 'bg-teal-100 text-teal-800',
      action: 'tutor',
      actionLabel: 'Hỏi đáp Mực Nhỏ AI',
      desc: 'AI đóng vai trò gia sư gợi mở theo phương pháp Socratic, đặt câu hỏi từng bước giúp học sinh tự tìm dẫn chứng và thiết lập lập luận.',
      highlight: '3 mức trợ giúp: Câu hỏi gợi mở → Gợi ý phương pháp → KHÔNG viết sẵn.',
    },
    {
      num: 'S3',
      title: 'SÁNG TẠO',
      color: 'from-amber-400 to-amber-500',
      tagBg: 'bg-amber-100 text-amber-900',
      action: 'write',
      actionLabel: 'Đến Xưởng sáng tạo',
      desc: 'Học sinh tự tạo ý tưởng, lập dàn ý và viết đoạn văn, truyện ngắn, nhập vai nhân vật hoặc làm thơ từ góc nhìn cá nhân độc lập.',
      highlight: '12 dạng bài học tập phong phú, tích hợp đếm từ và dàn ý trực quan.',
    },
    {
      num: 'S4',
      title: 'SOÁT XÉT',
      color: 'from-purple-600 to-indigo-700',
      tagBg: 'bg-purple-100 text-purple-900',
      action: 'critique',
      actionLabel: 'Đến Hội đồng phản biện',
      desc: 'Hội đồng Phản biện AI nhận xét bài viết theo 5 tiêu chí chuẩn hóa, đề xuất mức Rubric (1-4) và chỉ ra câu văn cần trau chuốt.',
      highlight: 'Tính năng độc đáo: Nút "Em muốn phản biện AI" trao quyền cho học sinh.',
    },
    {
      num: 'S5',
      title: 'SỬA & CHIA SẺ',
      color: 'from-emerald-500 to-teal-600',
      tagBg: 'bg-emerald-100 text-emerald-900',
      action: 'write',
      actionLabel: 'Xem lịch sử 3 phiên bản',
      desc: 'Học sinh tự chỉnh sửa bài viết qua các phiên bản (V1, V2, Bản hoàn thiện). Giáo viên duyệt nhận xét và ghi nhận sự trưởng thành.',
      highlight: 'Lưu vết lịch sử chỉnh sửa rõ ràng: thấy được sự tiến bộ thực chất.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-[#111E3D] text-white p-6 rounded-t-3xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7157E8] to-[#00C2B8] flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Mô Hình Học Tập 5S Ngữ Văn AI</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFD166] text-[#111E3D]">
                  Bản quyền phương pháp
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Tác giả: Lê Thị Tâm – Trường TH-THCS Chu Văn An, Tây Hồ, Hà Nội
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Message Banner */}
        <div className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 border-b border-indigo-100">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7157E8]">
              Triết lý giáo dục cốt lõi
            </span>
            <p className="mt-1 text-base md:text-lg font-extrabold text-[#111E3D] leading-snug">
              "AI KHÔNG VIẾT VĂN THAY HỌC SINH –<br className="hidden sm:inline" />
              AI KHƠI GỢI ĐỂ HỌC SINH TỰ SÁNG TẠO"
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Quy trình 5 bước liền mạch giúp học sinh chuyển từ vị thế tiếp nhận thụ động sang vị thế chủ động khám phá, sáng tạo và phản biện nghệ thuật.
            </p>
          </div>
        </div>

        {/* 5 Steps Grid */}
        <div className="p-6 space-y-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="p-4 rounded-2xl border border-slate-200 hover:border-[#7157E8]/50 hover:shadow-md transition-all bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${step.color} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md`}
                >
                  {step.num}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {step.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${step.tagBg}`}>
                      Bước {idx + 1}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                  <p className="text-[11px] font-medium text-[#7157E8] mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {step.highlight}
                  </p>
                </div>
              </div>

              {onGoToModule && (
                <button
                  onClick={() => {
                    onGoToModule(step.action);
                    onClose();
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#7157E8] hover:text-white text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 self-end md:self-center"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dự thi "Ứng dụng AI trong Giáo dục Việt Nam 2026"
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#111E3D] hover:bg-[#1A2C56] text-white text-xs font-bold transition-colors"
          >
            Đã hiểu mô hình 5S
          </button>
        </div>
      </div>
    </div>
  );
};
