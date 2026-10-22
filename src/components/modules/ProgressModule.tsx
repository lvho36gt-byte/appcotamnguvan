import React, { useRef } from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  BarChart2,
  CheckCircle,
  FileSpreadsheet,
  Award,
  AlertCircle,
  Sparkles,
  Users,
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import type { GradeLevel, StudentAccount, UserRole } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
  currentRole: UserRole;
}

export const ProgressModule: React.FC<Props> = ({ selectedGrade, currentRole }) => {
  const students: StudentAccount[] = StorageService.getStudents();
  const reportRef = useRef<HTMLDivElement>(null);

  // Robust calculations (strictly no division by zero)
  const totalStudents = students.length;
  const avgPreTest =
    totalStudents > 0
      ? (students.reduce((acc, s) => acc + s.preTestScore, 0) / totalStudents).toFixed(1)
      : '0.0';
  const avgPostTest =
    totalStudents > 0
      ? (students.reduce((acc, s) => acc + s.postTestScore, 0) / totalStudents).toFixed(1)
      : '0.0';
  const scoreDiff =
    totalStudents > 0 ? (Number(avgPostTest) - Number(avgPreTest)).toFixed(1) : '0.0';

  const totalEdits = students.reduce((acc, s) => acc + s.editCount, 0);
  const avgEdits = totalStudents > 0 ? (totalEdits / totalStudents).toFixed(1) : '0';

  const completedCount = students.filter((s) => s.completedTasks >= 2).length;
  const completionRate =
    totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

  // Export CSV with UTF-8 BOM so Vietnamese characters open correctly in Excel
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'Mã học sinh,Họ và tên,Lớp,Điểm khảo sát trước,Điểm khảo sát sau,Chênh lệch,Số lần tự sửa bài,Trạng thái\n';

    students.forEach((s) => {
      const diff = (s.postTestScore - s.preTestScore).toFixed(1);
      csvContent += `"${s.code}","${s.name}","${s.className}",${s.preTestScore},${s.postTestScore},+${diff},${s.editCount},"Đã hoàn thiện"\n`;
    });

    csvContent += `\nTổng kết,Sĩ số: ${totalStudents},,Điểm TB trước: ${avgPreTest},Điểm TB sau: ${avgPostTest},Tăng: +${scoreDiff},TB sửa: ${avgEdits} lần,Hoàn thành: ${completionRate}%\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bao-cao-tien-bo-lop-8a-chu-van-an-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Chart as PNG
  const handleDownloadChartPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1000;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#111E3D';
    ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
    ctx.fillText('BIỂU ĐỒ ĐỐI CHIẾU NĂNG LỰC NGỮ VĂN TRƯỚC VÀ SAU KHI ỨNG DỤNG AI', 40, 50);

    ctx.fillStyle = '#7157E8';
    ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
    ctx.fillText('DỰ ÁN: TRỢ LÝ VĂN HỌC SỐ AI • TRƯỜNG TH-THCS CHU VĂN AN (HÀ NỘI)', 40, 75);

    // Bar chart
    const startX = 100;
    const baseY = 480;
    const barW = 40;
    const gap = 140;

    // Y Axis
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i += 2) {
      const y = baseY - (i / 10) * 360;
      ctx.beginPath();
      ctx.moveTo(startX - 20, y);
      ctx.lineTo(startX + students.length * gap, y);
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '12px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`${i}.0`, startX - 45, y + 4);
    }

    students.forEach((s, idx) => {
      const x = startX + idx * gap;

      // Pre-test bar
      const hPre = (s.preTestScore / 10) * 360;
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(x, baseY - hPre, barW, hPre);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 11px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`${s.preTestScore}`, x + 8, baseY - hPre - 6);

      // Post-test bar
      const hPost = (s.postTestScore / 10) * 360;
      ctx.fillStyle = '#7157E8';
      ctx.fillRect(x + barW + 8, baseY - hPost, barW, hPost);
      ctx.fillStyle = '#583ECE';
      ctx.font = 'bold 11px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`${s.postTestScore}`, x + barW + 16, baseY - hPost - 6);

      // Label X
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 11px "Be Vietnam Pro", sans-serif';
      ctx.fillText(s.code, x + 15, baseY + 25);
    });

    // Legend
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(700, 70, 20, 12);
    ctx.fillStyle = '#475569';
    ctx.font = '12px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Khảo sát trước', 730, 80);

    ctx.fillStyle = '#7157E8';
    ctx.fillRect(840, 70, 20, 12);
    ctx.fillStyle = '#475569';
    ctx.fillText('Khảo sát sau (5S)', 870, 80);

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `bieu-do-tien-bo-hoc-sinh-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div ref={reportRef} className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#009E96] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#111E3D] font-black text-xs">
              MODULE 11
            </span>
            <span className="text-xs text-indigo-200">Đo lường tiến bộ thực chất</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Hành Trình Trưởng Thành Cùng Văn Học
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Hệ thống thống kê dựa trên dữ liệu đối chiếu Trước – Sau thực tế. Tự động tính điểm trung bình, mức chênh lệch và số lần học sinh tự chỉnh sửa bài viết.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-[#00C2B8] hover:bg-[#26E5DC] text-[#111E3D] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất CSV</span>
          </button>
          <button
            onClick={handleDownloadChartPNG}
            className="px-4 py-2.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFE08F] text-[#111E3D] font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải biểu đồ PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            title="In báo cáo"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Warning Banner as required by prompt */}
      {currentRole === 'demo' && (
        <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 font-bold text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            DỮ LIỆU DEMO – KHÔNG PHẢI KẾT QUẢ THỬ NGHIỆM ĐẠI TRÀ TOÀN THÀNH PHỐ
          </span>
        </div>
      )}

      {/* Automated Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sĩ số thực tế</span>
          <p className="text-xl font-black text-[#111E3D] mt-1">{totalStudents}</p>
          <span className="text-[10px] text-slate-500">Mã HS lớp 8A</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Điểm TB Trước</span>
          <p className="text-xl font-black text-slate-600 mt-1">{avgPreTest}</p>
          <span className="text-[10px] text-slate-400">Khảo sát đầu</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Điểm TB Sau (5S)</span>
          <p className="text-xl font-black text-[#7157E8] mt-1">{avgPostTest}</p>
          <span className="text-[10px] text-[#7157E8] font-bold">Sau 4 tuần</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Mức tăng trưởng</span>
          <p className="text-xl font-black text-emerald-600 mt-1">+{scoreDiff}</p>
          <span className="text-[10px] text-emerald-700 font-bold">Thang điểm 10</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">TB tự sửa bài</span>
          <p className="text-xl font-black text-[#00C2B8] mt-1">{avgEdits} lần</p>
          <span className="text-[10px] text-slate-500">V1 → V2 → V3</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Tỷ lệ hoàn thiện</span>
          <p className="text-xl font-black text-teal-600 mt-1">{completionRate}%</p>
          <span className="text-[10px] text-teal-700 font-bold">Đạt yêu cầu trở lên</span>
        </div>
      </div>

      {/* Main Bar Chart: Before vs After */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#7157E8]" />
              Biểu Đồ Cột Đối Chiếu Trước – Sau (Theo Từng Học Sinh)
            </h3>
            <p className="text-xs text-slate-500">Cùng sử dụng thang Rubric 5 tiêu chí để đảm bảo độ tin cậy</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded-xs bg-slate-300" /> Trước (Đầu vào)
            </span>
            <span className="flex items-center gap-1.5 text-[#7157E8]">
              <span className="w-3 h-3 rounded-xs bg-[#7157E8]" /> Sau (Mô hình 5S)
            </span>
          </div>
        </div>

        {/* Visual Bar Columns */}
        <div className="pt-6 pb-2 space-y-4">
          {students.map((st) => {
            const prePercent = (st.preTestScore / 10) * 100;
            const postPercent = (st.postTestScore / 10) * 100;

            return (
              <div key={st.id} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="font-mono text-[#111E3D]">{st.code} ({st.name})</span>
                  <span className="text-slate-500">
                    {st.preTestScore} điểm →{' '}
                    <strong className="text-emerald-600">{st.postTestScore} điểm</strong> (
                    <span className="text-emerald-700 font-bold">+{(st.postTestScore - st.preTestScore).toFixed(1)}</span>)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  {/* Pre bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex items-center">
                    <div
                      style={{ width: `${prePercent}%` }}
                      className="bg-slate-400 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  {/* Post bar */}
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex items-center">
                    <div
                      style={{ width: `${postPercent}%` }}
                      className="bg-gradient-to-r from-[#7157E8] to-[#00C2B8] h-full rounded-full transition-all duration-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Student Data Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Bảng Điểm Minh Họa Chi Tiết (Có Thể Xuất CSV Để Đưa Vào Slide / Poster Báo Cáo)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Mã học sinh</th>
                <th className="py-2.5 px-3">Lớp học</th>
                <th className="py-2.5 px-3">Khảo sát trước</th>
                <th className="py-2.5 px-3">Khảo sát sau</th>
                <th className="py-2.5 px-3">Mức tăng</th>
                <th className="py-2.5 px-3">Số lần tự sửa</th>
                <th className="py-2.5 px-3">Đánh giá chung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#7157E8]">{st.code}</td>
                  <td className="py-3 px-3">{st.className}</td>
                  <td className="py-3 px-3 text-slate-600 font-semibold">{st.preTestScore}</td>
                  <td className="py-3 px-3 text-slate-900 font-bold">{st.postTestScore}</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">
                    +{(st.postTestScore - st.preTestScore).toFixed(1)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold">
                      {st.editCount} bản
                    </span>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-medium">
                    ✓ Tiến bộ vượt bậc
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
