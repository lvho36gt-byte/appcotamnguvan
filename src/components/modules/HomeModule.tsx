import React from 'react';
import {
  Sparkles,
  BookOpen,
  Bot,
  PenTool,
  Network,
  Scale,
  MessageSquare,
  Gamepad2,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { MucNhoMascot } from '../mascot/MucNhoMascot';
import type { PageId } from '../layout/Sidebar';
import type { GradeLevel, UserRole } from '../../types';

interface Props {
  onNavigate: (page: PageId) => void;
  selectedGrade: GradeLevel;
  currentRole: UserRole;
  onOpen5SModal: () => void;
}

export const HomeModule: React.FC<Props> = ({
  onNavigate,
  selectedGrade,
  currentRole,
  onOpen5SModal,
}) => {
  const features = [
    {
      id: 'explore' as PageId,
      title: 'Khám phá tác phẩm',
      desc: 'Soi sáng chủ đề, vẻ đẹp nhân vật với tính năng độc đáo "Chi tiết nào chứng minh?".',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      badge: 'S1 – Soi tác phẩm',
    },
    {
      id: 'tutor' as PageId,
      title: 'Gia sư Mực Nhỏ AI',
      desc: 'Hỏi đáp Ngữ văn theo phương pháp Socratic 3 mức trợ giúp, không viết văn hộ.',
      icon: Bot,
      color: 'from-[#7157E8] to-purple-600',
      badge: 'S2 – Suy luận',
    },
    {
      id: 'write' as PageId,
      title: 'Xưởng sáng tạo văn học',
      desc: 'Mỗi học sinh là một tác giả với 12 thể loại viết, đếm từ, lưu vết 3 phiên bản.',
      icon: PenTool,
      color: 'from-amber-500 to-orange-500',
      badge: 'S3 – Sáng tạo',
    },
    {
      id: 'mindmap' as PageId,
      title: 'Sơ đồ tư duy AI',
      desc: 'Tự động hóa kết nối tri thức, chỉnh sửa nút, đổi màu nhánh và xuất ảnh PNG sắc nét.',
      icon: Network,
      color: 'from-teal-500 to-emerald-600',
      badge: 'Trực quan hóa',
    },
    {
      id: 'critique' as PageId,
      title: 'Hội đồng phản biện AI',
      desc: 'Nhận xét 5 tiêu chí Rubric 4 mức, hỗ trợ nút "Em muốn phản biện AI".',
      icon: Scale,
      color: 'from-rose-500 to-pink-600',
      badge: 'S4 – Soát xét',
    },
    {
      id: 'roleplay' as PageId,
      title: 'Đối thoại cùng nhân vật',
      desc: 'Nhập vai nhân vật văn học giàu cảm xúc cùng chế độ "Thoát vai – Phân tích".',
      icon: MessageSquare,
      color: 'from-indigo-700 to-[#111E3D]',
      badge: 'Đồng cảm thẩm mỹ',
    },
    {
      id: 'games' as PageId,
      title: 'Trò chơi văn học AI',
      desc: '8 trò chơi trí tuệ: Rung chuông vàng, Giải mã nhân vật, Đấu trường lập luận.',
      icon: Gamepad2,
      color: 'from-violet-600 to-[#7157E8]',
      badge: 'Học mà chơi',
    },
    {
      id: 'progress' as PageId,
      title: 'Hành trình tiến bộ',
      desc: 'Theo dõi điểm Trước – Sau, số lần tự sửa bài, xuất biểu đồ và báo cáo CSV.',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-700',
      badge: 'S5 – Tiến bộ thật',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Demo Mode Notice */}
      {currentRole === 'demo' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-amber-200 text-amber-950 font-extrabold text-xs">
              CHẾ ĐỘ DEMO
            </span>
            <p className="text-xs font-medium">
              Bạn đang trải nghiệm bộ dữ liệu thực nghiệm mẫu của <strong>Lớp 8A – Trường TH-THCS Chu Văn An</strong> (Hà Nội). Toàn bộ dữ liệu được lưu trên thiết bị này.
            </p>
          </div>
          <button
            onClick={() => onNavigate('competition')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Xem hồ sơ dự thi 2026</span>
          </button>
        </div>
      )}

      {/* Hero Mascot Banner */}
      <MucNhoMascot
        state="greeting"
        onQuickAction={(action) => {
          if (action === 'explore') onNavigate('explore');
          else if (action === 'tutor') onNavigate('tutor');
          else if (action === 'write') onNavigate('write');
          else if (action === 'mindmap') onNavigate('mindmap');
          else if (action === 'critique') onNavigate('critique');
          else if (action === 'games') onNavigate('games');
        }}
      />

      {/* 5S Educational Philosophy Highlight Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md p-6 md:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7157E8]/10 text-[#7157E8] text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Phương Pháp Giáo Dục Độc Quyền</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#111E3D] tracking-tight">
              Quy Trình Học Tập 5S Ngữ Văn AI
            </h3>
            <p className="text-sm font-semibold text-[#7157E8] mt-1">
              "AI không viết văn thay học sinh – AI khơi gợi để học sinh tự sáng tạo"
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mô hình được nghiên cứu và thiết kế bởi cô giáo Lê Thị Tâm (Trường TH-THCS Chu Văn An, Tây Hồ, Hà Nội), giúp học sinh tự tin bước qua 5 chặng phát triển tư duy văn học toàn diện.
            </p>
          </div>

          <button
            onClick={onOpen5SModal}
            className="shrink-0 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#111E3D] to-[#7157E8] hover:opacity-95 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-950/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Khám phá chi tiết 5S</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 5S Visual Steps Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          {[
            { id: 'S1', name: 'Soi tác phẩm', sub: 'Đọc hiểu & Chi tiết', color: 'border-l-4 border-l-[#7157E8] bg-indigo-50/50' },
            { id: 'S2', name: 'Suy luận', sub: 'Socratic khơi gợi', color: 'border-l-4 border-l-[#00C2B8] bg-teal-50/50' },
            { id: 'S3', name: 'Sáng tạo', sub: 'Viết từ góc nhìn riêng', color: 'border-l-4 border-l-amber-400 bg-amber-50/50' },
            { id: 'S4', name: 'Soát xét', sub: '5 Tiêu chí Rubric', color: 'border-l-4 border-l-purple-500 bg-purple-50/50' },
            { id: 'S5', name: 'Sửa & Chia sẻ', sub: 'Lưu vết 3 phiên bản', color: 'border-l-4 border-l-emerald-500 bg-emerald-50/50' },
          ].map((item) => (
            <div key={item.id} className={`p-3 rounded-xl border border-slate-200/80 ${item.color}`}>
              <span className="text-xs font-black text-[#111E3D]">{item.id}</span>
              <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#111E3D]">Các Module Học Tập Trọng Tâm</h3>
            <p className="text-xs text-slate-500">Phục vụ học sinh THCS khối 6, 7, 8, 9 và giáo viên bộ môn</p>
          </div>
          <span className="text-xs font-semibold text-[#7157E8] px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
            Khối lớp {selectedGrade}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => onNavigate(feat.id)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#7157E8]/40 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-[#7157E8]/10 group-hover:text-[#7157E8]">
                      {feat.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#7157E8] transition-colors mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#7157E8]">
                  <span>Trải nghiệm ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Author and Competition Metadata Footer Box */}
      <div className="bg-gradient-to-br from-[#111E3D] to-[#1A2C56] text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD166]">
              Thông tin dự án giáo dục số
            </span>
            <h4 className="text-lg md:text-xl font-bold">
              Trợ Lý Văn Học Số AI – Khơi Nguồn Sáng Tạo Cho Học Sinh THCS
            </h4>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Sản phẩm tham gia cuộc thi <strong>"Ứng dụng AI trong Giáo dục Việt Nam 2026"</strong>. Được xây dựng dựa trên thực tiễn giảng dạy môn Ngữ văn THCS tại trường TH-THCS Chu Văn An (Phường Tây Hồ, TP. Hà Nội).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#00C2B8]" />
                Tác giả: <strong>Cô Lê Thị Tâm</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#00C2B8]" />
                Đơn vị: <strong>TH-THCS Chu Văn An</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#00C2B8]" />
                Địa phương: <strong>Tây Hồ, Hà Nội</strong>
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-[#FFD166] uppercase mb-1">Thực nghiệm tại Lớp 8A</p>
              <ul className="text-xs space-y-1 text-slate-200">
                <li>• 5 mã học sinh mẫu (HS-DEMO-01 .. 05)</li>
                <li>• 100% tự sửa qua ít nhất 3 phiên bản</li>
                <li>• Điểm trung bình tăng từ 5.6 lên 8.2</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('classroom')}
              className="mt-3 w-full py-2 rounded-xl bg-[#00C2B8] hover:bg-[#26E5DC] text-[#111E3D] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Xem quản lý lớp học</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
