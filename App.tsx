
import React, { useState, useEffect, useMemo } from 'react';
import { AppMode, Chapter, ExamSession, UserResponse, Difficulty } from './types';
import { CHAPTERS, QUIZ_CONFIGS, SCORING } from './constants';
import { generateQuestions } from './services/geminiService';

const Navbar = ({ onToggleFullscreen, onShowQRCode, isQuizActive }: { 
  onToggleFullscreen: () => void, 
  onShowQRCode: () => void,
  isQuizActive: boolean 
}) => {
  const handleReload = () => {
    if (isQuizActive) {
      if (window.confirm("পরীক্ষা চলাকালীন রিলোড করলে প্রগ্রেস হারিয়ে যাবে। আপনি কি নিশ্চিত?")) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-4 px-6 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <i className="fas fa-leaf text-white"></i>
          </div>
          <span className="tracking-tight">HSC Biology 2027 Bank</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="hidden lg:inline-block text-emerald-100 text-sm font-medium">Abul Hasan Edition</span>
          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={onShowQRCode}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/20"
              title="Share QR Code"
            >
              <i className="fas fa-qrcode"></i>
            </button>
            <button 
              onClick={onToggleFullscreen} 
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/20"
              title="Fullscreen Mode"
            >
              <i className="fas fa-expand"></i>
            </button>
            <button 
              onClick={handleReload} 
              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors border border-white/20 text-white"
              title="Reload App"
            >
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const LoadingOverlay = ({ message }: { message: string }) => (
  <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-6 text-center">
    <div className="relative mb-8">
      <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <i className="fas fa-microscope absolute inset-0 flex items-center justify-center text-emerald-600 text-2xl"></i>
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">প্রশ্নপত্র তৈরি হচ্ছে...</h3>
    <p className="text-gray-600 animate-pulse">{message}</p>
    <div className="mt-8 max-w-sm text-xs text-gray-400">
      আমরা আবুল হাসান স্যারের বই থেকে সেরা প্রশ্নগুলো সংগ্রহ করছি আপনার পরীক্ষার জন্য।
    </div>
  </div>
);

const QRCodeModal = ({ onClose }: { onClose: () => void }) => {
  const currentUrl = window.location.origin;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}&margin=10&bgcolor=ffffff&color=059669`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl animate-scaleUp text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="mt-4 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            <i className="fas fa-qrcode"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">QR কোড স্ক্যান করুন</h3>
          <p className="text-slate-500 font-medium">মোবাইল দিয়ে স্ক্যান করে সরাসরি অ্যাপটি ওপেন ও ডাউনলোড করুন।</p>
        </div>

        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border-2 border-emerald-50 inline-block">
          <img 
            src={qrUrl} 
            alt="Download App QR Code" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain shadow-sm"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">শেয়ার করার জন্য নিচের লিংকে ক্লিক করুন</p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(currentUrl);
              alert("লিংক কপি করা হয়েছে!");
            }}
            className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-100 transition-all border border-emerald-100 truncate"
          >
            {currentUrl} <i className="fas fa-copy ml-2"></i>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};

const InstallGuideModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
    <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl animate-scaleUp">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
          <i className="fas fa-download"></i>
        </div>
        <h3 className="text-2xl font-black text-slate-800">অ্যাপটি ডাউনলোড করুন</h3>
        <p className="text-slate-600 font-medium">সরাসরি ফোনে বা পিসিতে অ্যাপ হিসেবে ব্যবহার করতে নিচের ধাপটি অনুসরণ করুন:</p>
      </div>
      
      <div className="mt-8 bg-slate-50 p-6 rounded-2xl space-y-4 border border-slate-100">
        <div className="flex gap-4 items-start">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-1">১</div>
          <p className="text-slate-700 text-sm leading-relaxed">আপনার ব্রাউজারের (Chrome/Edge) মেনু বাটনে (<i className="fas fa-ellipsis-v mx-1"></i>) ক্লিক করুন।</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-1">২</div>
          <p className="text-slate-700 text-sm leading-relaxed"><b>"Install App"</b> বা <b>"Add to Home Screen"</b> অপশনে ক্লিক করুন।</p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg"
      >
        বুঝেছি
      </button>
    </div>
  </div>
);

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [mcqCount, setMcqCount] = useState<number>(20);
  const [isHardMode, setIsHardMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [currentMCQIndex, setCurrentMCQIndex] = useState<number>(0);
  const [loadingMsg, setLoadingMsg] = useState("অধ্যায় বিশ্লেষণ করা হচ্ছে...");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  useEffect(() => {
    if (isLoading) {
      const messages = ["অধ্যায় স্ক্যানিং...", "বইয়ের পাতা বিশ্লেষণ...", "প্রশ্ন বাছাই করা হচ্ছে...", "বোর্ড স্ট্যান্ডার্ড যাচাই...", "ফাইনাল প্রিপারেশন..."];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMsg(messages[i % messages.length]);
        i++;
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    let timer: any;
    if (mode === AppMode.QUIZ && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && mode === AppMode.QUIZ) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft]);

  const handleStartExam = async (chapterToUse?: Chapter, countToUse?: number, hardModeToUse?: boolean) => {
    const chapter = chapterToUse || selectedChapter;
    const count = countToUse || mcqCount;
    const isHard = hardModeToUse !== undefined ? hardModeToUse : isHardMode;

    if (!chapter) return;
    setIsLoading(true);
    try {
      const data = await generateQuestions(chapter, count, isHard);
      const config = QUIZ_CONFIGS.find(c => c.count === count) || QUIZ_CONFIGS[0];
      
      setSession({
        chapter,
        mcqs: data.mcqs,
        cqs: data.cqs,
        startTime: Date.now(),
        responses: data.mcqs.map(m => ({ mcqId: m.id, selectedOption: null, isCorrect: false })),
        isHardMode: isHard,
        timeLimit: config.time
      });
      setTimeLeft(config.time * 60);
      setMode(AppMode.QUIZ);
      setCurrentMCQIndex(0);
      window.scrollTo(0, 0);
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : "ইন্টারনেট কানেকশন চেক করুন।"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (session) {
      handleStartExam(session.chapter, session.mcqs.length, session.isHardMode);
    }
  };

  const results = useMemo(() => {
    if (!session) return { score: 0, total: 0, gpa: 0, grade: 'F', percentage: 0 };
    let score = 0;
    let totalPossible = 0;
    session.mcqs.forEach((mcq, idx) => {
      const diffKey = mcq.difficulty.trim().charAt(0).toUpperCase() + mcq.difficulty.trim().slice(1).toLowerCase();
      const weight = Number(SCORING[diffKey as keyof typeof SCORING] || 1.0);
      totalPossible += weight;
      if (session.responses[idx].isCorrect) score += weight;
    });
    const percentage = totalPossible > 0 ? (score / totalPossible) * 100 : 0;
    let gpa = 0, grade = 'F';
    if (percentage >= 80) { gpa = 5.0; grade = 'A+'; }
    else if (percentage >= 70) { gpa = 4.0; grade = 'A'; }
    else if (percentage >= 60) { gpa = 3.5; grade = 'A-'; }
    else if (percentage >= 50) { gpa = 3.0; grade = 'B'; }
    else if (percentage >= 40) { gpa = 2.0; grade = 'C'; }
    else if (percentage >= 33) { gpa = 1.0; grade = 'D'; }
    return { score, total: totalPossible, gpa, grade, percentage };
  }, [session]);

  const handleAnswerSelect = (option: string) => {
    if (!session) return;
    const newResponses = [...session.responses];
    newResponses[currentMCQIndex] = {
      mcqId: session.mcqs[currentMCQIndex].id,
      selectedOption: option,
      isCorrect: option === session.mcqs[currentMCQIndex].correctAnswer
    };
    setSession({ ...session, responses: newResponses });
  };

  const handleFinish = () => { 
    if (session) {
      setMode(AppMode.RESULT);
      window.scrollTo(0, 0);
    }
  };

  const downloadResults = (format: 'csv' | 'txt') => {
    if (!session) return;
    const { score, total, grade, gpa } = results;
    let content = format === 'csv' 
      ? "Q,Your,Correct,Status\n" + session.mcqs.map((m, i) => `"${m.question.replace(/"/g, '""')}",${session.responses[i].selectedOption || 'N/A'},${m.correctAnswer},${session.responses[i].isCorrect ? 'OK' : 'X'}`).join('\n')
      : `RESULT: ${session.chapter.name}\nScore: ${score.toFixed(1)}/${total.toFixed(1)}\nGPA: ${gpa.toFixed(2)} (${grade})`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Result_${session.chapter.id}_${Date.now()}.${format}`;
    link.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar 
        onToggleFullscreen={handleToggleFullscreen} 
        onShowQRCode={() => setShowQRCode(true)} 
        isQuizActive={mode === AppMode.QUIZ}
      />
      {isLoading && <LoadingOverlay message={loadingMsg} />}
      {showInstallGuide && <InstallGuideModal onClose={() => setShowInstallGuide(false)} />}
      {showQRCode && <QRCodeModal onClose={() => setShowQRCode(false)} />}
      
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        {mode === AppMode.HOME && (
          <div className="space-y-10 animate-fadeIn text-center">
            <header className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight">অধ্যায় নির্বাচন করুন</h2>
              <p className="text-slate-500 font-bold">HSC Biology 1st Paper (Abul Hasan)</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                <button 
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black hover:bg-emerald-200 transition-all shadow-sm border border-emerald-200"
                >
                  <i className="fas fa-mobile-alt"></i> অ্যাপ ডাউনলোড
                </button>
                <button 
                  onClick={() => setShowQRCode(true)}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-black hover:bg-emerald-700 transition-all shadow-sm border border-emerald-700"
                >
                  <i className="fas fa-qrcode"></i> QR কোড শেয়ার
                </button>
                <button 
                  onClick={handleToggleFullscreen}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-full text-sm font-black hover:bg-slate-300 transition-all shadow-sm border border-slate-300"
                >
                  <i className="fas fa-expand-arrows-alt"></i> ফুল স্ক্রিন
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CHAPTERS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
                  className={`p-6 rounded-[2rem] border-4 transition-all text-left group cursor-pointer ${
                    selectedChapter?.id === ch.id 
                    ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-xl' 
                    : 'border-white bg-white hover:border-emerald-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-600 block mb-2 px-2 py-0.5 bg-emerald-100 w-fit rounded-full uppercase">
                    অধ্যায় {ch.id < 10 ? '০' : ''}{ch.id}
                  </span>
                  <span className="font-black text-slate-800 text-lg group-hover:text-emerald-700">{ch.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="flex flex-wrap gap-8 items-center">
                <div className="text-left space-y-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">প্রশ্নের সংখ্যা</span>
                  <div className="flex gap-2">
                    {QUIZ_CONFIGS.map(c => (
                      <button 
                        key={c.count} 
                        onClick={() => setMcqCount(c.count)} 
                        className={`px-5 py-3 rounded-xl font-black transition-all ${mcqCount === c.count ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {c.count}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer ${isHardMode ? 'bg-red-50 border-red-200 shadow-lg' : 'bg-slate-50 border-slate-100 hover:border-emerald-200'}`} onClick={() => setIsHardMode(!isHardMode)}>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${isHardMode ? 'bg-red-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHardMode ? 'left-7' : 'left-1'}`}></div>
                  </div>
                  <span className={`font-black uppercase tracking-tighter ${isHardMode ? 'text-red-600' : 'text-slate-500'}`}>Hard Mode 🔥</span>
                </div>
              </div>
              <button 
                disabled={!selectedChapter || isLoading} 
                onClick={() => handleStartExam()} 
                className="w-full lg:w-auto px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-2xl hover:bg-emerald-700 shadow-2xl disabled:opacity-50 active:scale-95 transition-all"
              >
                শুরু করুন
              </button>
            </div>
          </div>
        )}

        {mode === AppMode.QUIZ && session && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-lg border sticky top-24 z-40">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xl">{currentMCQIndex + 1}</div>
                <h3 className="font-black text-slate-800 truncate max-w-[200px]">{session.chapter.name}</h3>
              </div>
              <div className={`text-3xl font-mono font-black px-6 py-2 rounded-2xl border-4 ${timeLeft < 60 ? 'text-red-600 border-red-100 animate-pulse bg-red-50' : 'text-emerald-600 border-emerald-50'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8 min-h-[500px] flex flex-col">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">{session.mcqs[currentMCQIndex].difficulty}</span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">{session.mcqs[currentMCQIndex].topicTag}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800 leading-tight">{session.mcqs[currentMCQIndex].question}</h4>
              </div>

              <div className="grid grid-cols-1 gap-4 flex-grow">
                {Object.entries(session.mcqs[currentMCQIndex].options).map(([key, value]) => (
                  <button key={key} onClick={() => handleAnswerSelect(key)} className={`p-6 rounded-[1.5rem] border-4 text-left transition-all flex items-center gap-5 cursor-pointer ${session.responses[currentMCQIndex].selectedOption === key ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-slate-50 bg-slate-50/50 hover:border-emerald-200'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${session.responses[currentMCQIndex].selectedOption === key ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-300'}`}>{key}</div>
                    <span className="font-bold text-xl text-slate-700">{value}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-8 mt-auto border-t">
                <button disabled={currentMCQIndex === 0} onClick={() => setCurrentMCQIndex(p => p - 1)} className="p-4 rounded-xl font-black text-slate-400 hover:text-slate-800 disabled:opacity-0 cursor-pointer"><i className="fas fa-chevron-left"></i></button>
                <div className="flex gap-4">
                  {currentMCQIndex === session.mcqs.length - 1 
                    ? <button onClick={handleFinish} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all cursor-pointer">সাবমিট</button>
                    : <button onClick={() => setCurrentMCQIndex(p => p + 1)} className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all cursor-pointer">পরবর্তী <i className="fas fa-chevron-right ml-2"></i></button>
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === AppMode.RESULT && session && (
          <div className="max-w-4xl mx-auto space-y-10 animate-scaleUp text-center">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-t-[16px] border-emerald-600 space-y-8">
              <h2 className="text-5xl font-black text-slate-800">পরীক্ষার ফলাফল</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-100 flex flex-col items-center">
                  <span className="text-4xl font-black text-emerald-600">{results.score.toFixed(1)}</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">অর্জিত মার্কস</span>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-800">{results.grade}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">গ্রেড</span>
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-100 flex flex-col items-center">
                  <span className="text-4xl font-black text-amber-600">{results.gpa.toFixed(2)}</span>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mt-1">GPA</span>
                </div>
                <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 flex flex-col items-center">
                  <span className="text-4xl font-black text-blue-600">{results.percentage.toFixed(0)}%</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">সফলতা</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <button onClick={() => setMode(AppMode.CQ_VIEW)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-700 cursor-pointer">CQ ব্যাংক দেখুন</button>
                <button onClick={handleRetry} className="px-8 py-4 bg-white border-4 border-emerald-600 text-emerald-600 rounded-2xl font-black hover:bg-emerald-50 transition-all cursor-pointer flex items-center gap-2">
                  <i className="fas fa-redo"></i> আবার পরীক্ষা দিন
                </button>
                <button onClick={() => downloadResults('txt')} className="px-8 py-4 border-4 border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 cursor-pointer">রেজাল্ট ডাউনলোড</button>
                <button onClick={() => { setMode(AppMode.HOME); setSession(null); setSelectedChapter(null); }} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black cursor-pointer">হোমে ফিরুন</button>
              </div>
            </div>

            <div className="space-y-6 pb-20 text-left">
              <h3 className="text-2xl font-black text-slate-800 px-4">বিস্তারিত সমাধান</h3>
              {session.mcqs.map((m, i) => (
                <div key={i} className={`bg-white p-8 rounded-[2rem] border-l-[12px] shadow-md ${session.responses[i].isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <h4 className="text-xl font-black text-slate-800 mb-4">{i + 1}. {m.question}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm font-bold">
                    <div className={`p-4 rounded-xl border-2 ${session.responses[i].isCorrect ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>আপনার উত্তর: {session.responses[i].selectedOption || 'N/A'}</div>
                    <div className="p-4 rounded-xl border-2 bg-emerald-50 border-emerald-100 text-emerald-800">সঠিক উত্তর: {m.correctAnswer}</div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl italic text-slate-600 border border-slate-100 text-sm"><b>ব্যাখ্যা:</b> "{m.explanation}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === AppMode.CQ_VIEW && session && (
          <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-20">
             <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] shadow-xl border">
               <h2 className="text-3xl font-black text-emerald-800">সৃজনশীল (CQ)</h2>
               <button onClick={() => setMode(AppMode.RESULT)} className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black hover:bg-emerald-100 cursor-pointer">রেজাল্টে ফিরুন</button>
             </div>
             {session.cqs.map((cq, idx) => (
               <div key={idx} className="bg-white p-12 rounded-[3rem] shadow-2xl border border-emerald-50 space-y-8">
                 <div className="bg-slate-50 p-8 rounded-[2rem] italic text-slate-700 leading-relaxed text-lg border"><b>উদ্দীপক {idx + 1}:</b> {cq.stimulus}</div>
                 <div className="space-y-6">
                   {[
                     { l: 'ক', t: 'a', m: 1, c: 'জ্ঞান' },
                     { l: 'খ', t: 'b', m: 2, c: 'অনুধাবন' },
                     { l: 'গ', t: 'c', m: 3, c: 'প্রয়োগ' },
                     { l: 'ঘ', t: 'd', m: 4, c: 'উচ্চতর দক্ষতা' }
                   ].map(q => (
                     <div key={q.t} className="space-y-2">
                       <div className="flex gap-4 items-center">
                         <span className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-black">{q.l}</span>
                         <p className="font-black text-slate-800 text-lg">{cq.questions[q.t as keyof typeof cq.questions]}</p>
                         <span className="ml-auto text-xs text-slate-400 font-bold uppercase">{q.m} নম্বর</span>
                       </div>
                       <div className="ml-14 p-5 bg-emerald-50/20 rounded-2xl border border-emerald-100 text-slate-600 text-sm font-bold"><b>{q.c}:</b> {cq.answers[q.t as keyof typeof cq.answers]}</div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-500 py-12 px-8 text-center border-t border-slate-800">
        <p className="font-black text-white text-xl flex items-center justify-center gap-2 mb-4"><i className="fas fa-leaf text-emerald-500"></i> HSC Bio Bank 2027</p>
        <p className="max-w-xs mx-auto text-sm">Abul Hasan Edition Exam Simulator. Built for academic excellence.</p>
        <div className="mt-8 pt-8 border-t border-slate-800 text-[10px] uppercase font-bold tracking-[0.2em]">&copy; 2024-2025 HSC Exam Prep.</div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scaleUp { animation: scaleUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        /* Fullscreen-specific fixes */
        :fullscreen main {
          padding-top: 2rem;
        }
        :-webkit-full-screen main {
          padding-top: 2rem;
        }
      `}</style>
    </div>
  );
}
