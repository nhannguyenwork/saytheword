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
      <div className="fixed inset-0 bg-slate-50 text-slate-900 font-sans flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-2xl text-center">
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-red-200 animate-bounce">
              <Gamepad2 size={48} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-red-600 animate-in fade-in slide-in-from-top-4 duration-700">
              Say A Word game
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-lg mb-12 uppercase tracking-widest">Chọn bộ đề để bắt đầu</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => handleStartGame(level)}
                className="group relative bg-white border-4 border-slate-100 p-6 rounded-[2rem] shadow-lg hover:border-red-500 hover:scale-105 transition-all duration-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Layers size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block font-black text-xl text-slate-800 uppercase italic">{level.name}</span>
                    <span className="text-slate-400 text-sm font-bold uppercase">8 Bước ghi nhớ</span>
                  </div>
                </div>
                <Play className="text-slate-200 group-hover:text-red-500 transition-colors" size={24} />
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
    <div className="fixed inset-0 bg-slate-50 text-slate-900 font-sans flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      
      {/* Phần tiêu đề và Khu vực đề bài ẩn */}
      <div className="w-full max-w-4xl mt-4 mb-8 text-center">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={resetToMenu}
            className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl font-black text-slate-400 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw size={18} /> Đổi đề
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Gamepad2 size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-red-600">
              Say A Word game
            </h1>
          </div>
          <div className="w-[100px]"></div> {/* Spacer */}
        </div>
        
        <div className="bg-white border-4 border-red-100 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 bg-red-600 text-white px-6 py-1 rounded-br-2xl font-black text-xs uppercase tracking-widest">
            {selectedLevel.name} (Ẩn danh)
          </div>
          
          {/* Hiển thị các ô dấu hỏi hoặc đáp án khi giữ chuột */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {selectedLevel.sequence.map((word, idx) => (
              <div 
                key={idx} 
                className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-black text-xl transition-all duration-500
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

          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-slate-500 font-bold italic text-center">
               Đáp án đã ẩn! Hãy nhấn 8 bước theo trí nhớ của bạn.
            </p>
            {/* Nút giữ để xem đề bài */}
            <button 
              onMouseDown={() => setShowTarget(true)}
              onMouseUp={() => setShowTarget(false)}
              onMouseLeave={() => setShowTarget(false)}
              onTouchStart={() => setShowTarget(true)}
              onTouchEnd={() => setShowTarget(false)}
              className="flex items-center gap-2 text-red-500 font-black text-sm uppercase hover:text-red-700 transition-colors select-none p-2 border-2 border-transparent hover:border-red-100 rounded-lg cursor-pointer"
            >
              {showTarget ? <EyeOff size={18} /> : <Eye size={18} />}
              {showTarget ? "Đang hiện đề..." : "Giữ để xem lại đề"}
            </button>
          </div>
        </div>
      </div>

      {/* Khu vực lựa chọn Mèo/Chó */}
      <div className="w-full max-w-5xl grid grid-cols-2 gap-6 md:gap-10 aspect-[16/9] md:aspect-[21/9] mb-10">
        <button 
          onClick={() => handleInteraction("Mèo")}
          disabled={gameStatus === 'RESULT'}
          className={`group relative overflow-hidden rounded-[3rem] border-[10px] transition-all duration-300 transform active:scale-95 shadow-2xl disabled:opacity-50 cursor-pointer
            ${history[history.length-1] === "Mèo" && gameStatus !== 'RESULT' ? 'border-red-500 scale-105' : 'border-white hover:border-red-100'}
          `}
        >
          <img src={CAT_IMAGE} alt="Mèo" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-red-600 font-black text-2xl px-8 py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Mèo</span>
          </div>
        </button>

        <button 
          onClick={() => handleInteraction("Chó")}
          disabled={gameStatus === 'RESULT'}
          className={`group relative overflow-hidden rounded-[3rem] border-[10px] transition-all duration-300 transform active:scale-95 shadow-2xl disabled:opacity-50 cursor-pointer
            ${history[history.length-1] === "Chó" && gameStatus !== 'RESULT' ? 'border-slate-900 scale-105' : 'border-white hover:border-slate-200'}
          `}
        >
          <img src={DOG_IMAGE} alt="Chó" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-slate-900 font-black text-2xl px-8 py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Chó</span>
          </div>
        </button>
      </div>

      {/* Lịch sử lựa chọn của người chơi */}
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-slate-100 mb-8 relative">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
             <History className="text-red-600" /> Chuỗi của bạn ({history.length}/{selectedLevel.sequence.length})
           </h3>
           <div className="flex gap-3">
              {history.length > 0 && gameStatus !== 'RESULT' && (
                <button onClick={resetCurrentLevel} className="text-slate-400 hover:text-red-500 transition-colors font-bold flex items-center gap-1 cursor-pointer">
                  <Trash2 size={18} /> Làm lại
                </button>
              )}
           </div>
        </div>

        <div className="min-h-[100px] bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 flex flex-wrap gap-3 items-center content-start">
          {history.map((word, idx) => (
            <span key={idx} className={`px-5 py-2 rounded-2xl font-black text-xl shadow-md
              ${word === "Mèo" ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}
            `}>
              {word}
            </span>
          ))}
          {history.length === 0 && (
            <div className="w-full text-center py-4 text-slate-400 italic">
               Nhấn vào ảnh để nhập chuỗi...
            </div>
          )}
        </div>

        {/* Nút kiểm tra kết quả */}
        {gameStatus === 'PLAYING' && history.length === selectedLevel.sequence.length && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={checkResult}
              className="px-12 py-4 bg-emerald-500 text-white font-black text-2xl rounded-2xl shadow-[0_8px_0_0_rgba(16,185,129,1)] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-3 animate-bounce cursor-pointer"
            >
              <CheckCircle2 size={28} /> KIỂM TRA ĐÁP ÁN
            </button>
          </div>
        )}

        {/* Hiển thị thông báo Thắng/Thua */}
        {gameStatus === 'RESULT' && (
          <div className={`mt-8 p-8 rounded-[2rem] border-4 flex flex-col items-center
            ${isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700'}
          `}>
            {isCorrect ? (
              <>
                <Trophy size={80} className="mb-4 text-yellow-500 animate-bounce" />
                <h2 className="text-5xl font-black mb-2 uppercase italic">Tuyệt vời!</h2>
                <p className="font-bold text-xl mb-8 text-center">Bạn có trí nhớ thật xuất sắc.</p>
              </>
            ) : (
              <>
                <XCircle size={80} className="mb-4 text-red-500" />
                <h2 className="text-5xl font-black mb-2 uppercase italic text-center">Chưa chính xác!</h2>
                <p className="font-bold text-xl mb-8 text-center">Đừng nản lòng, hãy nhấn giữ "Xem đề" để nhớ lại nhé.</p>
              </>
            )}
            <div className="flex gap-4">
              <button 
                onClick={resetCurrentLevel}
                className="px-8 py-4 bg-slate-900 text-white font-black text-xl rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <RefreshCcw size={20} /> THỬ LẠI
              </button>
              <button 
                onClick={resetToMenu}
                className="px-8 py-4 bg-red-600 text-white font-black text-xl rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
              >
                <Layers size={20} /> ĐỔI ĐỀ
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
