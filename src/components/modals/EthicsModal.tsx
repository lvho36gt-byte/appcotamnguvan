import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-[#111E3D] text-white p-6 rounded-t-3xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00C2B8] to-[#FFD166] flex items-center justify-center text-[#111E3D] shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Quy Tắc An Toàn & Đạo Đức AI</h3>
              <p className="text-xs text-indigo-200">Môi trường giáo dục THCS thân thiện & minh bạch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 mb-1">1. Bảo vệ quyền riêng tư học sinh THCS</h4>
              <p className="text-slate-600">
                Ứng dụng <strong>tuyệt đối không yêu cầu CCCD, số điện thoại, địa chỉ nhà</strong> hay thông tin định danh cá nhân nhạy cảm. Học sinh tham gia lớp học thông qua mã định danh ẩn danh (ví dụ: HS-DEMO-01, HS-DEMO-02) do nhà trường/giáo viên cấp.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#7157E8] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#111E3D] mb-1">2. Nguyên tắc không viết văn thay (Anti-Cheat)</h4>
              <p className="text-slate-600">
                Mực Nhỏ AI được huấn luyện theo phương pháp Socratic: chỉ đặt câu hỏi định hướng, gợi mở dàn ý và phản hồi bản nháp. Nếu học sinh yêu cầu "viết hộ bài văn hoàn chỉnh", hệ thống sẽ lịch sự từ chối và hướng dẫn phương pháp tự viết.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 mb-1">3. Vai trò thẩm định của Giáo viên</h4>
              <p className="text-slate-600">
                Các nhận xét và mức Rubric do AI đề xuất <strong>chỉ mang tính chất tham khảo, tư vấn học tập</strong>, không phải là quyết định đánh giá chính thức cuối cùng. Giáo viên bộ môn luôn có toàn quyền duyệt, chỉnh sửa và công nhận kết quả của học sinh.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-1">4. Bản quyền ngữ liệu & Minh bạch dữ liệu</h4>
              <p className="text-slate-600">
                Hệ thống ưu tiên sử dụng ngữ liệu tự sáng tác riêng hoặc ngữ liệu được phép sử dụng trong nhà trường. Toàn bộ dữ liệu thực nghiệm mẫu đều được gắn nhãn minh bạch <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">DỮ LIỆU DEMO</span> để bảo đảm tính trung thực khoa học.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#111E3D] hover:bg-[#1A2C56] text-white text-xs font-bold transition-colors"
          >
            Đã rõ cam kết đạo đức
          </button>
        </div>
      </div>
    </div>
  );
};
