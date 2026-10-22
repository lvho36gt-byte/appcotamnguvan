import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  AlertCircle,
  Eye,
  Send,
  Award,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import type { AssignmentTask, GradeLevel, StudentAccount, StudentSubmission, TaskStatus } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  onViewSubmission?: (sub: StudentSubmission) => void;
}

export const ClassroomModule: React.FC<Props> = ({ selectedGrade, onViewSubmission }) => {
  const [students, setStudents] = useState<StudentAccount[]>(() => StorageService.getStudents());
  const [tasks, setTasks] = useState<AssignmentTask[]>(() => StorageService.getTasks());
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() =>
    StorageService.getSubmissions()
  );

  // New task modal state
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskGenre, setTaskGenre] = useState('Đoạn văn cảm nhận / Sáng tạo');
  const [taskDueDate, setTaskDueDate] = useState('2026-11-20');
  const [taskDesc, setTaskDesc] = useState('');

  // Status badges config
  const statusLabels: Record<TaskStatus, { label: string; bg: string; text: string }> = {
    not_started: { label: 'CHƯA BẮT ĐẦU', bg: 'bg-slate-100', text: 'text-slate-600' },
    in_progress: { label: 'ĐANG THỰC HIỆN', bg: 'bg-amber-100', text: 'text-amber-800' },
    submitted: { label: 'ĐÃ NỘP BÀI', bg: 'bg-blue-100', text: 'text-blue-800' },
    critiqued: { label: 'ĐÃ NHẬN PHẢN HỒI', bg: 'bg-purple-100', text: 'text-purple-800' },
    completed: { label: 'ĐÃ HOÀN THIỆN', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      alert('Vui lòng nhập tên nhiệm vụ.');
      return;
    }
    const newTask: AssignmentTask = {
      id: `task-${Date.now()}`,
      title: taskTitle.trim(),
      grade: selectedGrade,
      genre: taskGenre,
      description: taskDesc.trim() || 'Thực hiện quy trình 5S cùng Mực Nhỏ AI.',
      dueDate: taskDueDate,
      rubricRequirements: ['Hiểu đúng vấn đề', 'Dẫn chứng phù hợp', 'Sáng tạo'],
      status: 'active',
      isDemo: true,
    };
    StorageService.saveTask(newTask);
    setTasks(StorageService.getTasks());
    setShowAddTask(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#7157E8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 10
            </span>
            <span className="text-xs text-indigo-200">Không gian quản trị Giáo viên</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Quản Lý Lớp Học & Theo Dõi Nhiệm Vụ 5S
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Giáo viên quản lý học sinh bằng <strong>mã ẩn danh (HS-DEMO-01 .. 05)</strong>, bảo vệ quyền riêng tư số, theo dõi 5 trạng thái nộp bài và phê duyệt các phiên bản hoàn thiện.
          </p>
        </div>

        <button
          onClick={() => setShowAddTask(true)}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFE08F] text-[#111E3D] font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Giao nhiệm vụ mới</span>
        </button>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Lớp học phụ trách</span>
          <p className="text-xl font-black text-[#111E3D] mt-1">Lớp 8A – Trải nghiệm</p>
          <span className="text-[10px] text-slate-400">Trường TH-THCS Chu Văn An</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Sĩ số học sinh thực nghiệm</span>
          <p className="text-xl font-black text-[#7157E8] mt-1">{students.length} học sinh</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% mã ẩn danh bảo mật</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Nhiệm vụ đang giao</span>
          <p className="text-xl font-black text-[#00C2B8] mt-1">{tasks.length} nhiệm vụ</p>
          <span className="text-[10px] text-slate-400">Gắn chuẩn Rubric 4 mức</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ hoàn thiện V3</span>
          <p className="text-xl font-black text-emerald-600 mt-1">100%</p>
          <span className="text-[10px] text-emerald-700 font-semibold">Qua ít nhất 3 phiên bản</span>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#7157E8]" />
          Danh Sách Nhiệm Vụ Đã Giao
        </h3>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-[#7157E8]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-[#7157E8]">
                    Lớp {task.grade} • {task.genre}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Hạn nộp: {task.dueDate}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                Đang mở
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Students & 5 Submission States Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00C2B8]" />
            Theo Dõi Tiến Trình Bài Viết 5S (5 Mã Học Sinh Thực Nghiệm)
          </h3>
          <span className="text-xs text-slate-400 italic">Mã ẩn danh bảo mật</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-3">Mã học sinh</th>
                <th className="py-3 px-3">Tên hiển thị</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3">Số lần tự sửa</th>
                <th className="py-3 px-3">Trạng thái bài</th>
                <th className="py-3 px-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((st, idx) => {
                // Find submission for student
                const sub = submissions.find((s) => s.studentId === st.id) || submissions[0];
                const statusInfo = statusLabels[sub?.status || 'completed'];

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#7157E8]">
                      {st.code}
                    </td>
                    <td className="py-3 px-3 font-semibold">{st.name}</td>
                    <td className="py-3 px-3 text-slate-500">{st.className}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold">
                        {st.editCount} phiên bản
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {onViewSubmission && (
                        <button
                          onClick={() => onViewSubmission(sub)}
                          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#7157E8] hover:text-white text-slate-700 font-bold text-xs transition-colors"
                        >
                          Xem bài làm
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Giao Nhiệm Vụ Mới Cho Lớp</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên nhiệm vụ *</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="VD: Cảm nhận đoạn trích và viết tiếp câu chuyện..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thể loại</label>
                  <input
                    type="text"
                    value={taskGenre}
                    onChange={(e) => setTaskGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Hướng dẫn học sinh thực hiện..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateTask}
                className="px-5 py-2 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] text-white font-bold text-xs shadow-md"
              >
                Giao bài cho lớp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
