import React from 'react';
import {
  Sparkles,
  GraduationCap,
  UserCheck,
  Eye,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';
import type { GradeLevel, UserRole } from '../../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedGrade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  onOpen5SModal: () => void;
  onOpenEthicsModal: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  selectedGrade,
  onGradeChange,
  onOpen5SModal,
  onOpenEthicsModal,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#111E3D] text-white border-b border-indigo-900/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Custom Brand Logo: Open book + Star + AI neural node */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7157E8] via-[#00C2B8] to-[#FFD166] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#111E3D] rounded-[14px] flex items-center justify-center p-1.5 relative overflow-hidden">
                <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                  {/* Open Book Wings */}
                  <path
                    d="M 16 10 C 12 7, 6 8, 4 9 L 4 23 C 6 22, 12 21, 16 24 C 20 21, 26 22, 28 23 L 28 9 C 26 8, 20 7, 16 10 Z"
                    fill="#7157E8"
                    opacity="0.85"
                  />
                  <path
                    d="M 16 10 L 16 24"
                    stroke="#FFD166"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Creative Star */}
                  <polygon
                    points="16,3 17.5,7 21,7.5 18,10 19,14 16,11.5 13,14 14,10 11,7.5 14.5,7"
                    fill="#FFD166"
                  />
                  {/* Neural nodes */}
                  <circle cx="8" cy="14" r="1.5" fill="#00C2B8" />
                  <circle cx="24" cy="14" r="1.5" fill="#00C2B8" />
                  <line x1="8" y1="14" x2="16" y2="10" stroke="#00C2B8" strokeWidth="1" strokeDasharray="1 1" />
                  <line x1="24" y1="14" x2="16" y2="10" stroke="#00C2B8" strokeWidth="1" strokeDasharray="1 1" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-[#00C2B8] bg-clip-text text-transparent">
                  TRỢ LÝ VĂN HỌC SỐ AI
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#FFD166] text-[#111E3D]">
                  THCS 2026
                </span>
              </div>
              <p className="text-[11px] text-indigo-200/80 hidden sm:block truncate max-w-xs">
                Khơi nguồn sáng tạo cho học sinh THCS – Mô hình 5S
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Grade Selector */}
          <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10">
            <span className="text-[11px] font-semibold text-indigo-200 px-2 hidden md:inline">Khối:</span>
            {([6, 7, 8, 9] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                onClick={() => onGradeChange(grade)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedGrade === grade
                    ? 'bg-[#7157E8] text-white shadow-sm shadow-[#7157E8]/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Lớp {grade}
              </button>
            ))}
          </div>

          {/* 5S Model button */}
          <button
            onClick={onOpen5SModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00C2B8]/20 hover:bg-[#00C2B8]/30 border border-[#00C2B8]/40 text-[#26E5DC] text-xs font-semibold transition-colors"
            title="Quy trình học tập 5S: Soi - Suy luận - Sáng tạo - Soát xét - Sửa"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mô hình 5S</span>
          </button>

          {/* Ethics Guide button */}
          <button
            onClick={onOpenEthicsModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-medium transition-colors"
            title="Quy tắc an toàn và đạo đức AI trong trường học"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFD166]" />
            <span className="hidden lg:inline">Đạo đức AI</span>
          </button>

          {/* Role Switcher */}
          <div className="relative flex items-center bg-white/10 rounded-xl p-1 border border-white/15">
            <button
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-[#7157E8] text-white shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Chế độ Giáo viên: Quản lý lớp, giao bài, duyệt rubric, xuất hồ sơ"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#FFD166]" />
              <span className="hidden sm:inline">Giáo viên</span>
            </button>

            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-[#00C2B8] text-[#111E3D] shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Chế độ Học sinh: Viết bài, trò chuyện Mực Nhỏ AI, tạo sơ đồ, làm nhiệm vụ"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Học sinh</span>
            </button>

            <button
              onClick={() => onRoleChange('demo')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'demo'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
              title="Chế độ Khách trải nghiệm (Dữ liệu Lớp 8A Chu Văn An)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DEMO</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
