import React, { useState, useRef } from 'react';
import { MousePointer2, Trash2, History, CheckCircle2, XCircle, Trophy, RefreshCcw, Eye, EyeOff, Play, Layers, Gamepad2, ArrowRight, ArrowLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Thành phần chính của trò chơi Say A Word game.
 * Người chơi phải nhớ một chuỗi ẩn và chọn đúng các ảnh tương ứng.
 */
export default function App() {
  // Đường dẫn ảnh mẫu cho Mèo và Chó
  const CAT_IMAGE = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop";
  const DOG_IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop";
  
  // Âm thanh bắt đầu
  const START_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3";

  // Danh sách 5 đề khác nhau, mỗi đề có 5 round
  const LEVELS = [
    { 
      id: 1, 
      name: "Bộ đề 1", 
      rounds: [
        ["Mèo", "Chó", "Mèo", "Chó", "Chó", "Chó", "Mèo", "Mèo"],
        ["Chó", "Mèo", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó"],
        ["Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó"],
        ["Chó", "Chó", "Chó", "Mèo", "Mèo", "Mèo", "Chó", "Mèo"],
        ["Mèo", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo", "Chó"]
      ] 
    },
    { 
      id: 2, 
      name: "Bộ đề 2", 
      rounds: [
        ["Chó", "Chó", "Mèo", "Mèo", "Chó", "Mèo", "Chó", "Mèo"],
        ["Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó"],
        ["Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo"],
        ["Mèo", "Mèo", "Mèo", "Mèo", "Chó", "Chó", "Chó", "Chó"],
        ["Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo"]
      ] 
    },
    { 
      id: 3, 
      name: "Bộ đề 3", 
      rounds: [
        ["Mèo", "Mèo", "Mèo", "Chó", "Chó", "Chó", "Mèo", "Chó"],
        ["Chó", "Mèo", "Mèo", "Mèo", "Chó", "Chó", "Chó", "Mèo"],
        ["Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó"],
        ["Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo"],
        ["Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó"]
      ] 
    },
    { 
      id: 4, 
      name: "Bộ đề 4", 
      rounds: [
        ["Chó", "Mèo", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo"],
        ["Mèo", "Chó", "Mèo", "Chó", "Chó", "Mèo", "Mèo", "Chó"],
        ["Chó", "Chó", "Chó", "Chó", "Mèo", "Mèo", "Mèo", "Mèo"],
        ["Mèo", "Mèo", "Mèo", "Mèo", "Chó", "Chó", "Chó", "Chó"],
        ["Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo"]
      ] 
    },
    { 
      id: 5, 
      name: "Bộ đề 5", 
      rounds: [
        ["Mèo", "Chó", "Chó", "Mèo", "Chó", "Mèo", "Mèo", "Chó"],
        ["Chó", "Mèo", "Mèo", "Chó", "Mèo", "Chó", "Chó", "Mèo"],
        ["Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó"],
        ["Chó", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo", "Mèo"],
        ["Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó", "Mèo", "Chó"]
      ] 
    },
  ];

  // Quản lý trạng thái trò chơi
  const [selectedLevel, setSelectedLevel] = useState<typeof LEVELS[0] | null>(null);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState<string[][]>([[], [], [], [], []]);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'RESULT'>('IDLE');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Xử lý khi chọn bộ đề và bắt đầu game
  const handleStartGame = (level: typeof LEVELS[0]) => {
    setSelectedLevel(level);
    setGameStatus('IDLE');
    setCurrentRoundIndex(0);
    setRoundsHistory([[], [], [], [], []]);
    setScore(0);
    setMaxScore(0);
    setDirection(0);
    
    // Phát âm thanh bắt đầu
    if (!audioRef.current) {
      audioRef.current = new Audio(START_SOUND_URL);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => console.log("Audio play failed:", err));
  };

  // Xử lý khi người chơi nhấn vào ảnh con vật
  const handleInteraction = (type: string) => {
    if (!selectedLevel || gameStatus === 'RESULT') return;
    
    if (gameStatus === 'IDLE') setGameStatus('PLAYING');
    
    const currentRoundSequence = selectedLevel.rounds[currentRoundIndex];
    const currentRoundHistory = roundsHistory[currentRoundIndex];
    
    if (currentRoundHistory.length < currentRoundSequence.length) {
      const newRoundsHistory = [...roundsHistory];
      newRoundsHistory[currentRoundIndex] = [...currentRoundHistory, type];
      setRoundsHistory(newRoundsHistory);
    }
  };

  // Chuyển sang round tiếp theo
  const nextRound = () => {
    if (!selectedLevel || currentRoundIndex >= 4) return;
    setDirection(1);
    setCurrentRoundIndex(prev => prev + 1);
  };

  // Quay lại round trước
  const prevRound = () => {
    if (!selectedLevel || currentRoundIndex <= 0) return;
    setDirection(-1);
    setCurrentRoundIndex(prev => prev - 1);
  };

  // So sánh chuỗi người chơi đã chọn với đáp án và tính điểm
  const checkResult = () => {
    if (!selectedLevel) return;

    let totalPoints = 0;
    let totalPossible = 0;

    for (let i = 0; i < selectedLevel.rounds.length; i++) {
      const target = selectedLevel.rounds[i];
      const player = roundsHistory[i];
      totalPossible += target.length;
      
      for (let j = 0; j < target.length; j++) {
        if (player[j] === target[j]) {
          totalPoints += 1;
        }
      }
    }

    setScore(totalPoints);
    setMaxScore(totalPossible);
    setGameStatus('RESULT');
  };

  // Làm mới trò chơi về trạng thái ban đầu (về màn hình chọn đề)
  const resetToMenu = () => {
    setSelectedLevel(null);
    setRoundsHistory([[], [], [], [], []]);
    setCurrentRoundIndex(0);
    setGameStatus('IDLE');
    setScore(0);
    setDirection(0);
  };

  // Làm mới màn chơi hiện tại
  const resetCurrentLevel = () => {
    setRoundsHistory([[], [], [], [], []]);
    setCurrentRoundIndex(0);
    setGameStatus('IDLE');
    setScore(0);
    setDirection(0);
  };

  // Màn hình chọn bộ đề
  if (!selectedLevel) {
    return (
      <div className="fixed inset-0 bg-slate-50 text-slate-900 font-sans flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-2xl text-center">
          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-red-600 rounded-2xl md:rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-200 animate-bounce">
              <Gamepad2 size={24} md:size={48} />
            </div>
            <h1 className="text-3xl md:text-7xl font-black italic uppercase tracking-tighter text-red-600 animate-in fade-in slide-in-from-top-4 duration-700">
              Say A Word game
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-xs md:text-lg mb-6 md:mb-12 uppercase tracking-widest">Chọn bộ đề để bắt đầu</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 px-2">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => handleStartGame(level)}
                className="group relative bg-white border-2 md:border-4 border-slate-100 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-lg hover:border-red-500 hover:scale-105 transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl md:rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Layers size={20} md:size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-base md:text-xl text-slate-800 uppercase italic">{level.name}</span>
                    <span className="text-slate-400 text-[10px] md:text-sm font-bold uppercase">8 Bước ghi nhớ</span>
                  </div>
                </div>
                <Play className="text-slate-200 group-hover:text-red-500 transition-colors" size={20} md:size={24} />
              </button>
            ))}
          </div>
        </div>

        {/* Hiệu ứng trang trí nền */}
        <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
        <div className="fixed -top-20 -right-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
      </div>
    );
  }

  const currentRoundSequence = selectedLevel.rounds[currentRoundIndex];
  const currentRoundHistory = roundsHistory[currentRoundIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : direction < 0 ? -200 : 0,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 200 : direction > 0 ? -200 : 0,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-slate-50 text-slate-900 font-sans flex flex-col items-center p-2 md:p-8 overflow-y-auto overflow-x-hidden">
      
      {/* Phần tiêu đề và Khu vực đề bài ẩn */}
      <div className="w-full max-w-4xl mt-2 md:mt-4 mb-4 md:mb-8 text-center">
        <div className="flex items-center justify-between mb-3 md:mb-6 px-2">
          <button 
            onClick={resetToMenu}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-white border-2 border-slate-100 rounded-xl font-black text-xs md:text-base text-slate-400 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-1 md:gap-2 cursor-pointer"
          >
            <RefreshCcw size={16} /> <span className="hidden xs:inline">Đổi đề</span>
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Gamepad2 size={18} />
            </div>
            <h1 className="text-xl md:text-5xl font-black italic uppercase tracking-tighter text-red-600">
              Say A Word game
            </h1>
          </div>
          <div className="w-16 md:w-[100px]"></div> {/* Spacer */}
        </div>
        
        <div className="bg-white border-2 md:border-4 border-red-100 rounded-2xl md:rounded-[2rem] p-3 md:p-6 shadow-xl relative overflow-hidden mx-2">
          <div className="absolute top-0 left-0 bg-red-600 text-white px-3 md:px-6 py-0.5 md:py-1 rounded-br-xl md:rounded-br-2xl font-black text-[10px] md:text-xs uppercase tracking-widest z-20">
            {selectedLevel.name} - Round {currentRoundIndex + 1}/5
          </div>

          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div 
              key={currentRoundIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 800, damping: 60, mass: 0.5 },
                opacity: { duration: 0.1 }
              }}
              className="w-full"
            >
              {/* Hiển thị các ô ký tự sau khi nhập */}
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mt-3 md:mt-4">
                {currentRoundSequence.map((_, idx) => {
                  const word = currentRoundHistory[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`w-10 h-12 md:w-14 md:h-16 rounded-lg md:rounded-xl border-2 flex items-center justify-center font-black text-sm md:text-xl transition-all duration-200
                        ${word 
                          ? (word === "Mèo" ? 'bg-red-600 border-red-700 text-white shadow-md' : 'bg-slate-900 border-slate-950 text-white shadow-md')
                          : 'bg-slate-50 border-dashed border-slate-200 text-slate-300'
                        }
                      `}
                    >
                      {word || idx + 1}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-3 md:mt-6 flex items-center justify-center gap-4 md:gap-8 relative z-10">
            <button 
              onClick={prevRound}
              disabled={currentRoundIndex === 0}
              className="p-2 md:p-3 bg-slate-100 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 transition-all cursor-pointer"
            >
              <ArrowLeft size={20} md:size={24} />
            </button>
            
            <div className="flex flex-col items-center">
              <p className="text-slate-500 font-bold italic text-[10px] md:text-sm text-center">
                 Nhập chuỗi ký tự theo trí nhớ
              </p>
              <div className="mt-1 flex gap-1">
                {roundsHistory.map((h, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === currentRoundIndex ? 'bg-red-600' : h.length > 0 ? 'bg-red-200' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <button 
              onClick={nextRound}
              disabled={currentRoundIndex === 4}
              className="p-2 md:p-3 bg-slate-100 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-400 transition-all cursor-pointer"
            >
              <ArrowRight size={20} md:size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Khu vực lựa chọn Mèo/Chó */}
      <div className="w-full max-w-5xl grid grid-cols-2 gap-3 md:gap-10 px-2 mb-4 md:mb-10 landscape:max-h-[40vh]">
        <button 
          onClick={() => handleInteraction("Mèo")}
          disabled={gameStatus === 'RESULT'}
          className={`group relative overflow-hidden rounded-2xl md:rounded-[3rem] border-4 md:border-[10px] transition-all duration-100 transform active:scale-95 shadow-xl disabled:opacity-50 cursor-pointer h-full min-h-[120px] md:min-h-[200px]
            ${currentRoundHistory[currentRoundHistory.length-1] === "Mèo" && gameStatus !== 'RESULT' ? 'border-red-500 scale-105 z-10' : 'border-white hover:border-red-100'}
          `}
        >
          <img src={CAT_IMAGE} alt="Mèo" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent" />
          <div className="absolute bottom-2 md:bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-red-600 font-black text-sm md:text-2xl px-4 md:px-8 py-1 md:py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Mèo</span>
          </div>
        </button>

        <button 
          onClick={() => handleInteraction("Chó")}
          disabled={gameStatus === 'RESULT'}
          className={`group relative overflow-hidden rounded-2xl md:rounded-[3rem] border-4 md:border-[10px] transition-all duration-100 transform active:scale-95 shadow-xl disabled:opacity-50 cursor-pointer h-full min-h-[120px] md:min-h-[200px]
            ${currentRoundHistory[currentRoundHistory.length-1] === "Chó" && gameStatus !== 'RESULT' ? 'border-slate-900 scale-105 z-10' : 'border-white hover:border-slate-200'}
          `}
        >
          <img src={DOG_IMAGE} alt="Chó" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <div className="absolute bottom-2 md:bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-slate-900 font-black text-sm md:text-2xl px-4 md:px-8 py-1 md:py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Chó</span>
          </div>
        </button>
      </div>

      {/* Lịch sử lựa chọn của người chơi */}
      <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl border-2 md:border-4 border-slate-100 mb-4 md:mb-8 relative mx-2">
        <div className="flex justify-between items-center mb-3 md:mb-6">
           <h3 className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-1 md:gap-2 text-xs md:text-base">
             <History className="text-red-600" size={16} /> Round {currentRoundIndex + 1}: {currentRoundHistory.length}/{currentRoundSequence.length}
           </h3>
           <div className="flex gap-3">
              {currentRoundHistory.length > 0 && gameStatus !== 'RESULT' && (
                <button 
                  onClick={() => {
                    const newRoundsHistory = [...roundsHistory];
                    newRoundsHistory[currentRoundIndex] = [];
                    setRoundsHistory(newRoundsHistory);
                  }} 
                  className="text-slate-400 hover:text-red-500 transition-colors font-bold text-xs md:text-base flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={14} /> Xóa Round
                </button>
              )}
           </div>
        </div>

        {/* Nút kiểm tra kết quả */}
        {gameStatus !== 'RESULT' && (
          <div className="mt-4 md:mt-8 flex justify-center">
            <button 
              onClick={checkResult}
              className="px-8 py-3 md:px-12 md:py-4 bg-emerald-500 text-white font-black text-lg md:text-2xl rounded-xl md:rounded-2xl shadow-[0_4px_0_0_rgba(16,185,129,1)] md:shadow-[0_8px_0_0_rgba(16,185,129,1)] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 md:gap-3 cursor-pointer"
            >
              <CheckCircle2 size={20} /> KIỂM TRA TẤT CẢ
            </button>
          </div>
        )}

        {/* Hiển thị thông báo Thắng/Thua */}
        {gameStatus === 'RESULT' && (
          <div className={`mt-4 md:mt-8 p-4 md:p-8 rounded-xl md:rounded-[2rem] border-2 md:border-4 flex flex-col items-center
            ${score === maxScore ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-500 text-slate-700'}
          `}>
            <div className="flex flex-col items-center mb-4 md:mb-8">
              <div className="relative">
                <Trophy size={60} md:size={100} className={`${score === maxScore ? 'text-yellow-500 animate-bounce' : 'text-slate-300'}`} />
                <div className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xs md:text-xl border-2 border-white shadow-lg">
                  <Star size={14} md:size={20} fill="currentColor" />
                </div>
              </div>
              <h2 className="text-3xl md:text-6xl font-black mt-4 uppercase italic">KẾT QUẢ</h2>
              <div className="flex items-baseline gap-1 md:gap-2 mt-2">
                <span className="text-4xl md:text-7xl font-black text-red-600">{score}</span>
                <span className="text-xl md:text-3xl font-bold text-slate-400">/ {maxScore} điểm</span>
              </div>
            </div>

            <p className="font-bold text-sm md:text-xl mb-6 md:mb-10 text-center max-w-md">
              {score === maxScore ? "Tuyệt vời! Bạn đã nhớ chính xác toàn bộ 40 ký tự." : `Bạn đã đúng ${score} ký tự. Hãy cố gắng hơn ở lần sau nhé!`}
            </p>

            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={resetCurrentLevel}
                className="px-4 py-2 md:px-8 md:py-4 bg-slate-900 text-white font-black text-sm md:text-xl rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <RefreshCcw size={16} /> THỬ LẠI
              </button>
              <button 
                onClick={resetToMenu}
                className="px-4 py-2 md:px-8 md:py-4 bg-red-600 text-white font-black text-sm md:text-xl rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <Layers size={16} /> ĐỔI ĐỀ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hiệu ứng trang trí nền */}

      {/* Hiệu ứng trang trí nền */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
