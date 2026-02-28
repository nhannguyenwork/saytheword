import React, { useState, useRef } from 'react';
import { MousePointer2, Trash2, History, CheckCircle2, XCircle, Trophy, RefreshCcw, Eye, EyeOff, Play, Layers, Gamepad2 } from 'lucide-react';

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

  // Danh sách 5 đề khác nhau
  const LEVELS = [
    { id: 1, name: "Đề 1", sequence: ["Mèo", "Chó", "Mèo", "Chó", "Chó", "Chó", "Mèo", "Mèo"] },
    { id: 2, name: "Đề 2", sequence: ["Chó", "Chó", "Mèo", "Mèo", "Chó", "Mèo", "Chó", "Mèo"] },
    { id: 3, name: "Đề 3", sequence: ["Mèo", "Mèo", "Mèo", "Chó", "Chó", "Chó", "Mèo", "Chó"] },
    { id: 4, name: "Đề 4", sequence: ["Chó", "Mèo", "Chó", "Mèo", "Mèo", "Chó", "Chó", "Mèo"] },
    { id: 5, name: "Đề 5", sequence: ["Mèo", "Chó", "Chó", "Mèo", "Chó", "Mèo", "Mèo", "Chó"] },
  ];

  // Quản lý trạng thái trò chơi
  const [selectedLevel, setSelectedLevel] = useState<typeof LEVELS[0] | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'RESULT'>('IDLE');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTarget, setShowTarget] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Xử lý khi chọn bộ đề và bắt đầu game
  const handleStartGame = (level: typeof LEVELS[0]) => {
    setSelectedLevel(level);
    setGameStatus('IDLE');
    setHistory([]);
    setIsCorrect(null);
    
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
    
    const newHistory = [...history, type];
    // Giới hạn số lần nhấn bằng đúng độ dài đề bài
    if (newHistory.length <= selectedLevel.sequence.length) {
      setHistory(newHistory);
    }
  };

  // So sánh chuỗi người chơi đã chọn với đáp án
  const checkResult = () => {
    if (!selectedLevel) return;

    if (history.length !== selectedLevel.sequence.length) {
      setIsCorrect(false);
      setGameStatus('RESULT');
      return;
    }

    const match = history.every((val, index) => val === selectedLevel.sequence[index]);
    setIsCorrect(match);
    setGameStatus('RESULT');
  };

  // Làm mới trò chơi về trạng thái ban đầu (về màn hình chọn đề)
  const resetToMenu = () => {
    setSelectedLevel(null);
    setHistory([]);
    setGameStatus('IDLE');
    setIsCorrect(null);
    setShowTarget(false);
  };

  // Làm mới màn chơi hiện tại
  const resetCurrentLevel = () => {
    setHistory([]);
    setGameStatus('IDLE');
    setIsCorrect(null);
    setShowTarget(false);
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
          <div className="absolute top-0 left-0 bg-red-600 text-white px-3 md:px-6 py-0.5 md:py-1 rounded-br-xl md:rounded-br-2xl font-black text-[10px] md:text-xs uppercase tracking-widest">
            {selectedLevel.name} (Ẩn danh)
          </div>
          
          {/* Hiển thị các ô dấu hỏi hoặc đáp án khi giữ chuột */}
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-3 mt-3 md:mt-4">
            {selectedLevel.sequence.map((word, idx) => (
              <div 
                key={idx} 
                className={`w-10 h-12 md:w-14 md:h-16 rounded-lg md:rounded-xl border-2 flex items-center justify-center font-black text-sm md:text-xl transition-all duration-500
                  ${showTarget 
                    ? (word === "Mèo" ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-100 border-slate-300 text-slate-900')
                    : 'bg-slate-50 border-dashed border-slate-200 text-slate-300'
                  }
                `}
              >
                {showTarget ? word : "?"}
              </div>
            ))}
          </div>

          <div className="mt-3 md:mt-6 flex flex-col items-center gap-2 md:gap-4">
            <p className="text-slate-500 font-bold italic text-[10px] md:text-sm text-center">
               Đáp án đã ẩn! Hãy nhấn 8 bước theo trí nhớ của bạn.
            </p>
            {/* Nút giữ để xem đề bài */}
            <button 
              onMouseDown={() => setShowTarget(true)}
              onMouseUp={() => setShowTarget(false)}
              onMouseLeave={() => setShowTarget(false)}
              onTouchStart={() => setShowTarget(true)}
              onTouchEnd={() => setShowTarget(false)}
              className="flex items-center gap-1 md:gap-2 text-red-500 font-black text-[10px] md:text-sm uppercase hover:text-red-700 transition-colors select-none p-1.5 md:p-2 border-2 border-transparent hover:border-red-100 rounded-lg cursor-pointer"
            >
              {showTarget ? <EyeOff size={14} /> : <Eye size={14} />}
              {showTarget ? "Đang hiện đề..." : "Giữ để xem lại đề"}
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
            ${history[history.length-1] === "Mèo" && gameStatus !== 'RESULT' ? 'border-red-500 scale-105 z-10' : 'border-white hover:border-red-100'}
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
            ${history[history.length-1] === "Chó" && gameStatus !== 'RESULT' ? 'border-slate-900 scale-105 z-10' : 'border-white hover:border-slate-200'}
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
             <History className="text-red-600" size={16} /> {history.length}/{selectedLevel.sequence.length}
           </h3>
           <div className="flex gap-3">
              {history.length > 0 && gameStatus !== 'RESULT' && (
                <button onClick={resetCurrentLevel} className="text-slate-400 hover:text-red-500 transition-colors font-bold text-xs md:text-base flex items-center gap-1 cursor-pointer">
                  <Trash2 size={14} /> Xóa
                </button>
              )}
           </div>
        </div>

        <div className="min-h-[60px] md:min-h-[100px] bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-dashed border-slate-200 flex flex-wrap gap-1.5 md:gap-3 items-center content-start">
          {history.map((word, idx) => (
            <span key={idx} className={`px-3 py-1 md:px-5 md:py-2 rounded-lg md:rounded-2xl font-black text-xs md:text-xl shadow-md
              ${word === "Mèo" ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}
            `}>
              {word}
            </span>
          ))}
          {history.length === 0 && (
            <div className="w-full text-center py-2 text-slate-400 italic text-[10px] md:text-sm">
               Bắt đầu chọn...
            </div>
          )}
        </div>

        {/* Nút kiểm tra kết quả */}
        {gameStatus === 'PLAYING' && history.length === selectedLevel.sequence.length && (
          <div className="mt-4 md:mt-8 flex justify-center">
            <button 
              onClick={checkResult}
              className="px-8 py-3 md:px-12 md:py-4 bg-emerald-500 text-white font-black text-lg md:text-2xl rounded-xl md:rounded-2xl shadow-[0_4px_0_0_rgba(16,185,129,1)] md:shadow-[0_8px_0_0_rgba(16,185,129,1)] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 md:gap-3 animate-bounce cursor-pointer"
            >
              <CheckCircle2 size={20} /> KIỂM TRA
            </button>
          </div>
        )}

        {/* Hiển thị thông báo Thắng/Thua */}
        {gameStatus === 'RESULT' && (
          <div className={`mt-4 md:mt-8 p-4 md:p-8 rounded-xl md:rounded-[2rem] border-2 md:border-4 flex flex-col items-center
            ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700'}
          `}>
            {isCorrect ? (
              <>
                <Trophy size={40} className="mb-2 md:mb-4 text-yellow-500 animate-bounce" />
                <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-2 uppercase italic">Tuyệt vời!</h2>
                <p className="font-bold text-sm md:text-xl mb-4 md:mb-8 text-center">Trí nhớ xuất sắc.</p>
              </>
            ) : (
              <>
                <XCircle size={40} className="mb-2 md:mb-4 text-red-500" />
                <h2 className="text-2xl md:text-5xl font-black mb-1 md:mb-2 uppercase italic text-center">Sai rồi!</h2>
                <p className="font-bold text-sm md:text-xl mb-4 md:mb-8 text-center">Thử lại nhé.</p>
              </>
            )}
            <div className="flex gap-2 md:gap-4">
              <button 
                onClick={resetCurrentLevel}
                className="px-4 py-2 md:px-8 md:py-4 bg-slate-900 text-white font-black text-sm md:text-xl rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <RefreshCcw size={16} /> THỬ LẠI
              </button>
              <button 
                onClick={resetToMenu}
                className="px-8 py-4 bg-red-600 text-white font-black text-sm md:text-xl rounded-xl md:rounded-2xl flex items-center gap-1 md:gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <Layers size={16} /> ĐỔI ĐỀ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hiệu ứng trang trí nền */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
