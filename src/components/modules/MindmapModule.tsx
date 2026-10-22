import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  Sparkles,
  Download,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  RotateCcw,
  Palette,
  Edit3,
  Check,
  FileCode,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import type { GradeLevel, MindmapData, MindmapNode, MindmapEdge } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
}

export const MindmapModule: React.FC<Props> = ({ selectedGrade }) => {
  const [mapData, setMapData] = useState<MindmapData>(() => StorageService.getMindmap());
  const [topicInput, setTopicInput] = useState('Phân tích hình tượng nhân vật An (Hồ Tây Chiều Gió Sớm)');
  const [mapType, setMapType] = useState<'tree' | 'radial' | 'hierarchical' | 'compare'>('tree');
  const [loading, setLoading] = useState(false);

  // Canvas zoom & pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node editing & dragging
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [nodeLabelInput, setNodeLabelInput] = useState('');
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Palette colors for branches
  const branchColors = [
    '#7157E8', // Brand Purple
    '#00C2B8', // Teal
    '#FFD166', // Yellow
    '#8B75F3', // Light Purple
    '#009E96', // Dark Teal
    '#EC4899', // Pink
    '#3B82F6', // Blue
    '#10B981', // Emerald
  ];

  // Auto-generate mindmap via Gemini
  const handleGenerateMindmap = async () => {
    if (!topicInput.trim() || loading) return;
    setLoading(true);
    try {
      const res = await GeminiService.generateMindmap({
        topic: topicInput,
        text: '',
        mapType,
        grade: selectedGrade,
      });

      if (res.mapData) {
        const updated: MindmapData = {
          ...res.mapData,
          id: `map-${Date.now()}`,
          mapType,
          updatedAt: new Date().toISOString(),
        };
        setMapData(updated);
        StorageService.saveMindmap(updated);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  // Node dragging handlers
  const handleNodeMouseDown = (e: React.MouseEvent, node: MindmapNode) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingNodeId(node.id);
    setDragOffset({
      x: e.clientX / zoom - node.x,
      y: e.clientY / zoom - node.y,
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      const newX = Math.round(e.clientX / zoom - dragOffset.x);
      const newY = Math.round(e.clientY / zoom - dragOffset.y);
      setMapData((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n)),
      }));
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      StorageService.saveMindmap(mapData);
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  // Add new child node
  const handleAddChildNode = () => {
    if (!selectedNodeId) {
      alert('Vui lòng bấm chọn một nút làm nút cha trước.');
      return;
    }
    const parent = mapData.nodes.find((n) => n.id === selectedNodeId);
    if (!parent) return;

    const newId = `node-${Date.now()}`;
    const newNode: MindmapNode = {
      id: newId,
      label: 'Ý mới...',
      type: 'leaf',
      color: parent.color || '#00C2B8',
      x: parent.x + (Math.random() * 80 - 40),
      y: parent.y + 100,
    };

    const newEdge: MindmapEdge = {
      from: parent.id,
      to: newId,
    };

    const updated: MindmapData = {
      ...mapData,
      nodes: [...mapData.nodes, newNode],
      edges: [...mapData.edges, newEdge],
      updatedAt: new Date().toISOString(),
    };
    setMapData(updated);
    setSelectedNodeId(newId);
    setEditingNodeId(newId);
    setNodeLabelInput('Ý mới...');
    StorageService.saveMindmap(updated);
  };

  // Delete node
  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    if (selectedNodeId === 'root') {
      alert('Không thể xóa nút chủ đề trung tâm.');
      return;
    }
    const updated: MindmapData = {
      ...mapData,
      nodes: mapData.nodes.filter((n) => n.id !== selectedNodeId),
      edges: mapData.edges.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId),
      updatedAt: new Date().toISOString(),
    };
    setMapData(updated);
    setSelectedNodeId(null);
    StorageService.saveMindmap(updated);
  };

  // Save node label edit
  const handleSaveNodeLabel = () => {
    if (!editingNodeId) return;
    const updated: MindmapData = {
      ...mapData,
      nodes: mapData.nodes.map((n) =>
        n.id === editingNodeId ? { ...n, label: nodeLabelInput.trim() || n.label } : n
      ),
      updatedAt: new Date().toISOString(),
    };
    setMapData(updated);
    setEditingNodeId(null);
    StorageService.saveMindmap(updated);
  };

  // Change branch color
  const handleChangeColor = (color: string) => {
    if (!selectedNodeId) return;
    const updated: MindmapData = {
      ...mapData,
      nodes: mapData.nodes.map((n) => (n.id === selectedNodeId ? { ...n, color } : n)),
      updatedAt: new Date().toISOString(),
    };
    setMapData(updated);
    StorageService.saveMindmap(updated);
  };

  // Reset Layout
  const handleResetLayout = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // Reposition nicely
    const rootNode = mapData.nodes.find((n) => n.id === 'root' || n.type === 'root') || mapData.nodes[0];
    const branches = mapData.nodes.filter((n) => n.id !== rootNode?.id && n.type === 'branch');
    const leaves = mapData.nodes.filter((n) => n.id !== rootNode?.id && n.type !== 'branch');

    const centerX = 450;
    const centerY = 60;

    const repositionedNodes = mapData.nodes.map((n) => {
      if (n.id === rootNode?.id) {
        return { ...n, x: centerX, y: centerY };
      }
      const bIdx = branches.findIndex((b) => b.id === n.id);
      if (bIdx >= 0) {
        const spacing = 750 / (branches.length + 1);
        return { ...n, x: Math.round(100 + (bIdx + 1) * spacing), y: 190 };
      }
      return n;
    });

    setMapData({ ...mapData, nodes: repositionedNodes });
  };

  // EXPORT AS PNG USING HIGH-RES HTML5 CANVAS
  const handleExportPNG = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 800;
      canvas.width = width;
      canvas.height = height;

      // Background fill
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Title & Watermark header
      ctx.fillStyle = '#111E3D';
      ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
      ctx.fillText(mapData.title, 40, 45);

      ctx.fillStyle = '#7157E8';
      ctx.font = 'bold 12px "Be Vietnam Pro", sans-serif';
      ctx.fillText('TRỢ LÝ VĂN HỌC SỐ AI • TRƯỜNG TH-THCS CHU VĂN AN (HÀ NỘI)', 40, 70);

      // Draw edges
      mapData.edges.forEach((edge) => {
        const fromNode = mapData.nodes.find((n) => n.id === edge.from);
        const toNode = mapData.nodes.find((n) => n.id === edge.to);
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.strokeStyle = toNode.color || '#7157E8';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';

          // Smooth bezier curve
          const startX = fromNode.x + 80;
          const startY = fromNode.y + 25;
          const endX = toNode.x + 80;
          const endY = toNode.y + 25;

          const midY = (startY + endY) / 2;
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(startX, midY, endX, midY, endX, endY);
          ctx.stroke();
        }
      });

      // Draw nodes
      mapData.nodes.forEach((node) => {
        const isRoot = node.id === 'root' || node.type === 'root';
        const nodeW = isRoot ? 200 : 160;
        const nodeH = 50;
        const radius = 12;

        // Shadow
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Node box
        ctx.fillStyle = isRoot ? node.color : '#FFFFFF';
        ctx.strokeStyle = node.color || '#7157E8';
        ctx.lineWidth = isRoot ? 0 : 2.5;

        ctx.beginPath();
        ctx.roundRect(node.x, node.y, nodeW, nodeH, radius);
        ctx.fill();
        if (!isRoot) ctx.stroke();

        ctx.shadowColor = 'transparent';

        // Node Label
        ctx.fillStyle = isRoot ? '#FFFFFF' : '#111E3D';
        ctx.font = isRoot ? 'bold 13px "Be Vietnam Pro", sans-serif' : '600 12px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Truncate label if too long
        let text = node.label;
        if (text.length > 24) text = text.slice(0, 22) + '...';
        ctx.fillText(text, node.x + nodeW / 2, node.y + nodeH / 2);
      });

      // Trigger download
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `so-do-tu-duy-${mapData.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    } catch (e) {
      console.error('Export PNG failed:', e);
      alert('Không thể xuất file ảnh. Vui lòng thử lại!');
    }
  };

  // Export SVG
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgContent = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `so-do-tu-duy-${mapData.title.replace(/\s+/g, '-').toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#1E2E5C] to-[#00C2B8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFD166] text-[#111E3D] font-black text-xs">
              MODULE 04
            </span>
            <span className="text-xs text-indigo-200">Trực quan hóa tri thức</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Sơ Đồ Tư Duy AI – Kết Nối Tri Thức Văn Học
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            Hỗ trợ kéo thả nút, thêm/xóa nhánh, đổi màu sắc và <strong>xuất file ảnh PNG sắc nét</strong> phục vụ thuyết trình, bài giảng hoặc dán vào sổ tay văn học.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPNG}
            className="px-4 py-2.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFE08F] text-[#111E3D] font-extrabold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Tải ảnh PNG</span>
          </button>
          <button
            onClick={handleExportSVG}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            title="Tải mã nguồn đồ họa SVG"
          >
            <FileCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Generator & Controller Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Nhập chủ đề tác phẩm, nhân vật hoặc kiến thức tiếng Việt..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#7157E8]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="tree">Sơ đồ cây (Tree)</option>
              <option value="radial">Tỏa tròn (Radial)</option>
              <option value="hierarchical">Phân cấp (Hierarchical)</option>
              <option value="compare">So sánh nhân vật (Compare)</option>
            </select>

            <button
              onClick={handleGenerateMindmap}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#7157E8] hover:bg-[#583ECE] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-900/20 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#FFD166]" />
              <span>{loading ? 'Đang tạo...' : 'Tạo sơ đồ AI'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Add, Delete, Color, Zoom, Edit */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddChildNode}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1 transition-colors"
              title="Thêm nhánh con từ nút đang chọn"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm nhánh</span>
            </button>

            <button
              onClick={handleDeleteNode}
              disabled={!selectedNodeId || selectedNodeId === 'root'}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold border border-rose-200 disabled:opacity-30 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa nút</span>
            </button>

            {/* Color picker */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <span className="text-[11px] font-bold text-slate-400">Đổi màu:</span>
              {branchColors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleChangeColor(c)}
                  style={{ backgroundColor: c }}
                  className="w-5 h-5 rounded-full border border-white shadow-xs hover:scale-125 transition-transform"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetLayout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] flex items-center gap-1"
              title="Căn chỉnh lại bố cục"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Căn lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Mindmap Canvas */}
      <div
        className="relative bg-slate-50 rounded-3xl border-2 border-slate-200/80 shadow-inner h-[580px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Drawing Canvas */}
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Defs for gradients & shadow filters */}
          <defs>
            <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Edges */}
          {mapData.edges.map((edge, idx) => {
            const from = mapData.nodes.find((n) => n.id === edge.from);
            const to = mapData.nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;

            const startX = from.x + 85;
            const startY = from.y + 24;
            const endX = to.x + 85;
            const endY = to.y + 24;
            const midY = (startY + endY) / 2;

            return (
              <path
                key={idx}
                d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
                stroke={to.color || '#7157E8'}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-200"
              />
            );
          })}

          {/* Nodes */}
          {mapData.nodes.map((node) => {
            const isRoot = node.id === 'root' || node.type === 'root';
            const isSelected = selectedNodeId === node.id;
            const nodeW = isRoot ? 190 : 160;
            const nodeH = 48;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                className="cursor-pointer group"
              >
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width={nodeW}
                  height={nodeH}
                  rx="14"
                  fill={isRoot ? node.color : '#FFFFFF'}
                  stroke={isSelected ? '#111E3D' : node.color}
                  strokeWidth={isSelected ? '3.5' : isRoot ? '0' : '2'}
                  filter="url(#nodeShadow)"
                  className="transition-all"
                />

                {/* Node Text Label */}
                <text
                  x={nodeW / 2}
                  y={nodeH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isRoot ? '#FFFFFF' : '#111E3D'}
                  fontSize={isRoot ? '12' : '11'}
                  fontWeight={isRoot ? 'bold' : '600'}
                  fontFamily="'Be Vietnam Pro', sans-serif"
                  className="pointer-events-none select-none"
                >
                  {node.label.length > 22 ? node.label.slice(0, 20) + '...' : node.label}
                </text>

                {/* Quick edit pen indicator on hover */}
                <circle
                  cx={nodeW - 10}
                  cy="12"
                  r="6"
                  fill={node.color}
                  opacity="0.8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(node.id);
                    setNodeLabelInput(node.label);
                  }}
                  className="hover:scale-125 transition-transform"
                />
              </g>
            );
          })}
        </svg>

        {/* Edit Node Label Modal / Floating Box */}
        {editingNodeId && (
          <div className="absolute top-4 left-4 z-20 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 max-w-xs animate-fadeIn">
            <h5 className="font-bold text-xs text-slate-800 mb-2">Đổi tên nút:</h5>
            <input
              type="text"
              autoFocus
              value={nodeLabelInput}
              onChange={(e) => setNodeLabelInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNodeLabel()}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-[#7157E8] mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingNodeId(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNodeLabel}
                className="px-3 py-1 rounded-lg bg-[#7157E8] text-white text-xs font-bold"
              >
                Lưu
              </button>
            </div>
          </div>
        )}

        {/* Canvas instruction overlay */}
        <div className="absolute bottom-3 left-4 text-[11px] text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200">
          💡 <strong>Mẹo:</strong> Nhấn giữ và kéo chuột để di chuyển các nút • Bấm vào nút rồi chọn "Thêm nhánh" để mở rộng ý.
        </div>
      </div>
    </div>
  );
};
