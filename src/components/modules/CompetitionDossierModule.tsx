import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  Download,
  Edit2,
  Save,
  FileText,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import type { CompetitionCriterion, UserRole } from '../../types';

interface Props {
  currentRole: UserRole;
}

export const CompetitionDossierModule: React.FC<Props> = ({ currentRole }) => {
  const [criteria, setCriteria] = useState<CompetitionCriterion[]>(() =>
    StorageService.getCompetitionCriteria()
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<CompetitionCriterion['status']>('ĐÃ BỔ SUNG');
  const [saveToast, setSaveToast] = useState(false);

  const statusColors: Record<CompetitionCriterion['status'], { bg: string; text: string }> = {
    'CHƯA CÓ MINH CHỨNG': { bg: 'bg-slate-100', text: 'text-slate-600' },
    'ĐANG THU THẬP': { bg: 'bg-amber-100', text: 'text-amber-800' },
    'ĐÃ BỔ SUNG': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'ĐÃ KIỂM TRA': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  };

  const handleStartEdit = (crit: CompetitionCriterion) => {
    setEditingId(crit.id);
    setEditNotes(crit.notes);
    setEditStatus(crit.status);
  };

  const handleSaveEdit = (critId: string) => {
    const updated = criteria.map((c) =>
      c.id === critId ? { ...c, notes: editNotes, status: editStatus } : c
    );
    setCriteria(updated);
    StorageService.saveCompetitionCriteria(updated);
    setEditingId(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Export competition dossier document
  const handleExportDossier = () => {
    let content = `BÁO CÁO MINH CHỨNG HIỆU QUẢ ỨNG DỤNG AI TRONG DẠY HỌC NGỮ VĂN THCS
CUỘC THI: "ỨNG DỤNG AI TRONG GIÁO DỤC VIỆT NAM 2026"
Tên sản phẩm: TRỢ LÝ VĂN HỌC SỐ AI
Tác giả: Cô Lê Thị Tâm
Đơn vị: Trường TH-THCS Chu Văn An, Tây Hồ, Hà Nội
--------------------------------------------------------------------------\n\n`;

    criteria.forEach((c) => {
      content += `TIÊU CHÍ ${c.number}: ${c.name.toUpperCase()} (TRỌNG SỐ: ${c.weight})
- Trạng thái: ${c.status}
- Mô tả chức năng: ${c.description}
- Bằng chứng cần thu thập: ${c.requiredEvidence}
- Tài liệu thực tế đã bổ sung: ${c.addedEvidence}
- Ghi chú thẩm định: ${c.notes}
--------------------------------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ho-so-minh-chung-du-thi-ai-2026-le-thi-tam.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#2E1E66] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#111E3D] font-black text-xs">
              MODULE 12
            </span>
            <span className="text-xs text-indigo-200">Chuẩn bị hồ sơ dự thi 2026</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Hồ Sơ Minh Chứng Hiệu Quả Ứng Dụng AI
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Hỗ trợ giáo viên tổng hợp minh chứng thực tiễn theo <strong>5 tiêu chuẩn đánh giá của cuộc thi</strong>: Tính thực tiễn (25%), Sáng tạo (20%), Kết quả (25%), Nhân rộng (15%), Trình bày (15%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDossier}
            className="px-4 py-2.5 rounded-2xl bg-[#00C2B8] hover:bg-[#26E5DC] text-[#111E3D] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Xuất hồ sơ minh chứng</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã lưu cập nhật minh chứng thành công!</span>
        </div>
      )}

      {/* 5 Criteria Cards */}
      <div className="space-y-4">
        {criteria.map((crit) => {
          const isEditing = editingId === crit.id;
          const statusStyle = statusColors[crit.status];

          return (
            <div
              key={crit.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-[#7157E8]/40 shadow-sm space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#7157E8] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    {crit.weight}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      Tiêu chí {crit.number}: {crit.name}
                    </h3>
                    <p className="text-xs text-slate-500">{crit.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl ${statusStyle.bg} ${statusStyle.text}`}>
                    {crit.status}
                  </span>

                  {(currentRole === 'teacher' || currentRole === 'demo') && !isEditing && (
                    <button
                      onClick={() => handleStartEdit(crit)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                      title="Chỉnh sửa ghi chú minh chứng"
                    >
                      <Edit2 className="w-4 h-4 text-[#7157E8]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Evidence details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                  <span className="font-bold text-[#7157E8] block">Bằng chứng cần thu thập:</span>
                  <p className="text-slate-700 leading-relaxed">{crit.requiredEvidence}</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                  <span className="font-bold text-teal-800 block">Tài liệu thực tế đã bổ sung:</span>
                  <p className="text-slate-700 leading-relaxed">{crit.addedEvidence}</p>
                </div>
              </div>

              {/* Notes / Editing section */}
              {isEditing ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Trạng thái minh chứng:</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-800 focus:outline-none focus:border-[#7157E8]"
                      >
                        <option value="CHƯA CÓ MINH CHỨNG">CHƯA CÓ MINH CHỨNG</option>
                        <option value="ĐANG THU THẬP">ĐANG THU THẬP</option>
                        <option value="ĐÃ BỔ SUNG">ĐÃ BỔ SUNG</option>
                        <option value="ĐÃ KIỂM TRA">ĐÃ KIỂM TRA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ghi chú của giáo viên:</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-[#7157E8]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSaveEdit(crit.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#7157E8] text-white font-bold flex items-center gap-1 shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    <strong>Ghi chú giáo viên:</strong> {crit.notes}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Cập nhật phục vụ báo cáo thuyết trình
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
