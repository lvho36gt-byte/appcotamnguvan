import React from 'react';
import {
  Home,
  Bot,
  Compass,
  PenTool,
  Network,
  Scale,
  MessageSquare,
  Gamepad2,
  Library,
  Users,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { UserRole } from '../../types';

export type PageId =
  | 'home'
  | 'tutor'
  | 'explore'
  | 'write'
  | 'mindmap'
  | 'critique'
  | 'roleplay'
  | 'games'
  | 'library'
  | 'classroom'
  | 'progress'
  | 'competition';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  currentRole: UserRole;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  currentRole,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'home' as PageId,
      name: '01. Trang chủ',
      subtitle: 'Khởi đầu sáng tạo',
      icon: Home,
      roles: ['teacher', 'student', 'demo'],
      badge: '5S',
    },
    {
      id: 'tutor' as PageId,
      name: '02. Trợ lý Mực Nhỏ AI',
      subtitle: 'Gia sư Ngữ văn gợi mở',
      icon: Bot,
      roles: ['teacher', 'student', 'demo'],
      badge: 'Hot',
    },
    {
      id: 'explore' as PageId,
      name: '03. Khám phá tác phẩm',
      subtitle: 'Chi tiết nào chứng minh?',
      icon: Compass,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'write' as PageId,
      name: '04. Xưởng sáng tạo văn học',
      subtitle: 'Mỗi học sinh là một tác giả',
      icon: PenTool,
      roles: ['teacher', 'student', 'demo'],
      badge: 'Lưu 3 bản',
    },
    {
      id: 'mindmap' as PageId,
      name: '05. Sơ đồ tư duy AI',
      subtitle: 'Kết nối tri thức – Xuất PNG',
      icon: Network,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'critique' as PageId,
      name: '06. Hội đồng phản biện AI',
      subtitle: '5 tiêu chí – 4 mức Rubric',
      icon: Scale,
      roles: ['teacher', 'student', 'demo'],
      badge: 'Phản biện',
    },
    {
      id: 'roleplay' as PageId,
      name: '07. Đối thoại cùng nhân vật',
      subtitle: 'Mô phỏng & Thoát vai',
      icon: MessageSquare,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'games' as PageId,
      name: '08. Trò chơi văn học',
      subtitle: '8 thử thách tương tác',
      icon: Gamepad2,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'library' as PageId,
      name: '09. Thư viện học liệu',
      subtitle: 'Kho ngữ liệu lớp 6 - 9',
      icon: Library,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'classroom' as PageId,
      name: '10. Quản lý lớp học',
      subtitle: 'Giao bài & Mã ẩn danh',
      icon: Users,
      roles: ['teacher', 'demo'],
      badge: 'Giáo viên',
    },
    {
      id: 'progress' as PageId,
      name: '11. Hành trình tiến bộ',
      subtitle: 'Đối chiếu Trước - Sau & Xuất CSV',
      icon: TrendingUp,
      roles: ['teacher', 'student', 'demo'],
    },
    {
      id: 'competition' as PageId,
      name: '12. Minh chứng dự thi 2026',
      subtitle: '5 tiêu chí cuộc thi AI',
      icon: Award,
      roles: ['teacher', 'demo'],
      badge: '2026',
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(currentRole));

  const handleItemClick = (id: PageId) => {
    onSelectPage(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-72 shrink-0 bg-white border-r border-slate-200/80 shadow-sm flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Author / School Info Bar */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50/70 to-purple-50/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00C2B8]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7157E8]">
              Tác giả: Lê Thị Tâm
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-800 truncate">
            Trường TH-THCS Chu Văn An
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            Tây Hồ – Hà Nội (Dự thi AI 2026)
          </p>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between group transition-all ${
                  isActive
                    ? 'bg-[#111E3D] text-white shadow-md shadow-indigo-950/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#7157E8] text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-[#7157E8]/10 group-hover:text-[#7157E8]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-800'}`}>
                      {item.name}
                    </p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-[#00C2B8] text-[#111E3D]'
                          : 'bg-[#7157E8]/10 text-[#7157E8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-[#00C2B8] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info & 5S quick summary */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#111E3D] mb-1">
              <Layers className="w-3.5 h-3.5 text-[#00C2B8]" />
              <span>Quy trình 5S Văn học AI</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center text-[9px] font-bold text-slate-600">
              <span className="p-1 rounded bg-indigo-50 text-[#7157E8]">S1 Soi</span>
              <span className="p-1 rounded bg-emerald-50 text-[#00C2B8]">S2 Suy</span>
              <span className="p-1 rounded bg-amber-50 text-amber-700">S3 Sáng</span>
              <span className="p-1 rounded bg-purple-50 text-purple-700">S4 Soát</span>
              <span className="p-1 rounded bg-teal-50 text-teal-800">S5 Sửa</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
