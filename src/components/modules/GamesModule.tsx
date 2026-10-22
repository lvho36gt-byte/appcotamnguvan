import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Clock,
  Award,
  Sparkles,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Trophy,
  Zap,
} from 'lucide-react';
import { GeminiService } from '../../services/geminiService';
import type { GameQuestion, GradeLevel } from '../../types';

interface Props {
  selectedGrade: GradeLevel;
}

export const GamesModule: React.FC<Props> = ({ selectedGrade }) => {
  const gameModes = [
    { id: 'quick', name: '1. AI Hỏi nhanh – Đáp đúng', desc: 'Thử thách tốc độ với các câu hỏi nhận biết & thông hiểu nhanh.', icon: '⚡' },
    { id: 'bell', name: '2. Rung chuông vàng Ngữ văn', desc: 'Vượt qua chuỗi câu hỏi phân loại nâng cao để chạm đến đỉnh vinh quang.', icon: '🔔' },
    { id: 'char', name: '3. Giải mã nhân vật', desc: 'Dựa vào các manh mối ngoại hình, hành động để đoán tên nhân vật.', icon: '🕵️' },
    { id: 'critic', name: '4. Ai là nhà phê bình?', desc: 'Lựa chọn nhận định sắc bén và phát hiện dẫn chứng chuẩn mực.', icon: '🧐' },
    { id: 'secret', name: '5. Ô cửa bí mật', desc: 'Mở từng ô cửa tri thức văn học để khám phá bức tranh chủ đề.', icon: '🚪' },
    { id: 'match', name: '6. Ghép từ – Ghép ý', desc: 'Nối các biện pháp tu từ, từ Hán Việt và tác dụng nghệ thuật.', icon: '🧩' },
    { id: 'reading', name: '7. Thử thách đọc hiểu', desc: 'Đọc văn bản ngắn và trả lời 4 cấp độ tư duy từ Nhận biết đến Vận dụng cao.', icon: '📖' },
    { id: 'debate', name: '8. Đấu trường lập luận', desc: 'Lựa chọn dẫn chứng đắt giá để bảo vệ luận điểm trong bài nghị luận.', icon: '⚔️' },
  ];

  const [activeGameId, setActiveGameId] = useState('bell');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);

  // Question bank
  const [questions, setQuestions] = useState<GameQuestion[]>([
    {
      id: 1,
      level: 'Nhận biết',
      question: 'Trong truyện ngắn "Hồ Tây Chiều Gió Sớm", nhân vật An đã có hành động đặc biệt nào?',
      options: [
        'Mỉm cười thả chú cá rô nhỏ trở lại làn nước biếc',
        'Đem chú cá rô về làm bể cá cảnh',
        'Bán chú cá cho người đi đường',
        'Bỏ quên cần câu ở đường Thanh Niên',
      ],
      correctIndex: 0,
      explanation: 'Văn bản nêu rõ An không câu cá để bắt mà để lưu giữ ký ức, và đã thả chú cá rô nhỏ trở về lòng hồ.',
    },
    {
      id: 2,
      level: 'Thông hiểu',
      question: 'Chi tiết "tiếng chuông chùa Trấn Vũ ngân dài trong sương chiều" mang lại tác dụng nghệ thuật gì?',
      options: [
        'Tạo không gian tĩnh lặng, thiêng liêng và gợi nỗi niềm bâng khuâng',
        'Báo hiệu trời đã sắp tối để mọi người về nhà',
        'Tả sự ồn ào náo nhiệt của phố phường',
        'Nhấn mạnh vào kỹ thuật đúc chuông',
      ],
      correctIndex: 0,
      explanation: 'Âm thanh tiếng chuông chùa giữa sương mỏng Hồ Tây làm tăng chiều sâu văn hóa và cảm xúc lắng đọng của nhân vật.',
    },
    {
      id: 3,
      level: 'Vận dụng',
      question: 'Lời dạy của bà nội: "Hồ Tây như trái tim của Hà Nội..." sử dụng biện pháp tu từ nào?',
      options: [
        'So sánh kết hợp nhân hóa biểu cảm',
        'Nói quá phóng đại sự thật',
        'Điệp từ điệp ngữ đơn thuần',
        'Ẩn dụ chuyển đổi cảm giác thuần túy',
      ],
      correctIndex: 0,
      explanation: 'Biện pháp so sánh "như trái tim" làm nổi bật vị trí thiêng liêng, nguồn sống và nhịp thở tâm hồn của Hà Nội.',
    },
    {
      id: 4,
      level: 'Vận dụng cao',
      question: 'Triết lý trưởng thành được gửi gắm qua hành động của An là gì?',
      options: [
        'Trưởng thành là biết nâng niu những ký ức đẹp làm hành trang bước tiếp',
        'Trưởng thành là phải tích lũy thật nhiều của cải',
        'Trưởng thành là quên hết quá khứ tuổi thơ',
        'Trưởng thành là không cần sự gắn kết gia đình',
      ],
      correctIndex: 0,
      explanation: 'Trưởng thành thực sự là khi con người biết trân trọng những giá trị bình dị và tình cảm gia đình, quê hương.',
    },
  ]);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && !isAnswerSubmitted && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isAnswerSubmitted, timer]);

  const handleStartGame = () => {
    setIsPlaying(true);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setTimer(30);
    setGameOver(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    if (idx === questions[currentQIndex]?.correctIndex) {
      setScore((s) => s + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimer(30);
    } else {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  // AI Generate fresh questions
  const handleGenerateFreshQuestions = async () => {
    setLoadingNewQuiz(true);
    try {
      const res = await GeminiService.generateQuiz({
        title: 'Hồ Tây Chiều Gió Sớm và Văn hóa Tràng An',
        text: 'Ngữ liệu văn học lớp 8 về tình yêu quê hương và bài học trưởng thành.',
        grade: selectedGrade,
        count: 5,
      });

      if (res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        handleStartGame();
      }
    } catch {
      alert('Không thể tải bộ câu hỏi mới lúc này.');
    } finally {
      setLoadingNewQuiz(false);
    }
  };

  const currentQ = questions[currentQIndex];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111E3D] via-[#2A1856] to-[#7157E8] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00C2B8] text-[#111E3D] font-black text-xs">
              MODULE 08
            </span>
            <span className="text-xs text-indigo-200">Học mà chơi – Chơi mà học</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Kho Trò Chơi Văn Học AI Tương Tác
          </h2>
          <p className="text-xs text-indigo-100 max-w-xl mt-1 leading-relaxed">
            8 dạng trò chơi trí tuệ giúp học sinh ôn tập kiến thức, rèn luyện phản xạ đọc hiểu theo 4 cấp độ tư duy. AI có khả năng tạo mới câu hỏi từ ngữ liệu bất kỳ.
          </p>
        </div>

        <button
          onClick={handleGenerateFreshQuestions}
          disabled={loadingNewQuiz}
          className="shrink-0 px-4 py-2.5 rounded-2xl bg-[#FFD166] hover:bg-[#FFE08F] text-[#111E3D] font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loadingNewQuiz ? 'AI đang sinh câu hỏi...' : 'AI sinh bộ câu hỏi mới'}</span>
        </button>
      </div>

      {/* Game Mode Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {gameModes.map((gm) => (
          <button
            key={gm.id}
            onClick={() => {
              setActiveGameId(gm.id);
              setIsPlaying(false);
              setGameOver(false);
            }}
            className={`p-3 rounded-2xl border text-center transition-all ${
              activeGameId === gm.id
                ? 'bg-[#111E3D] text-white border-[#111E3D] shadow-md scale-102'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span className="text-xl block mb-1">{gm.icon}</span>
            <span className="text-[11px] font-bold block truncate leading-tight">
              {gm.name.split('. ')[1]}
            </span>
          </button>
        ))}
      </div>

      {/* Active Game Stage */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 md:p-8 min-h-[460px] flex flex-col justify-between">
        {!isPlaying && !gameOver && (
          <div className="text-center py-10 space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7157E8] to-[#00C2B8] text-white text-3xl flex items-center justify-center mx-auto shadow-xl">
              🏆
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {gameModes.find((g) => g.id === activeGameId)?.name}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {gameModes.find((g) => g.id === activeGameId)?.desc}
            </p>
            <div className="pt-4">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 rounded-2xl bg-[#7157E8] hover:bg-[#583ECE] text-white font-extrabold text-sm shadow-xl shadow-indigo-950/20 flex items-center gap-2 mx-auto transition-transform active:scale-95"
              >
                <span>Bắt đầu thử thách ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* During Game Play */}
        {isPlaying && currentQ && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Score & Timer Ribbon */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#7157E8]">
                  Câu {currentQIndex + 1} / {questions.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  Cấp độ: {currentQ.level}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span>{timer}s</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                  <Trophy className="w-4 h-4" />
                  <span>Điểm: {score}</span>
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <h4 className="text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-[#7157E8]';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-left text-xs md:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 font-bold text-slate-600 flex items-center justify-center shrink-0 text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#00C2B8]" />
                    Giải thích chi tiết từ Mực Nhỏ AI:
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-1.5 rounded-xl bg-[#111E3D] hover:bg-[#1A2C56] text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>{currentQIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed font-sans">{currentQ.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {gameOver && (
          <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FFD166] to-amber-500 text-white text-3xl flex items-center justify-center mx-auto shadow-xl">
              🎉
            </div>
            <h3 className="text-2xl font-black text-slate-900">Hoàn Thành Thử Thách!</h3>
            <p className="text-sm font-bold text-[#7157E8]">
              Tổng điểm của em: <span className="text-2xl text-slate-900">{score}</span> / {questions.length * 10} điểm
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {score >= 30
                ? 'Tuyệt vời! Em có năng lực đọc hiểu và cảm thụ chi tiết văn học rất xuất sắc.'
                : 'Cố gắng lên nhé! Đọc kỹ lại ngữ liệu văn bản sẽ giúp em giải mã dễ dàng hơn.'}
            </p>

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={handleStartGame}
                className="px-5 py-2.5 rounded-2xl bg-[#7157E8] text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại ván này</span>
              </button>
              <button
                onClick={handleGenerateFreshQuestions}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Đổi bộ câu hỏi mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
