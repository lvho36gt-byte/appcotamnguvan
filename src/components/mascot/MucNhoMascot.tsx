import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Bot } from 'lucide-react';
import { SpeechService } from '../../services/speechService';

interface MascotProps {
  state?: 'greeting' | 'thinking' | 'responding' | 'cheering';
  message?: string;
  onQuickAction?: (action: string) => void;
  className?: string;
  compact?: boolean;
}

export const MucNhoMascot: React.FC<MascotProps> = ({
  state = 'greeting',
  message,
  onQuickAction,
  className = '',
  compact = false,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const defaultMessage =
    message ||
    'Xin chào! Mình là Mực Nhỏ AI, người bạn đồng hành cùng bạn khám phá thế giới văn học. Hôm nay chúng mình cùng đọc hiểu, luyện viết hay sáng tạo nhé!';

  const handleSpeak = () => {
    if (!soundEnabled) return;
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      SpeechService.speak(
        defaultMessage,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const getEmotionBadge = () => {
    switch (state) {
      case 'thinking':
        return { text: 'Đang suy nghĩ...', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'responding':
        return { text: 'Mực Nhỏ đang giải thích', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'cheering':
        return { text: 'Tuyệt vời lắm!', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      default:
        return { text: 'Trợ lý AI sẵn sàng', color: 'bg-[#7157E8]/10 text-[#7157E8] border-[#7157E8]/30' };
    }
  };

  const badge = getEmotionBadge();

  if (compact) {
    return (
      <div className={`flex items-center gap-3 bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-indigo-100 shadow-sm ${className}`}>
        {/* Compact Mascot Avatar */}
        <div className="relative w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-tr from-[#111E3D] via-[#7157E8] to-[#00C2B8] p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full bg-[#111E3D] rounded-[14px] flex items-center justify-center overflow-hidden relative">
            {/* Robot Head SVG */}
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              {/* Antenna */}
              <circle cx="20" cy="8" r="2.5" fill="#FFD166" className="animate-pulse" />
              <line x1="20" y1="8" x2="20" y2="13" stroke="#00C2B8" strokeWidth="2" strokeLinecap="round" />
              {/* Head */}
              <rect x="9" y="13" width="22" height="18" rx="6" fill="#7157E8" />
              {/* Glasses frame */}
              <rect x="11" y="17" width="8" height="7" rx="2" fill="#00C2B8" />
              <rect x="21" y="17" width="8" height="7" rx="2" fill="#00C2B8" />
              <line x1="19" y1="20.5" x2="21" y2="20.5" stroke="#FFD166" strokeWidth="1.5" />
              {/* Eyes */}
              <circle cx="15" cy="20.5" r="1.8" fill="#111E3D" />
              <circle cx="25" cy="20.5" r="1.8" fill="#111E3D" />
              <circle cx="15.5" cy="19.8" r="0.6" fill="#FFFFFF" />
              <circle cx="25.5" cy="19.8" r="0.6" fill="#FFFFFF" />
              {/* Smile */}
              <path d="M 16 27 Q 20 30 24 27" stroke="#FFD166" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#111E3D]">Mực Nhỏ AI</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${badge.color}`}>
              {badge.text}
            </span>
          </div>
          <p className="text-xs text-slate-600 truncate">{defaultMessage}</p>
        </div>

        <button
          onClick={handleSpeak}
          title={isSpeaking ? 'Dừng đọc' : 'Nghe giọng đọc tiếng Việt'}
          className={`p-1.5 rounded-xl border text-xs transition-colors ${
            isSpeaking
              ? 'bg-[#7157E8] text-white border-[#7157E8] animate-pulse'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-[#111E3D] via-[#1A2C56] to-[#251A5A] rounded-3xl p-6 text-white shadow-xl overflow-hidden border border-indigo-900/40 ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#7157E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#00C2B8]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        {/* Mascot Robot Illustration */}
        <div className="relative group shrink-0">
          {/* Glowing pedestal */}
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-tr from-[#7157E8] via-[#00C2B8] to-[#FFD166] p-1 shadow-2xl shadow-[#7157E8]/30 transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#111E3D] rounded-[22px] flex items-center justify-center p-3 relative overflow-hidden">
              {/* Cute Animated Mascot SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Antenna */}
                <circle cx="50" cy="14" r="5" fill="#FFD166">
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </circle>
                <line x1="50" y1="14" x2="50" y2="25" stroke="#00C2B8" strokeWidth="4" strokeLinecap="round" />

                {/* Robot Head */}
                <rect x="22" y="25" width="56" height="46" rx="14" fill="#7157E8" />

                {/* Smart Glasses */}
                <rect x="26" y="34" width="20" height="17" rx="5" fill="#00C2B8" opacity="0.9" />
                <rect x="54" y="34" width="20" height="17" rx="5" fill="#00C2B8" opacity="0.9" />
                <line x1="46" y1="42" x2="54" y2="42" stroke="#FFD166" strokeWidth="3" />

                {/* Eyes */}
                {state === 'cheering' ? (
                  <>
                    <path d="M 31 43 Q 36 38 41 43" stroke="#111E3D" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M 59 43 Q 64 38 69 43" stroke="#111E3D" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="36" cy="42.5" r="4.5" fill="#111E3D" />
                    <circle cx="64" cy="42.5" r="4.5" fill="#111E3D" />
                    <circle cx="37.5" cy="40.5" r="1.5" fill="#FFFFFF" />
                    <circle cx="65.5" cy="40.5" r="1.5" fill="#FFFFFF" />
                  </>
                )}

                {/* Cute Cheeks */}
                <circle cx="28" cy="53" r="3" fill="#FF8BA7" opacity="0.6" />
                <circle cx="72" cy="53" r="3" fill="#FF8BA7" opacity="0.6" />

                {/* Smile / Mouth */}
                <path d="M 40 57 Q 50 65 60 57" stroke="#FFD166" strokeWidth="3" fill="none" strokeLinecap="round" />

                {/* Pen and Mini Book in hands */}
                <rect x="18" y="72" width="28" height="18" rx="3" fill="#FFFFFF" transform="rotate(-10 32 81)" />
                <line x1="22" y1="78" x2="40" y2="75" stroke="#7157E8" strokeWidth="2" />
                <line x1="23" y1="83" x2="38" y2="80" stroke="#00C2B8" strokeWidth="2" />

                {/* Quill / Pen */}
                <path d="M 72 68 L 84 82 L 80 84 Z" fill="#FFD166" />
                <circle cx="72" cy="68" r="2.5" fill="#00C2B8" />
              </svg>
            </div>
          </div>

          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1 border-2 border-[#111E3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            AI Trợ Lý
          </div>
        </div>

        {/* Mascot Dialogue & Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Mực Nhỏ AI</span>
              <Sparkles className="w-5 h-5 text-[#FFD166]" />
            </h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border backdrop-blur-md ${badge.color}`}>
              {badge.text}
            </span>
          </div>

          {/* Speech Bubble */}
          <div className="relative bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 mb-4 text-slate-100 text-sm md:text-base leading-relaxed shadow-inner">
            <p className="italic">"{defaultMessage}"</p>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-[#00C2B8]">
                <Bot className="w-4 h-4" />
                Trợ lý gợi mở – Không viết văn thay bạn
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#FFD166]" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleSpeak}
                  disabled={!soundEnabled}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSpeaking
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-[#7157E8] hover:bg-[#8B75F3] text-white shadow-sm'
                  }`}
                >
                  {isSpeaking ? 'Dừng đọc' : 'Nghe đọc'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          {onQuickAction && (
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {[
                { id: 'explore', label: 'Khám phá tác phẩm', icon: '📖' },
                { id: 'tutor', label: 'Hỏi đáp Ngữ văn', icon: '💬' },
                { id: 'write', label: 'Luyện viết cùng AI', icon: '✍️' },
                { id: 'mindmap', label: 'Tạo sơ đồ tư duy', icon: '🧠' },
                { id: 'critique', label: 'Phản biện bài viết', icon: '⚖️' },
                { id: 'games', label: 'Thử thách văn học', icon: '🎯' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => onQuickAction(btn.id)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-medium text-white border border-white/10 transition-all flex items-center gap-1.5 shadow-sm hover:border-[#00C2B8]/40"
                >
                  <span>{btn.icon}</span>
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
