import React, { useState } from 'react';
import {
  Library,
  BookOpen,
  PlusCircle,
  Filter,
  Search,
  Tag,
  Trash2,
  CheckCircle,
  Send,
  FileText,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import type { GradeLevel, LiteraryWork, UserRole } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  currentRole: UserRole;
  onSelectWorkForTask?: (work: LiteraryWork) => void;
}

export const LibraryModule: React.FC<Props> = ({
  selectedGrade,
  currentRole,
  onSelectWorkForTask,
}) => {
  const [works, setWorks] = useState<LiteraryWork[]>(() => StorageService.getWorks());
  const [filterGrade, setFilterGrade] = useState<number | 'all'>(selectedGrade);
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add work modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Truyện ngắn');
  const [skill, setSkill] = useState('Đọc hiểu');
  const [difficulty, setDifficulty] = useState<'Cơ bản' | 'Trung bình' | 'Nâng cao'>('Trung bình');
  const [grade, setGrade] = useState<GradeLevel>(selectedGrade);
  const [text, setText] = useState('');

  const skillsList = ['Tất cả kỹ năng', 'Đọc hiểu', 'Tiếng Việt', 'Viết', 'Nói và nghe', 'Ôn tập'];
  const genresList = ['Tất cả thể loại', 'Truyện ngắn / Ký', 'Thơ', 'Tản văn / Biểu cảm', 'Nghị luận xã hội'];

  // Filtered list
  const filteredWorks = works.filter((w) => {
    if (filterGrade !== 'all' && w.grade !== filterGrade) return false;
    if (filterSkill !== 'all' && w.skill !== filterSkill) return false;
    if (filterGenre !== 'all' && w.genre !== filterGenre) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        w.author.toLowerCase().includes(q) ||
        w.text.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveNewWork = () => {
    if (!title.trim() || !text.trim()) {
      alert('Vui lòng nhập tên tác phẩm và trích đoạn văn bản.');
      return;
    }
    const newWork: LiteraryWork = {
      id: `work-${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'Nhóm Dự án Chu Văn An',
      grade,
      genre,
      skill,
      difficulty,
      text: text.trim(),
    };
    StorageService.saveWork(newWork);
    setWorks(StorageService.getWorks());
    setShowAddModal(false);
    setTitle('');
    setAuthor('');
    setText('');
  };

  const handleDeleteWork = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa học liệu này không?')) {
      StorageService.deleteWork(id);
      setWorks(StorageService.getWorks());
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1A2C56] to-[#009E96] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 09
            </span>
            <span className="text-xs text-indigo-200">Kho học liệu chuẩn mực THCS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Thư Viện Học Liệu & Ngữ Liệu Văn Học
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Ngữ liệu văn học tự sáng tác riêng và trích đoạn được phép sử dụng. Phân loại theo khối lớp 6 – 9, thể loại, kỹ năng và mức độ nhận thức.
          </p>
        </div>

        {(currentRole === 'teacher' || currentRole === 'demo') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 px-4 py-2.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFE08F] text-[#111E3D] font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm học liệu mới</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tác phẩm, tác giả..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#7157E8]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Grade filter */}
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">Tất cả các khối (6-9)</option>
            <option value="6">Khối lớp 6</option>
            <option value="7">Khối lớp 7</option>
            <option value="8">Khối lớp 8</option>
            <option value="9">Khối lớp 9</option>
          </select>

          {/* Skill filter */}
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value === 'Tất cả kỹ năng' ? 'all' : e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none"
          >
            {skillsList.map((sk) => (
              <option key={sk} value={sk === 'Tất cả kỹ năng' ? 'all' : sk}>
                {sk}
              </option>
            ))}
          </select>

          {/* Genre filter */}
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value === 'Tất cả thể loại' ? 'all' : e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 focus:outline-none"
          >
            {genresList.map((gn) => (
              <option key={gn} value={gn === 'Tất cả thể loại' ? 'all' : gn}>
                {gn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorks.map((work) => (
          <div
            key={work.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#7157E8]/40 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#7157E8]">
                  Lớp {work.grade} • {work.skill}
                </span>
                {work.isDemo && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                    DEMO
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1">{work.title}</h3>
              <p className="text-xs text-slate-500 mb-3">Tác giả: {work.author}</p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 font-serif text-slate-700 text-xs leading-relaxed max-h-36 overflow-y-auto mb-3">
                {work.text}
              </div>

              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {work.genre}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold">
                  Mức độ: {work.difficulty}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {onSelectWorkForTask && (
                <button
                  onClick={() => onSelectWorkForTask(work)}
                  className="text-xs font-bold text-[#7157E8] hover:underline flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Chọn giao nhiệm vụ</span>
                </button>
              )}

              {(currentRole === 'teacher' || currentRole === 'demo') && (
                <button
                  onClick={() => handleDeleteWork(work.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors ml-auto"
                  title="Xóa học liệu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Work Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">Thêm Ngữ Liệu Văn Học Mới</h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên tác phẩm *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Khối lớp</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thể loại</label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#7157E8]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-xs">
                Nội dung trích đoạn văn bản *
              </label>
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#7157E8] leading-relaxed"
                placeholder="Dán toàn bộ văn bản hoặc trích đoạn ở đây..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNewWork}
                className="px-5 py-2 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] text-white font-bold text-xs shadow-md"
              >
                Lưu vào thư viện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
