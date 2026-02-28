import React, { useState } from 'react';
import { MousePointer2, Trash2, History, CheckCircle2, XCircle, Trophy, RefreshCcw, Eye, EyeOff } from 'lucide-react';

/**
 * Thành phần chính của trò chơi Thử thách Ghi nhớ Mèo Chó.
 * Người chơi phải nhớ một chuỗi ẩn và chọn đúng các ảnh tương ứng.
 */
export default function App() {
  // Đường dẫn ảnh mẫu cho Mèo và Chó
  const CAT_IMAGE = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop";
  const DOG_IMAGE = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600&auto=format&fit=crop";

  // Đáp án mục tiêu cố định cho Đề 1
  const TARGET_SEQUENCE = ["Mèo", "Chó", "Mèo", "Chó", "Chó", "Chó", "Mèo", "Mèo"];

  // Quản lý trạng thái trò chơi
  const [history, setHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'IDLE' | 'PLAYING' | 'RESULT'>('IDLE');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTarget, setShowTarget] = useState(false);

  // Xử lý khi người chơi nhấn vào ảnh con vật
  const handleInteraction = (type: string) => {
    if (gameStatus === 'RESULT') return;
    
    if (gameStatus === 'IDLE') setGameStatus('PLAYING');
    
    const newHistory = [...history, type];
    // Giới hạn số lần nhấn bằng đúng độ dài đề bài
    if (newHistory.length <= TARGET_SEQUENCE.length) {
      setHistory(newHistory);
    }
  };

  // So sánh chuỗi người chơi đã chọn với đáp án
  const checkResult = () => {
    if (history.length !== TARGET_SEQUENCE.length) {
      setIsCorrect(false);
      setGameStatus('RESULT');
      return;
    }

    const match = history.every((val, index) => val === TARGET_SEQUENCE[index]);
    setIsCorrect(match);
    setGameStatus('RESULT');
  };

  // Làm mới trò chơi về trạng thái ban đầu
  const resetGame = () => {
    setHistory([]);
    setGameStatus('IDLE');
    setIsCorrect(null);
    setShowTarget(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 text-slate-900 font-sans flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      
      {/* Phần tiêu đề và Khu vực đề bài ẩn */}
      <div className="w-full max-w-4xl mt-4 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-indigo-600 mb-6">
          Thử Thách Ghi Nhớ
        </h1>
        
        <div className="bg-white border-4 border-indigo-100 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 bg-indigo-600 text-white px-6 py-1 rounded-br-2xl font-black text-xs uppercase tracking-widest">
            Đề 1 (Ẩn danh)
          </div>
          
          {/* Hiển thị các ô dấu hỏi hoặc đáp án khi giữ chuột */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {TARGET_SEQUENCE.map((word, idx) => (
              <div 
                key={idx} 
                className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center font-black text-xl transition-all duration-500
                  ${showTarget 
                    ? (word === "Mèo" ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-pink-50 border-pink-200 text-pink-600')
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
              className="flex items-center gap-2 text-indigo-500 font-black text-sm uppercase hover:text-indigo-700 transition-colors select-none p-2 border-2 border-transparent hover:border-indigo-100 rounded-lg cursor-pointer"
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
            ${history[history.length-1] === "Mèo" && gameStatus !== 'RESULT' ? 'border-indigo-500 scale-105' : 'border-white hover:border-indigo-100'}
          `}
        >
          <img src={CAT_IMAGE} alt="Mèo" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-indigo-600 font-black text-2xl px-8 py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Mèo</span>
          </div>
        </button>

        <button 
          onClick={() => handleInteraction("Chó")}
          disabled={gameStatus === 'RESULT'}
          className={`group relative overflow-hidden rounded-[3rem] border-[10px] transition-all duration-300 transform active:scale-95 shadow-2xl disabled:opacity-50 cursor-pointer
            ${history[history.length-1] === "Chó" && gameStatus !== 'RESULT' ? 'border-pink-500 scale-105' : 'border-white hover:border-pink-100'}
          `}
        >
          <img src={DOG_IMAGE} alt="Chó" className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-white text-pink-600 font-black text-2xl px-8 py-2 rounded-full shadow-lg inline-block uppercase tracking-widest">Chó</span>
          </div>
        </button>
      </div>

      {/* Lịch sử lựa chọn của người chơi */}
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] p-8 shadow-2xl border-4 border-slate-100 mb-8 relative">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
             <History className="text-indigo-600" /> Chuỗi của bạn ({history.length}/{TARGET_SEQUENCE.length})
           </h3>
           <div className="flex gap-3">
              {history.length > 0 && gameStatus !== 'RESULT' && (
                <button onClick={resetGame} className="text-slate-400 hover:text-red-500 transition-colors font-bold flex items-center gap-1 cursor-pointer">
                  <Trash2 size={18} /> Làm lại
                </button>
              )}
           </div>
        </div>

        <div className="min-h-[100px] bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 flex flex-wrap gap-3 items-center content-start">
          {history.map((word, idx) => (
            <span key={idx} className={`px-5 py-2 rounded-2xl font-black text-xl shadow-md
              ${word === "Mèo" ? 'bg-indigo-600 text-white' : 'bg-pink-600 text-white'}
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
        {gameStatus === 'PLAYING' && history.length === TARGET_SEQUENCE.length && (
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
            <button 
              onClick={resetGame}
              className="px-12 py-4 bg-slate-900 text-white font-black text-2xl rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl cursor-pointer"
            >
              <RefreshCcw size={24} /> THỬ LẠI
            </button>
          </div>
        )}
      </div>

      {/* Hiệu ứng trang trí nền */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-[100px] -z-10"></div>
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-[100px] -z-10"></div>
    </div>
  );
}
